import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import PageSwitcher from './PageSwitcher';
import StudioMenuDrawer from './StudioMenuDrawer';
import {
  Undo2, Redo2, Monitor, Tablet, Smartphone, ZoomIn, ZoomOut,
  Grid, Magnet, Eye, Download, Check, Edit2, Sparkles, Menu
} from 'lucide-react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';

interface TopBarProps {
  onOpenPreview: () => void;
  onOpenExport: () => void;
  onOpenJson: () => void;
  onOpenAiPrompt: (tab?: 'prompt' | 'image') => void;
  onOpenAssets: () => void;
  onOpenAiCopilot: () => void;
  onOpenVibes?: () => void;
  onOpenCritique?: () => void;
  onOpenBlocks?: () => void;
}

export default function TopBar({
  onOpenPreview,
  onOpenExport,
  onOpenJson,
  onOpenAiPrompt,
  onOpenAssets,
  onOpenAiCopilot,
  onOpenVibes,
  onOpenCritique,
  onOpenBlocks
}: TopBarProps) {
  const {
    projectName, setProjectName,
    activeDevice, setActiveDevice,
    zoom, zoomIn, zoomOut, resetZoom,
    showGrid, toggleGrid, gridSize, setGridSize, gridType, setGridType,
    snapToGrid, toggleSnapToGrid,
    history, future, undo, redo,
    resetTemplate
  } = useProjectStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setProjectName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between z-30 select-none shadow-sm">
        {/* Left: Brand, Project Name & Multi-Page Switcher */}
        <div className="flex items-center gap-2.5">
          <Tooltip title="Reset to LayoutForge Light Template">
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={resetTemplate}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-md shadow-primary/25">
                LF
              </div>
              <span className="font-bold text-sm tracking-tight text-onSurface hidden sm:inline">
                LayoutForge
              </span>
            </div>
          </Tooltip>

          <div className="h-5 w-px bg-border mx-0.5" />

          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                onBlur={handleNameSubmit}
                autoFocus
                className="bg-muted border border-primary rounded px-2 py-0.5 text-xs text-onSurface outline-none w-36"
              />
              <button
                onClick={handleNameSubmit}
                className="p-1 hover:text-primary text-secondary"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Tooltip title="Click to rename project">
              <div
                onClick={() => {
                  setNameInput(projectName);
                  setIsEditingName(true);
                }}
                className="flex items-center gap-1 text-xs text-onSurface hover:text-primary px-1.5 py-1 rounded hover:bg-muted cursor-pointer transition-colors max-w-[140px] truncate"
              >
                <span className="truncate font-medium">{projectName}</span>
                <Edit2 className="w-3 h-3 text-secondary opacity-60 shrink-0" />
              </div>
            </Tooltip>
          )}

          {/* Feature 5: Multi-Page Switcher */}
          <PageSwitcher />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 border-l border-border pl-1.5">
            <Tooltip title={`Undo (Ctrl+Z) - ${history.length} steps`}>
              <span>
                <button
                  onClick={undo}
                  disabled={history.length === 0}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent text-secondary hover:text-onSurface transition-colors cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
              </span>
            </Tooltip>
            <Tooltip title={`Redo (Ctrl+Y) - ${future.length} steps`}>
              <span>
                <button
                  onClick={redo}
                  disabled={future.length === 0}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent text-secondary hover:text-onSurface transition-colors cursor-pointer"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Center: Device Switcher & Zoom */}
        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="bg-muted p-0.5 rounded-lg border border-border flex items-center">
            <button
              onClick={() => setActiveDevice('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeDevice === 'desktop'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Desktop View (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setActiveDevice('tablet')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeDevice === 'tablet'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setActiveDevice('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeDevice === 'mobile'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg border border-border text-xs text-onSurface">
            <button
              onClick={zoomOut}
              className="p-0.5 text-secondary hover:text-onSurface cursor-pointer"
              title="Zoom Out (-10%)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="px-1 text-[11px] font-mono hover:text-primary cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="p-0.5 text-secondary hover:text-onSurface cursor-pointer"
              title="Zoom In (+10%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid & Snap Tools */}
          <div className="flex items-center gap-1 bg-muted p-0 rounded-lg border border-border">
            <button
              onClick={toggleGrid}
              className={`p-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                showGrid
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Toggle Canvas Grid Display"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xl:inline">Grid</span>
            </button>

            {showGrid && (
              <>
                <div className="flex bg-surface rounded border border-border p-0.5">
                  {[
                    { id: 'lines', label: 'Lines' },
                    { id: 'dots', label: 'Dots' },
                    { id: 'columns', label: '12-Col' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setGridType(type.id as 'lines' | 'dots' | 'columns')}
                      className={`px-1.5 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                        (gridType || 'lines') === type.id
                          ? 'bg-primary text-white font-semibold'
                          : 'text-secondary hover:text-onSurface'
                      }`}
                      title={`Switch to ${type.label} grid pattern`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {(gridType || 'lines') !== 'columns' && (
                  <button
                    onClick={() => {
                      const nextSize = gridSize === 10 ? 20 : gridSize === 20 ? 40 : 10;
                      setGridSize(nextSize);
                    }}
                    className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-secondary hover:text-onSurface cursor-pointer"
                    title="Cycle Grid Size (10px -> 20px -> 40px)"
                  >
                    {gridSize}px
                  </button>
                )}
              </>
            )}

            <button
              onClick={toggleSnapToGrid}
              className={`p-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                snapToGrid
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Snap to Grid while dragging/resizing"
            >
              <Magnet className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xl:inline">Snap</span>
            </button>
          </div>
        </div>

        {/* Right: Clean, Spacious & Uncluttered Action Bar */}
        <div className="flex items-center gap-2">
          {/* Studio Tools Hub (Drawer Trigger) */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsDrawerOpen(true)}
            startIcon={<Menu className="w-3.5 h-3.5 text-purple-600" />}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'purple.main',
                bgcolor: 'purple.lighter'
              }
            }}
            title="Open Studio Tools Menu (AI Copilot, Stitch Vibes, Blocks, Critique, Assets, JSON)"
          >
            <span>Studio Tools</span>
            <Chip
              label="Menu"
              size="small"
              sx={{
                ml: 1,
                height: 18,
                fontSize: '0.625rem',
                bgcolor: '#F3E8FF',
                color: '#7E22CE',
                fontWeight: 700
              }}
            />
          </Button>

          {/* AI Prompt Studio (Fast 1-Click Launch) */}
          {/* <Button
            variant="contained"
            size="small"
            onClick={() => onOpenAiPrompt && onOpenAiPrompt('prompt')}
            startIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
            sx={{
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5, #9333EA)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.28)',
              '&:hover': {
                background: 'linear-gradient(135deg, #6D28D9, #4338CA, #7E22CE)',
                transform: 'scale(1.02)'
              }
            }}
            title="AI Prompt Studio (Ctrl+K)"
          >
            <span>AI Prompt</span>
            <Chip
              label="⌘K"
              size="small"
              sx={{
                ml: 1,
                height: 18,
                fontSize: '0.625rem',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                display: { xs: 'none', sm: 'inline-flex' }
              }}
            />
          </Button> */}

          <div className="h-5 w-px bg-border mx-0.5" />

          {/* Live Preview Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={onOpenPreview}
            startIcon={<Eye className="w-3.5 h-3.5 text-emerald-600" />}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '0.75rem',
              borderRadius: 2,
              bgcolor: 'background.paper',
              fontWeight: 500
            }}
          >
            Preview
          </Button>

          {/* Production Export Button */}
          <Button
            variant="contained"
            size="small"
            onClick={onOpenExport}
            startIcon={<Download className="w-3.5 h-3.5" />}
            sx={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
            }}
          >
            Export
          </Button>
        </div>
      </header>

      {/* Slide-over Studio Menu Drawer */}
      <StudioMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenAiPrompt={onOpenAiPrompt}
        onOpenVibes={onOpenVibes || (() => {})}
        onOpenCritique={onOpenCritique || (() => {})}
        onOpenBlocks={onOpenBlocks || (() => {})}
        onOpenAiCopilot={onOpenAiCopilot}
        onOpenAssets={onOpenAssets}
        onOpenJson={onOpenJson}
        onOpenPreview={onOpenPreview}
        onOpenExport={onOpenExport}
      />
    </>
  );
}
