import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Upload } from 'lucide-react';
import { THEME_COLORS } from '../../types/elements';

export default function BackgroundSection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const styles = element.styles || {};

  const [bgMode, setBgMode] = useState(
    styles.backgroundGradient ? 'gradient' : styles.backgroundImage ? 'image' : 'solid'
  );

  const [gradAngle, setGradAngle] = useState(135);
  const [gradColor1, setGradColor1] = useState(THEME_COLORS.primary);
  const [gradColor2, setGradColor2] = useState('#60a5fa');

  const updateStyles = (fields) => {
    updateElementWithHistory(element.id, {
      styles: { ...styles, ...fields }
    });
  };

  const handleApplyGradient = (angle, c1, c2) => {
    const gradient = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
    updateStyles({
      backgroundGradient: gradient,
      backgroundColor: 'transparent'
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateStyles({
          backgroundImage: event.target.result,
          backgroundSize: 'cover'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Background & Opacity
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border text-[11px]">
        <button
          onClick={() => {
            setBgMode('solid');
            updateStyles({ backgroundGradient: null, backgroundImage: null });
          }}
          className={`flex-1 py-1 rounded transition-colors ${
            bgMode === 'solid' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => {
            setBgMode('gradient');
            handleApplyGradient(gradAngle, gradColor1, gradColor2);
          }}
          className={`flex-1 py-1 rounded transition-colors ${
            bgMode === 'gradient' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => setBgMode('image')}
          className={`flex-1 py-1 rounded transition-colors ${
            bgMode === 'image' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
          }`}
        >
          Image
        </button>
      </div>

      {bgMode === 'solid' && (
        <div>
          <label className="text-[10px] text-secondary block mb-1">Color</label>
          <div className="flex items-center gap-1.5 bg-muted border border-border rounded px-2 py-1">
            <input
              type="color"
              value={styles.backgroundColor || THEME_COLORS.surface}
              onChange={(e) => updateStyles({ backgroundColor: e.target.value, backgroundGradient: null })}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={styles.backgroundColor || 'transparent'}
              onChange={(e) => updateStyles({ backgroundColor: e.target.value, backgroundGradient: null })}
              className="bg-transparent w-full text-onSurface outline-none text-xs font-mono"
            />
          </div>
        </div>
      )}

      {bgMode === 'gradient' && (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-secondary block mb-1">Stop 1</label>
              <div className="flex items-center gap-1 bg-muted border border-border rounded px-1.5 py-1">
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => {
                    setGradColor1(e.target.value);
                    handleApplyGradient(gradAngle, e.target.value, gradColor2);
                  }}
                  className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-[10px] text-onSurface">{gradColor1}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-secondary block mb-1">Stop 2</label>
              <div className="flex items-center gap-1 bg-muted border border-border rounded px-1.5 py-1">
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => {
                    setGradColor2(e.target.value);
                    handleApplyGradient(gradAngle, gradColor1, e.target.value);
                  }}
                  className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-[10px] text-onSurface">{gradColor2}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-secondary mb-1">
              <span>Angle</span>
              <span>{gradAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={gradAngle}
              onChange={(e) => {
                const angle = parseInt(e.target.value, 10);
                setGradAngle(angle);
                handleApplyGradient(angle, gradColor1, gradColor2);
              }}
              className="w-full accent-primary"
            />
          </div>
        </div>
      )}

      {bgMode === 'image' && (
        <div className="space-y-2 text-xs">
          <div>
            <label className="text-[10px] text-secondary block mb-1">Background Image URL</label>
            <input
              type="text"
              value={styles.backgroundImage || ''}
              placeholder="https://..."
              onChange={(e) => updateStyles({ backgroundImage: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>

          <label className="flex items-center justify-center gap-2 w-full py-1.5 bg-muted hover:bg-accentSoft border border-dashed border-border hover:border-primary rounded-lg cursor-pointer text-xs text-primary transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Bg Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Opacity */}
      <div>
        <div className="flex justify-between text-[10px] text-secondary mb-1">
          <span>Opacity</span>
          <span>{Math.round((styles.opacity !== undefined ? styles.opacity : 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={styles.opacity !== undefined ? styles.opacity : 1}
          onChange={(e) => updateStyles({ opacity: parseFloat(e.target.value) })}
          className="w-full accent-primary"
        />
      </div>
    </div>
  );
}
