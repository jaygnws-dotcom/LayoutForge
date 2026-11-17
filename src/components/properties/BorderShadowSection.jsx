import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { BOX_SHADOW_PRESETS, THEME_COLORS } from '../../types/elements';

export default function BorderShadowSection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const styles = element.styles || {};

  const updateStyles = (fields) => {
    updateElementWithHistory(element.id, {
      styles: { ...styles, ...fields }
    });
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Border & Shadows
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Border Width</label>
          <input
            type="number"
            min="0"
            max="20"
            value={styles.borderWidth || 0}
            onChange={(e) => updateStyles({ borderWidth: parseInt(e.target.value, 10) || 0 })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Border Style</label>
          <select
            value={styles.borderStyle || 'solid'}
            onChange={(e) => updateStyles({ borderStyle: e.target.value })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Border Color</label>
          <div className="flex items-center gap-1.5 bg-muted border border-border rounded px-1.5 py-1">
            <input
              type="color"
              value={styles.borderColor || THEME_COLORS.border}
              onChange={(e) => updateStyles({ borderColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[11px] font-mono text-onSurface uppercase">{styles.borderColor || '#E6E6E6'}</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Corner Radius (px)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={styles.borderRadius || 0}
            onChange={(e) => updateStyles({ borderRadius: parseInt(e.target.value, 10) || 0 })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-secondary block mb-1">Box Shadow</label>
        <select
          value={styles.boxShadow || 'none'}
          onChange={(e) => updateStyles({ boxShadow: e.target.value })}
          className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
        >
          {BOX_SHADOW_PRESETS.map((p) => (
            <option key={p.id} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
