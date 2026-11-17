import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Drawer,
  IconButton,
  Button,
  Chip,
  Divider,
  Typography
} from '@mui/material';
import {
  X, Sparkles, Palette, Award, LayoutGrid, Wand2,
  Image as ImageIcon, FileCode2, Trash2, Grid, Magnet,
  Eye, Download, ChevronRight, Layers, Move, Sliders
} from 'lucide-react';

interface StudioMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiPrompt: (tab?: 'prompt' | 'image') => void;
  onOpenVibes: () => void;
  onOpenCritique: () => void;
  onOpenBlocks: () => void;
  onOpenAiCopilot: () => void;
  onOpenAssets: () => void;
  onOpenJson: () => void;
  onOpenPreview: () => void;
  onOpenExport: () => void;
}

export default function StudioMenuDrawer({
  isOpen,
  onClose,
  onOpenAiPrompt,
  onOpenVibes,
  onOpenCritique,
  onOpenBlocks,
  onOpenAiCopilot,
  onOpenAssets,
  onOpenJson,
  onOpenPreview,
  onOpenExport
}: StudioMenuDrawerProps) {
  const { clearCanvas, showGrid, toggleGrid, snapToGrid, toggleSnapToGrid } = useProjectStore();

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      {/* Drawer Header */}
      <div className="h-16 border-b border-border px-5 flex items-center justify-between bg-surface shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-onSurface">Studio Tools Hub</h2>
            <p className="text-[11px] text-secondary">AI engines, vibe tokens & design tools</p>
          </div>
        </div>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
        >
          <X className="w-4 h-4" />
        </IconButton>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section 1: Google Stitch AI & Creation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              AI Generation & Stitch Tools
            </span>
            <Chip
              label="Stitch AI"
              size="small"
              sx={{ height: 18, fontSize: '0.625rem', bgcolor: '#F3E8FF', color: '#7E22CE', fontWeight: 700 }}
            />
          </div>

          <div className="space-y-1.5">
            {/* AI Prompt Studio */}
            <div
              onClick={() => handleAction(() => onOpenAiPrompt('prompt'))}
              className="p-3 rounded-xl border border-border bg-surface hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-onSurface group-hover:text-purple-700 transition-colors">
                      AI Prompt & Image Studio
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-secondary">
                      ⌘K
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Generate full page layouts from natural language or reference images
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>

            {/* Stitch Vibe Design System Tokens */}
            <div
              onClick={() => handleAction(onOpenVibes)}
              className="p-3 rounded-xl border border-border bg-surface hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-purple-700 transition-colors">
                    Stitch Vibe Design Tokens
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Switch 18 themes or upload design.md to import custom color palettes & fonts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>

            {/* AI Copilot & Section Assistant */}
            <div
              onClick={() => handleAction(onOpenAiCopilot)}
              className="p-3 rounded-xl border border-border bg-surface hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-indigo-700 transition-colors">
                    AI Section Copilot & Stylist
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Rephrase copywriting, generate companion elements & fine-tune styles
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>

            {/* AI Design Critique & Auto-Polish */}
            <div
              onClick={() => handleAction(onOpenCritique)}
              className="p-3 rounded-xl border border-border bg-surface hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-emerald-700 transition-colors">
                    AI Design Critique & Auto-Polish
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Live WCAG contrast audit, hierarchy score & 1-click harmonizer
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Section 2: UI Blocks & Asset Library */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Components & Assets
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Stitch UI Blocks */}
            <div
              onClick={() => handleAction(onOpenBlocks)}
              className="p-3 rounded-xl border border-border bg-surface hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-blue-700 transition-colors">
                    Stitch Pre-built UI Blocks
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Insert Bento grids, metric bars & client testimonial trios
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>

            {/* Asset Library */}
            <div
              onClick={() => handleAction(onOpenAssets)}
              className="p-3 rounded-xl border border-border bg-surface hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-sky-700 transition-colors">
                    Asset Library (Photos & Icons)
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Browse Unsplash architecture photos & 100+ Lucide vector icons
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Section 3: Canvas Utilities & Project */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Canvas & Project Operations
            </span>
          </div>

          <div className="space-y-1.5">
            {/* JSON Backup */}
            <div
              onClick={() => handleAction(onOpenJson)}
              className="p-3 rounded-xl border border-border bg-surface hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-amber-700 transition-colors">
                    Project Backup & Restore (JSON)
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Export full schema or restore a previous project snapshot
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>

            {/* Clear Canvas */}
            <div
              onClick={() => {
                if (window.confirm('Clear all elements from the canvas? You can undo with Ctrl+Z.')) {
                  clearCanvas();
                  onClose();
                }
              }}
              className="p-3 rounded-xl border border-border bg-surface hover:border-red-400 hover:bg-red-50/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-onSurface group-hover:text-red-700 transition-colors">
                    Clear Canvas
                  </span>
                  <p className="text-[11px] text-secondary mt-0.5 leading-tight">
                    Reset all elements on active artboard (Undo with Ctrl+Z)
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer with Quick Preview & Export */}
      <div className="p-4 border-t border-border bg-muted/40 shrink-0 flex items-center gap-2">
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleAction(onOpenPreview)}
          startIcon={<Eye className="w-4 h-4 text-emerald-600" />}
          sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2 }}
        >
          Preview Site
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={() => handleAction(onOpenExport)}
          startIcon={<Download className="w-4 h-4" />}
          sx={{
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 2
          }}
        >
          Export Code
        </Button>
      </div>
    </Drawer>
  );
}
