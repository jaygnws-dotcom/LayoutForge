import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter
} from 'lucide-react';

export default function AlignmentToolbar() {
  const { selectedElementIds, alignElements, distributeElements } = useProjectStore();

  if (selectedElementIds.length < 1) return null;

  return (
    <div className="p-3 border-b border-border bg-muted/60">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider mb-2">
        Align {selectedElementIds.length === 1 ? 'to Artboard' : `(${selectedElementIds.length} items)`}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => alignElements('left')}
          className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => alignElements('center')}
          className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
          title="Align Horizontal Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => alignElements('right')}
          className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <button
          onClick={() => alignElements('top')}
          className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
          title="Align Top"
        >
          <AlignStartVertical className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => alignElements('middle')}
          className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
          title="Align Vertical Middle"
        >
          <AlignCenterVertical className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => alignElements('bottom')}
          className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
          title="Align Bottom"
        >
          <AlignEndVertical className="w-3.5 h-3.5" />
        </button>
        {selectedElementIds.length >= 3 && (
          <>
            <div className="w-px h-4 bg-border mx-0.5" />
            <button
              onClick={() => distributeElements('horizontal')}
              className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
              title="Distribute Horizontally"
            >
              <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => distributeElements('vertical')}
              className="p-1.5 rounded bg-surface hover:bg-muted text-secondary hover:text-onSurface border border-border shadow-xs"
              title="Distribute Vertically"
            >
              <AlignVerticalDistributeCenter className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
