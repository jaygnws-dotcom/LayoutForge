import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { GOOGLE_FONTS_LIST, TYPOGRAPHY_PRESETS, THEME_COLORS } from '../../types/elements';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function TypographySection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const styles = element.styles || {};

  const updateStyles = (fields) => {
    updateElementWithHistory(element.id, {
      styles: { ...styles, ...fields }
    });
  };

  const handleApplyPreset = (presetId) => {
    const preset = TYPOGRAPHY_PRESETS.find(p => p.id === presetId);
    if (preset) {
      updateStyles({
        fontFamily: preset.fontFamily,
        fontSize: preset.fontSize,
        fontWeight: preset.fontWeight,
        lineHeight: preset.lineHeight,
        letterSpacing: preset.letterSpacing
      });
    }
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Typography & Text Styles
      </div>

      {/* Typography Presets Quick Picker */}
      <div>
        <label className="text-[10px] text-secondary block mb-1">Typography Preset</label>
        <select
          onChange={(e) => handleApplyPreset(e.target.value)}
          defaultValue=""
          className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
        >
          <option value="" disabled>Choose a style preset...</option>
          {TYPOGRAPHY_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-[10px] text-secondary block mb-1">Font Family</label>
        <select
          value={styles.fontFamily || 'Rethink Sans'}
          onChange={(e) => updateStyles({ fontFamily: e.target.value })}
          className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
        >
          {GOOGLE_FONTS_LIST.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Size (px)</label>
          <input
            type="number"
            step="0.1"
            min="8"
            max="120"
            value={styles.fontSize || 16}
            onChange={(e) => updateStyles({ fontSize: parseFloat(e.target.value) || 16 })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Weight</label>
          <select
            value={styles.fontWeight || '400'}
            onChange={(e) => updateStyles({ fontWeight: e.target.value })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          >
            <option value="400">400 - Regular</option>
            <option value="500">500 - Medium</option>
            <option value="600">600 - SemiBold</option>
            <option value="700">700 - Bold</option>
            <option value="800">800 - ExtraBold</option>
          </select>
        </div>
      </div>

      {/* Text Color & Alignment */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Text Color</label>
          <div className="flex items-center gap-1.5 bg-muted border border-border rounded px-1.5 py-1">
            <input
              type="color"
              value={styles.color || THEME_COLORS.onSurface}
              onChange={(e) => updateStyles({ color: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[11px] font-mono text-onSurface uppercase">{styles.color || '#000'}</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Alignment</label>
          <div className="flex items-center bg-muted border border-border rounded p-0.5">
            <button
              onClick={() => updateStyles({ textAlign: 'left' })}
              className={`flex-1 p-1 rounded flex justify-center ${styles.textAlign === 'left' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-onSurface'}`}
              title="Left"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => updateStyles({ textAlign: 'center' })}
              className={`flex-1 p-1 rounded flex justify-center ${styles.textAlign === 'center' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-onSurface'}`}
              title="Center"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              onClick={() => updateStyles({ textAlign: 'right' })}
              className={`flex-1 p-1 rounded flex justify-center ${styles.textAlign === 'right' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-onSurface'}`}
              title="Right"
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Line Height & Letter Spacing */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Line Height</label>
          <input
            type="number"
            step="0.05"
            min="0.8"
            max="3"
            value={styles.lineHeight || 1.4}
            onChange={(e) => updateStyles({ lineHeight: parseFloat(e.target.value) || 1.4 })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-[10px] text-secondary block mb-1">Letter Spacing (px)</label>
          <input
            type="number"
            step="0.1"
            min="-5"
            max="10"
            value={styles.letterSpacing || 0}
            onChange={(e) => updateStyles({ letterSpacing: parseFloat(e.target.value) || 0 })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
