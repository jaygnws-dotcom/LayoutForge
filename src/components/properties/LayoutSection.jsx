import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, RotateCw } from 'lucide-react';

export default function LayoutSection({ element }) {
  const { updateElementWithHistory, bringForward, sendBackward, bringToFront, sendToBack } = useProjectStore();

  const handleChange = (field, val) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      updateElementWithHistory(element.id, { [field]: num });
    }
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Dimensions & Position
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-secondary block mb-1">X Position</label>
          <div className="flex items-center bg-muted border border-border rounded px-2 py-1">
            <span className="text-[10px] text-secondary mr-1.5 font-mono">X</span>
            <input
              type="number"
              value={element.x}
              onChange={(e) => handleChange('x', e.target.value)}
              className="bg-transparent w-full text-onSurface outline-none text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Y Position</label>
          <div className="flex items-center bg-muted border border-border rounded px-2 py-1">
            <span className="text-[10px] text-secondary mr-1.5 font-mono">Y</span>
            <input
              type="number"
              value={element.y}
              onChange={(e) => handleChange('y', e.target.value)}
              className="bg-transparent w-full text-onSurface outline-none text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Width (px)</label>
          <div className="flex items-center bg-muted border border-border rounded px-2 py-1">
            <span className="text-[10px] text-secondary mr-1.5 font-mono">W</span>
            <input
              type="number"
              min="20"
              value={element.width}
              onChange={(e) => handleChange('width', e.target.value)}
              className="bg-transparent w-full text-onSurface outline-none text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Height (px)</label>
          <div className="flex items-center bg-muted border border-border rounded px-2 py-1">
            <span className="text-[10px] text-secondary mr-1.5 font-mono">H</span>
            <input
              type="number"
              min="10"
              value={element.height}
              onChange={(e) => handleChange('height', e.target.value)}
              className="bg-transparent w-full text-onSurface outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* Rotation & Z-Index */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div>
          <label className="text-[10px] text-secondary block mb-1">Rotation (°)</label>
          <div className="flex items-center bg-muted border border-border rounded px-2 py-1">
            <RotateCw className="w-3 h-3 text-secondary mr-1.5" />
            <input
              type="number"
              min="-360"
              max="360"
              value={element.rotation || 0}
              onChange={(e) => handleChange('rotation', e.target.value)}
              className="bg-transparent w-full text-onSurface outline-none text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-secondary block mb-1">Z-Index: {element.zIndex || 10}</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => bringForward(element.id)}
              className="p-1 rounded bg-muted border border-border hover:bg-surface text-secondary hover:text-onSurface"
              title="Bring Forward"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => sendBackward(element.id)}
              className="p-1 rounded bg-muted border border-border hover:bg-surface text-secondary hover:text-onSurface"
              title="Send Backward"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => bringToFront(element.id)}
              className="p-1 rounded bg-muted border border-border hover:bg-surface text-primary"
              title="Bring to Front"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => sendToBack(element.id)}
              className="p-1 rounded bg-muted border border-border hover:bg-surface text-secondary hover:text-onSurface"
              title="Send to Back"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
