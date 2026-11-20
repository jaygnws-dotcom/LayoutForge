import React, { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { generateProjectCode } from '../../engine/htmlGenerator';
import {
  Monitor, Tablet, Smartphone, X, RotateCcw, ExternalLink,
  GripVertical, Maximize2, Minimize2, Lock, Globe, Eye, Layers
} from 'lucide-react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Chip
} from '@mui/material';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { elements, pageSettings, projectName, pages, activePageId } = useProjectStore();

  const [deviceMode, setDeviceMode] = useState<'fullscreen' | 'desktop' | 'tablet' | 'mobile'>('fullscreen');
  const [frameWidth, setFrameWidth] = useState<number | '100%'>('100%');
  const [isImmersive, setIsImmersive] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const [previewPageId, setPreviewPageId] = useState<string>(activePageId || 'page_home');
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (activePageId) setPreviewPageId(activePageId);
  }, [activePageId]);

  useEffect(() => {
    if (deviceMode === 'fullscreen') setFrameWidth('100%');
    else if (deviceMode === 'desktop') setFrameWidth(1440);
    else if (deviceMode === 'tablet') setFrameWidth(768);
    else if (deviceMode === 'mobile') setFrameWidth(375);
  }, [deviceMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isImmersive) {
          setIsImmersive(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isImmersive, onClose]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const container = document.getElementById('preview-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = Math.max(320, Math.min(1920, e.clientX - rect.left));
        setFrameWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  // Resolve current active preview page (multi-screen interactive prototyping)
  const currentPageObj = pages?.find((p: any) => p.id === previewPageId);
  const previewElements = (currentPageObj?.elements && currentPageObj.elements.length > 0)
    ? currentPageObj.elements
    : elements;
  const previewSettings = currentPageObj?.pageSettings || pageSettings;
  const pagePath = currentPageObj?.path || '/';

  const { singleFile } = generateProjectCode(previewElements, previewSettings);

  const handleOpenInNewTab = () => {
    const blob = new Blob([singleFile], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const isFullscreen = deviceMode === 'fullscreen' || frameWidth === '100%';
  const previewSlug = (projectName || 'layoutforge-project').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col select-none animate-in fade-in duration-150">
      {/* Top Preview Navigation Bar (hidden in immersive true-tab mode) */}
      {!isImmersive && (
        <div className="min-h-14 py-1.5 border-b border-border bg-surface px-2 sm:px-4 flex flex-wrap items-center justify-between gap-2 shadow-sm shrink-0 z-10 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', display: { xs: 'none', md: 'block' } }}>
              Live Preview
            </Typography>

            {/* Multi-Screen Prototype Switcher (Stitch Interactive Flow) */}
            {pages && pages.length > 1 && (
              <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border">
                {pages.map((page: any) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setPreviewPageId(page.id);
                      setKey(k => k + 1);
                    }}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-xs transition-colors cursor-pointer ${
                      previewPageId === page.id
                        ? 'bg-surface text-primary font-bold shadow-2xs'
                        : 'text-secondary hover:text-onSurface'
                    }`}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )}

            {/* Simulated Browser URL bar */}
            <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1 rounded-lg border border-border text-xs text-secondary font-mono max-w-xs truncate">
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">https://preview.layoutforge.dev/{previewSlug}{pagePath === '/' ? '' : pagePath}</span>
            </div>

            <Chip
              label={isFullscreen ? '100%' : `${typeof frameWidth === 'number' ? Math.round(frameWidth) : frameWidth}px`}
              size="small"
              sx={{
                fontFamily: 'monospace',
                height: 22,
                fontSize: '0.6875rem',
                bgcolor: isFullscreen ? 'primary.lighter' : 'action.selected',
                color: isFullscreen ? 'primary.main' : 'text.primary',
                fontWeight: 600
              }}
            />
          </div>

          {/* Device & Full Screen Toggles */}
          <div className="flex items-center gap-1 bg-muted p-0.5 sm:p-1 rounded-lg border border-border">
            <button
              onClick={() => {
                setDeviceMode('fullscreen');
                setFrameWidth('100%');
              }}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                deviceMode === 'fullscreen'
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Full Screen Edge-to-Edge (100% Width & Height)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="font-semibold hidden sm:inline">Full Screen</span>
            </button>

            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Desktop Simulation (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>

            <button
              onClick={() => setDeviceMode('tablet')}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                deviceMode === 'tablet'
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Tablet Simulation (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>

            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-primary text-white font-medium shadow-xs'
                  : 'text-secondary hover:text-onSurface'
              }`}
              title="Mobile Simulation (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <Tooltip title="Reload Preview & Replay Animations">
              <IconButton
                size="small"
                onClick={() => setKey(k => k + 1)}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Immersive Mode (Hide Browser Controls)">
              <IconButton
                size="small"
                onClick={() => {
                  setDeviceMode('fullscreen');
                  setFrameWidth('100%');
                  setIsImmersive(true);
                }}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                <Eye className="w-3.5 h-3.5 text-primary" />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenInNewTab}
              startIcon={<ExternalLink className="w-3.5 h-3.5" />}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '0.75rem',
                borderRadius: 2
              }}
            >
              Open in New Tab
            </Button>

            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': { bgcolor: 'error.lighter', color: 'error.main' }
              }}
            >
              <X className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      )}

      {/* Floating Pill when Immersive Fullscreen is Active */}
      {isImmersive && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-border rounded-xl p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2">
          <span className="text-xs text-secondary font-mono px-2">Immersive Preview (100% × 100%)</span>
          <Button
            size="small"
            variant="outlined"
            onClick={handleOpenInNewTab}
            startIcon={<ExternalLink className="w-3 h-3" />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', height: 28, borderRadius: 1.5 }}
          >
            New Tab
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => setIsImmersive(false)}
            startIcon={<Minimize2 className="w-3 h-3" />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', height: 28, borderRadius: 1.5 }}
          >
            Exit Immersive
          </Button>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, width: 28, height: 28 }}
          >
            <X className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      )}

      {/* Frame Container: 100% Edge-to-Edge Full Screen (Real Tab Experience) */}
      <div
        className={`flex-1 overflow-hidden relative ${
          isFullscreen
            ? 'w-full h-full p-0 bg-surface'
            : 'bg-muted p-6 flex justify-center items-center'
        }`}
      >
        <div
          id="preview-container"
          style={{
            width: isFullscreen ? '100%' : `${frameWidth}px`,
            height: '100%'
          }}
          className={`relative flex bg-surface overflow-hidden ${
            isFullscreen
              ? 'w-full h-full rounded-none border-0 shadow-none'
              : 'rounded-2xl shadow-2xl border border-border transition-[width] duration-75 h-[92vh]'
          }`}
        >
          <iframe
            key={key}
            srcDoc={singleFile}
            title="LayoutForge Fullscreen Live Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0 bg-transparent"
          />

          {/* Interactive Drag Handle (only when simulating specific device width) */}
          {!isFullscreen && (
            <div
              onMouseDown={(e) => {
                isDraggingRef.current = true;
                document.body.style.cursor = 'ew-resize';
                e.preventDefault();
              }}
              className="absolute right-0 top-0 bottom-0 w-3 hover:w-4 bg-primary/20 hover:bg-primary/50 cursor-ew-resize flex items-center justify-center transition-colors group z-20"
              title="Drag horizontally to resize preview width"
            >
              <GripVertical className="w-3 h-3 text-secondary group-hover:text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
