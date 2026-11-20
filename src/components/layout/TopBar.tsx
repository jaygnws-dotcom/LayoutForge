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
  isStudioDrawerOpen?: boolean;
  onOpenStudioDrawer?: () => void;
  onCloseStudioDrawer?: () => void;
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
  onOpenBlocks,
  isStudioDrawerOpen: controlledDrawerOpen,
  onOpenStudioDrawer,
  onCloseStudioDrawer
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
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

  const isDrawerOpen = controlledDrawerOpen !== undefined ? controlledDrawerOpen : internalDrawerOpen;
  const handleOpenDrawer = () => {
    if (onOpenStudioDrawer) onOpenStudioDrawer();
    else setInternalDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    if (onCloseStudioDrawer) onCloseStudioDrawer();
    else setInternalDrawerOpen(false);
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setProjectName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-surface px-2 sm:px-4 flex items-center justify-between z-30 select-none shadow-sm w-full max-w-full overflow-hidden">
        {/* Left: Brand, Project Name & Multi-Page Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <Tooltip title="Reset to LayoutForge Light Template">
            <div
              className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0"
              onClick={resetTemplate}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-md shadow-primary/25 text-xs sm:text-sm">
                LF
              </div>
              <span className="font-bold text-sm tracking-tight text-onSurface hidden md:inline">
                LayoutForge
              </span>
            </div>
          </Tooltip>

          <div className="h-5 w-px bg-border mx-0.5 hidden xs:block shrink-0" />

          {/* Project Name (Click to edit) */}
          {isEditingName ? (
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                onBlur={handleNameSubmit}
                autoFocus
                className="bg-muted border border-primary rounded px-1.5 py-0.5 text-xs text-onSurface outline-none w-24 sm:w-36"
              />
              <button
                onClick={handleNameSubmit}
                className="p-1 hover:text-primary text-secondary cursor-pointer"
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
                className="flex items-center gap-1 text-xs text-onSurface hover:text-primary px-1 sm:px-1.5 py-1 rounded hover:bg-muted cursor-pointer transition-colors max-w-[65px] xs:max-w-[100px] sm:max-w-[140px] truncate shrink-0"
              >
                <span className="truncate font-medium">{projectName}</span>
                <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary opacity-60 shrink-0" />
              </div>
            </Tooltip>
          )}

          {/* Feature 5: Multi-Page Switcher */}
          <div className="shrink-0">
            <PageSwitcher />
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 border-l border-border pl-1 sm:pl-1.5 shrink-0">
            <Tooltip title={`Undo (Ctrl+Z) - ${history.length} steps`}>
              <span>
                <button
                  onClick={undo}
                  disabled={history.length === 0}
                  className="p-1 sm:p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent text-secondary hover:text-onSurface transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </span>
            </Tooltip>
            <Tooltip title={`Redo (Ctrl+Y) - ${future.length} steps`}>
              <span>
                <button
                  onClick={redo}
                  disabled={future.length === 0}
                  className="p-1 sm:p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent text-secondary hover:text-onSurface transition-colors cursor-pointer"
                >
                  <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Center: Desktop Device Switcher, Zoom & Grid Tools */}
        <div className="hidden lg:flex items-center gap-2">
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
              <span>Desktop</span>
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
              <span>Tablet</span>
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
              <span>Mobile</span>
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

        {/* Center Compact: Mobile/Tablet Device Toggle (hidden on desktop & small xs) */}
        <div className="hidden sm:flex lg:hidden items-center bg-muted p-0.5 rounded-lg border border-border shrink-0">
          <button
            onClick={() => setActiveDevice('desktop')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeDevice === 'desktop' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-onSurface'
            }`}
            title="Desktop View (1440px)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveDevice('tablet')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeDevice === 'tablet' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-onSurface'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveDevice('mobile')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeDevice === 'mobile' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-onSurface'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions (Studio Tools, Preview, Export) - Fully Responsive */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Studio Tools Hub Button - Desktop view */}
          <div className="hidden sm:block">
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenDrawer}
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
          </div>

          {/* Studio Tools Hub Button - Mobile Icon View */}
          <div className="sm:hidden">
            <Tooltip title="Studio Tools Menu">
              <IconButton
                size="small"
                onClick={handleOpenDrawer}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  p: 0.8,
                  borderRadius: 2
                }}
              >
                <Menu className="w-4 h-4 text-purple-600" />
              </IconButton>
            </Tooltip>
          </div>

          <div className="h-5 w-px bg-border mx-0.5 hidden xs:block" />

          {/* Live Preview Button - Desktop */}
          <div className="hidden sm:block">
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
          </div>

          {/* Live Preview Button - Mobile */}
          <div className="sm:hidden">
            <Tooltip title="Preview Site">
              <IconButton
                size="small"
                onClick={onOpenPreview}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  p: 0.8,
                  borderRadius: 2,
                  color: 'emerald.main'
                }}
              >
                <Eye className="w-4 h-4 text-emerald-600" />
              </IconButton>
            </Tooltip>
          </div>

          {/* Production Export Button - Desktop */}
          <div className="hidden sm:block">
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

          {/* Production Export Button - Mobile */}
          <div className="sm:hidden">
            <Tooltip title="Export Code (React & HTML)">
              <button
                type="button"
                onClick={onOpenExport}
                className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs flex items-center justify-center cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Slide-over Studio Menu Drawer */}
      <StudioMenuDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
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
