import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { GOOGLE_FONTS_LIST, THEME_COLORS } from '../../types/elements';
import { Sliders, Sparkles, Grid, Magnet } from 'lucide-react';

export default function PageSettingsSection() {
  const {
    pageSettings, updatePageSettings, resetTemplate,
    showGrid, toggleGrid, gridSize, setGridSize,
    gridType, setGridType, snapToGrid, toggleSnapToGrid
  } = useProjectStore();

  const [bgMode, setBgMode] = useState(
    pageSettings.backgroundGradient ? 'gradient' : 'solid'
  );

  return (
    <div className="p-4 space-y-4 text-xs select-none bg-surface">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="w-6 h-6 rounded bg-accentSoft text-primary flex items-center justify-center">
          <Sliders className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="font-semibold text-onSurface">Global Page Settings</h3>
          <p className="text-[10px] text-secondary">Configure artboard defaults</p>
        </div>
      </div>

      {/* Default Font */}
      <div>
        <label className="text-[10px] text-secondary block mb-1">Global Default Font</label>
        <select
          value={pageSettings.defaultFont || 'Rethink Sans'}
          onChange={(e) => updatePageSettings({ defaultFont: e.target.value })}
          className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-onSurface outline-none focus:border-primary"
        >
          {GOOGLE_FONTS_LIST.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {/* Page Width & Min Height */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Artboard Width (px)</label>
          <input
            type="number"
            value={pageSettings.pageWidth || 1440}
            onChange={(e) => updatePageSettings({ pageWidth: parseInt(e.target.value, 10) || 1440 })}
            className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Min Height (px)</label>
          <input
            type="number"
            value={pageSettings.minHeight || 960}
            onChange={(e) => updatePageSettings({ minHeight: parseInt(e.target.value, 10) || 960 })}
            className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Page Background */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
          Canvas Artboard Background
        </label>

        <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border text-[11px]">
          <button
            onClick={() => {
              setBgMode('solid');
              updatePageSettings({ backgroundColor: THEME_COLORS.surface, backgroundGradient: null, backgroundImage: null });
            }}
            className={`flex-1 py-1 rounded transition-colors ${
              bgMode === 'solid' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
            }`}
          >
            Solid White
          </button>
          <button
            onClick={() => {
              setBgMode('gradient');
              updatePageSettings({
                backgroundGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
                backgroundImage: null
              });
            }}
            className={`flex-1 py-1 rounded transition-colors ${
              bgMode === 'gradient' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
            }`}
          >
            Soft Fade
          </button>
        </div>

        {bgMode === 'solid' ? (
          <div>
            <div className="flex items-center gap-2 bg-muted border border-border rounded px-2 py-1.5">
              <input
                type="color"
                value={pageSettings.backgroundColor || THEME_COLORS.surface}
                onChange={(e) => updatePageSettings({ backgroundColor: e.target.value, backgroundGradient: null })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-onSurface text-xs">{pageSettings.backgroundColor || '#FFFFFF'}</span>
            </div>
          </div>
        ) : (
          <div>
            <label className="text-[10px] text-secondary block mb-1">CSS Gradient String</label>
            <input
              type="text"
              value={pageSettings.backgroundGradient || ''}
              onChange={(e) => updatePageSettings({ backgroundGradient: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2.5 py-1 text-xs text-onSurface outline-none font-mono text-[11px] focus:border-primary"
            />
          </div>
        )}
      </div>

      {/* Canvas Grid & Snap-to-Grid */}
      <div className="space-y-2.5 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-primary" />
            <span>Canvas Alignment Grid</span>
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={toggleGrid}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {showGrid && (
          <div className="space-y-2.5 bg-muted/40 p-2.5 rounded-lg border border-border">
            <div>
              <label className="text-[10px] text-secondary block mb-1">Grid Pattern Style</label>
              <div className="flex border border-border rounded bg-surface p-0.5">
                {[
                  { id: 'lines', label: 'Drafting Lines' },
                  { id: 'dots', label: 'Dot Matrix' },
                  { id: 'columns', label: '12 Columns' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setGridType(type.id)}
                    className={`flex-1 py-1 text-[10px] rounded transition-colors ${
                      (gridType || 'lines') === type.id
                        ? 'bg-primary text-white font-medium'
                        : 'text-secondary hover:text-onSurface'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {(gridType || 'lines') !== 'columns' && (
              <div>
                <label className="text-[10px] text-secondary block mb-1">Grid Cell Size</label>
                <div className="flex border border-border rounded bg-surface p-0.5">
                  {[10, 20, 40].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGridSize(size)}
                      className={`flex-1 py-1 text-[10px] rounded transition-colors ${
                        gridSize === size
                          ? 'bg-primary text-white font-medium'
                          : 'text-secondary hover:text-onSurface'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-border/60">
              <span className="text-[10px] text-secondary flex items-center gap-1">
                <Magnet className="w-3 h-3 text-primary" />
                <span>Snap Elements to Grid</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={toggleSnapToGrid}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border">
        <button
          onClick={resetTemplate}
          className="w-full py-2 px-3 rounded-lg bg-accentSoft hover:bg-primary text-primary hover:text-white border border-primary/30 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reset to Light Demo Layout</span>
        </button>
      </div>
    </div>
  );
}
