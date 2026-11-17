import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';

export default function SpacingSection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const styles = element.styles || {};
  const padding = styles.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  const margin = styles.margin || { top: 0, right: 0, bottom: 0, left: 0 };

  const handlePaddingChange = (side, val) => {
    updateElementWithHistory(element.id, {
      styles: {
        ...styles,
        padding: { ...padding, [side]: parseInt(val, 10) || 0 }
      }
    });
  };

  const handleMarginChange = (side, val) => {
    updateElementWithHistory(element.id, {
      styles: {
        ...styles,
        margin: { ...margin, [side]: parseInt(val, 10) || 0 }
      }
    });
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Spacing (Padding & Margin)
      </div>

      {/* Padding */}
      <div>
        <label className="text-[10px] text-secondary block mb-1">Padding (px): T - R - B - L</label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          <input
            type="number"
            min="0"
            placeholder="T"
            value={padding.top || 0}
            onChange={(e) => handlePaddingChange('top', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Padding Top"
          />
          <input
            type="number"
            min="0"
            placeholder="R"
            value={padding.right || 0}
            onChange={(e) => handlePaddingChange('right', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Padding Right"
          />
          <input
            type="number"
            min="0"
            placeholder="B"
            value={padding.bottom || 0}
            onChange={(e) => handlePaddingChange('bottom', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Padding Bottom"
          />
          <input
            type="number"
            min="0"
            placeholder="L"
            value={padding.left || 0}
            onChange={(e) => handlePaddingChange('left', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Padding Left"
          />
        </div>
      </div>

      {/* Margin */}
      <div>
        <label className="text-[10px] text-secondary block mb-1">Margin (px): T - R - B - L</label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          <input
            type="number"
            placeholder="T"
            value={margin.top || 0}
            onChange={(e) => handleMarginChange('top', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Margin Top"
          />
          <input
            type="number"
            placeholder="R"
            value={margin.right || 0}
            onChange={(e) => handleMarginChange('right', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Margin Right"
          />
          <input
            type="number"
            placeholder="B"
            value={margin.bottom || 0}
            onChange={(e) => handleMarginChange('bottom', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Margin Bottom"
          />
          <input
            type="number"
            placeholder="L"
            value={margin.left || 0}
            onChange={(e) => handleMarginChange('left', e.target.value)}
            className="bg-muted border border-border rounded px-1.5 py-1 text-center text-onSurface outline-none focus:border-primary"
            title="Margin Left"
          />
        </div>
      </div>
    </div>
  );
}
