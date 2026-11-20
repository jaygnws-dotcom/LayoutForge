import React, { useRef, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useProjectStore } from '../../store/useProjectStore';
import CanvasElement from './CanvasElement';
import SnapGuides from './SnapGuides';
import GridOverlay from './GridOverlay';
import ContextMenu from './ContextMenu';
import { Monitor, Tablet, Smartphone, Layers, Move, Sparkles, ChevronDown, Check } from 'lucide-react';
import { doBoxesIntersect } from '../../utils/groupingUtils';
import { STITCH_VIBES } from '../../types/vibes';
import { applyVibeTheme } from '../../engine/vibeEngine';
import { getResponsiveElementGeometry, getResponsiveArtboardMinHeight } from '../../engine/responsive';

export default function CanvasArtboard() {
  const {
    elements, selectedElementIds, clearSelection, selectElement,
    zoom, activeDevice, pageSettings,
    showGrid, gridSize, gridType,
    undo, redo, deleteElements, duplicateElements, copySelected, pasteClipboard,
    nudgeSelected, groupElements, ungroupElements
  } = useProjectStore();

  const artboardRef = useRef(null);
  const containerRef = useRef(null);

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, elementId: null });
  const [guides, setGuides] = useState([]);
  const [marqueeBox, setMarqueeBox] = useState(null);
  const marqueeStartRef = useRef(null);

  const [isVibeMenuOpen, setIsVibeMenuOpen] = useState(false);
  const vibeMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (vibeMenuRef.current && !vibeMenuRef.current.contains(e.target)) {
        setIsVibeMenuOpen(false);
      }
    };
    if (isVibeMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isVibeMenuOpen]);

  const currentVibe = STITCH_VIBES.find(v => v.id === pageSettings.activeVibeId) ||
    STITCH_VIBES.find(v => v.colors.background?.toLowerCase() === pageSettings.backgroundColor?.toLowerCase()) ||
    null;

  const handleSelectVibe = (vibe) => {
    useProjectStore.getState().pushHistory();
    const currentState = useProjectStore.getState();
    const { elements: nextEl, pageSettings: nextSet } = applyVibeTheme(
      vibe,
      currentState.elements,
      currentState.pageSettings
    );
    const updatedSettings = { ...nextSet, activeVibeId: vibe.id };

    useProjectStore.setState(state => {
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextEl, pageSettings: updatedSettings } : p
      );
      return {
        elements: nextEl,
        pageSettings: updatedSettings,
        pages: updatedPages
      };
    });
    useProjectStore.getState().saveToStorage();
    setIsVibeMenuOpen(false);
  };

  const deviceWidthMap = {
    desktop: pageSettings.pageWidth || 1440,
    tablet: 768,
    mobile: 375
  };
  const currentArtboardWidth = deviceWidthMap[activeDevice] || 1440;

  const deviceLabels = {
    desktop: 'Desktop Artboard',
    tablet: 'Tablet Artboard',
    mobile: 'Mobile Artboard'
  };

  const DeviceIcon = activeDevice === 'desktop' ? Monitor : activeDevice === 'tablet' ? Tablet : Smartphone;

  const { setNodeRef } = useDroppable({
    id: 'canvas-artboard',
    data: {
      isCanvas: true
    }
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (cmdOrCtrl && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
        return;
      }

      if (cmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        copySelected();
        return;
      }

      if (cmdOrCtrl && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        pasteClipboard();
        return;
      }

      if (cmdOrCtrl && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateElements();
        return;
      }

      // Group (Ctrl+G) & Ungroup (Ctrl+Shift+G)
      if (cmdOrCtrl && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        if (e.shiftKey) {
          ungroupElements();
        } else {
          groupElements();
        }
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          deleteElements();
        }
        return;
      }

      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeSelected(0, -step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudgeSelected(0, step);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudgeSelected(-step, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudgeSelected(step, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds, undo, redo, deleteElements, duplicateElements, copySelected, pasteClipboard, nudgeSelected, groupElements, ungroupElements]);

  // Marquee selection handling on artboard background
  const handleArtboardMouseDown = (e) => {
    // Only trigger if clicking directly on the artboard background (not an element)
    if (e.target !== artboardRef.current) return;
    if (e.button !== 0) return; // Left click only

    const rect = artboardRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    marqueeStartRef.current = {
      startX,
      startY,
      shiftKey: e.shiftKey,
      initialSelected: e.shiftKey ? [...selectedElementIds] : []
    };

    setMarqueeBox(null);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!marqueeStartRef.current || !artboardRef.current) return;

      const rect = artboardRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) / zoom;
      const currentY = (e.clientY - rect.top) / zoom;

      const { startX, startY, shiftKey, initialSelected } = marqueeStartRef.current;

      const box = {
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY)
      };

      setMarqueeBox(box);

      // Find all elements intersecting this marquee selection box
      if (box.width > 5 || box.height > 5) {
        const intersectingIds = elements
          .filter(el => !el.hidden && doBoxesIntersect(box, el))
          .map(el => el.id);

        const newSelected = shiftKey
          ? Array.from(new Set([...initialSelected, ...intersectingIds]))
          : intersectingIds;

        useProjectStore.setState({ selectedElementIds: newSelected });
      }
    };

    const handleMouseUp = () => {
      if (marqueeStartRef.current) {
        if (!marqueeBox || (marqueeBox.width < 5 && marqueeBox.height < 5)) {
          // It was a simple click on empty space, clear selection
          if (!marqueeStartRef.current.shiftKey) {
            clearSelection();
          }
        }
        marqueeStartRef.current = null;
        setMarqueeBox(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [elements, zoom, clearSelection, marqueeBox]);

  const handleOpenContextMenu = (e, elementId) => {
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      elementId
    });
  };

  // Dynamic workspace environment styling adapting to theme background color
  const isDarkCanvas = (() => {
    const bg = (pageSettings.backgroundColor || '').toLowerCase().trim();
    if (!bg) return false;
    if (bg.startsWith('#0') || bg.startsWith('#1') || bg === '#262626' || bg === '#18181b') return true;
    if (bg.startsWith('#') && bg.length === 7) {
      const r = parseInt(bg.slice(1, 3), 16);
      const g = parseInt(bg.slice(3, 5), 16);
      const b = parseInt(bg.slice(5, 7), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) < 110;
    }
    return false;
  })();

  const isWarmCanvas = (() => {
    const bg = (pageSettings.backgroundColor || '').toLowerCase().trim();
    return ['#f6f3ee', '#f5f2eb', '#faf8f5', '#faf6f0', '#f7f4ed', '#f5ede6'].includes(bg);
  })();

  const workspaceBg = isDarkCanvas ? '#0E1117' : (isWarmCanvas ? '#EDE9E2' : '#F4F5F7');

  const responsiveMinHeight = getResponsiveArtboardMinHeight(elements, activeDevice, pageSettings.minHeight || 960);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: workspaceBg,
        transition: 'background-color 0.35s ease'
      }}
      className="flex-1 h-full overflow-auto relative p-2 sm:p-6 md:p-12 pb-28 lg:pb-12 flex justify-center items-start select-none cursor-default"
    >
      {/* Scaled Artboard Wrapper */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}
        className="my-2 sm:my-4 flex flex-col items-center transition-all max-w-full"
      >
        {/* Figma-style Artboard Label Header */}
        <div className={`flex flex-wrap items-center justify-between gap-2 w-full mb-2 px-1 text-xs font-medium ${isDarkCanvas ? 'text-slate-400' : 'text-secondary'}`}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <DeviceIcon className="w-3.5 h-3.5 text-primary" />
              <span className={`font-semibold ${isDarkCanvas ? 'text-white' : 'text-onSurface'}`}>{deviceLabels[activeDevice]}</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border shadow-2xs ${
                isDarkCanvas
                  ? 'bg-slate-800/90 text-slate-200 border-slate-700'
                  : 'bg-white text-secondary border-border'
              }`}>
                {currentArtboardWidth} × {responsiveMinHeight}px
              </span>
            </div>

            {/* Quick Stitch Design Vibe Selector on CanvasArtboard */}
            <div className="relative" ref={vibeMenuRef}>
              <button
                type="button"
                onClick={() => setIsVibeMenuOpen(!isVibeMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border shadow-2xs transition-all cursor-pointer ${
                  isDarkCanvas
                    ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-onSurface border-border'
                }`}
                title="Select & apply design theme to canvas"
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span className="opacity-75">Theme:</span>
                <span className="font-semibold">{currentVibe?.name || 'Curated Design'}</span>
                <div
                  className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                  style={{ backgroundColor: currentVibe?.colors.primary || '#6366F1' }}
                />
                <ChevronDown className="w-3 h-3 text-secondary" />
              </button>

              {/* Dropdown Menu */}
              {isVibeMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-72 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto"
                  style={{
                    backgroundColor: isDarkCanvas ? '#151821' : '#FFFFFF',
                    border: `1px solid ${isDarkCanvas ? '#2D3343' : '#E6E6E6'}`
                  }}
                >
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary flex items-center justify-between border-b border-border/50 mb-1">
                    <span>Stitch Design System ({STITCH_VIBES.length})</span>
                    <span className="text-purple-500 font-semibold">Live Apply</span>
                  </div>

                  <div className="space-y-1">
                    {STITCH_VIBES.map((vibe) => {
                      const isActive = currentVibe?.id === vibe.id;
                      return (
                        <button
                          key={vibe.id}
                          type="button"
                          onClick={() => handleSelectVibe(vibe)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-purple-600/15 text-purple-600 font-semibold border border-purple-500/30'
                              : 'hover:bg-muted text-onSurface border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                              style={{ backgroundColor: vibe.colors.primary }}
                            />
                            <div className="truncate">
                              <div className="font-medium text-[11px] truncate">{vibe.name}</div>
                              <div className="text-[9px] text-secondary truncate">
                                {vibe.category} • BG {vibe.colors.background}
                              </div>
                            </div>
                          </div>

                          {isActive && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`hidden sm:flex items-center gap-2 text-[11px] ${isDarkCanvas ? 'text-slate-400' : 'text-secondary'}`}>
            <span className="flex items-center gap-1 font-mono">
              <Move className="w-3 h-3 text-primary" />
              <span>Shift+Drag moves card + contents</span>
            </span>
          </div>
        </div>

        {/* The Artboard */}
        <div
          ref={(node) => {
            artboardRef.current = node;
            setNodeRef(node);
          }}
          data-canvas="artboard"
          onMouseDown={handleArtboardMouseDown}
          style={{
            width: `${currentArtboardWidth}px`,
            minHeight: `${responsiveMinHeight}px`,
            backgroundColor: pageSettings.backgroundColor || '#FFFFFF',
            backgroundImage: pageSettings.backgroundGradient || (pageSettings.backgroundImage ? `url(${pageSettings.backgroundImage})` : undefined),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: `"${pageSettings.defaultFont || 'Rethink Sans'}", sans-serif`,
            boxShadow: isDarkCanvas
              ? '0 25px 65px -10px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px #E6E6E6',
            transition: 'background-color 0.35s ease, box-shadow 0.35s ease'
          }}
          className={`relative rounded-2xl transition-all overflow-hidden ${
            showGrid ? (gridSize === 10 ? 'canvas-grid-pattern-dense' : 'canvas-grid-pattern') : ''
          }`}
        >
          <GridOverlay showGrid={showGrid} gridSize={gridSize} gridType={gridType} />
          <SnapGuides guides={guides} />

          {/* Marquee Selection Box */}
          {marqueeBox && (
            <div
              style={{
                position: 'absolute',
                left: `${marqueeBox.x}px`,
                top: `${marqueeBox.y}px`,
                width: `${marqueeBox.width}px`,
                height: `${marqueeBox.height}px`,
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                border: '1.5px dashed #2563EB',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 9999
              }}
            />
          )}

          {elements.map((el) => {
            const isSelected = selectedElementIds.includes(el.id);
            const responsiveEl = getResponsiveElementGeometry(el, activeDevice, elements, 1440);
            return (
              <CanvasElement
                key={el.id}
                element={responsiveEl}
                originalElement={el}
                activeDevice={activeDevice}
                zoom={zoom}
                isSelected={isSelected}
                isMultiSelected={selectedElementIds.length > 1}
                onContextMenu={handleOpenContextMenu}
              />
            );
          })}
        </div>
      </div>

      <ContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0, elementId: null })}
      />
    </div>
  );
}
