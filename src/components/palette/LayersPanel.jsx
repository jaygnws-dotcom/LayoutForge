import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Lock, Unlock, Eye, EyeOff, Trash2, ArrowUp, ArrowDown,
  Layers as LayersIcon, Edit2, Check
} from 'lucide-react';

export default function LayersPanel() {
  const {
    elements, selectedElementIds, selectElement,
    toggleLock, toggleHide, deleteElements,
    bringForward, sendBackward, updateElement
  } = useProjectStore();

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (el, e) => {
    e.stopPropagation();
    setEditingId(el.id);
    setEditingName(el.name);
  };

  const handleSaveRename = (id) => {
    if (editingName.trim()) {
      updateElement(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  const sortedLayers = [...elements].sort((a, b) => (b.zIndex || 10) - (a.zIndex || 10));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface">
      <div className="p-3 border-b border-border flex items-center justify-between text-xs text-secondary">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-onSurface">
          Canvas Layers ({elements.length})
        </span>
        <span className="text-[10px] text-secondary">Top to Bottom</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedLayers.length === 0 ? (
          <div className="text-center py-12 text-secondary text-xs">
            <LayersIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-secondary" />
            No elements on the canvas
          </div>
        ) : (
          sortedLayers.map((el) => {
            const isSelected = selectedElementIds.includes(el.id);
            return (
              <div
                key={el.id}
                onClick={(e) => selectElement(el.id, e.shiftKey)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-accentSoft border-primary text-primary font-medium shadow-sm'
                    : 'bg-surface border-transparent hover:bg-muted text-onSurface'
                } ${el.hidden ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />

                  {editingId === el.id ? (
                    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(el.id)}
                        onBlur={() => handleSaveRename(el.id)}
                        autoFocus
                        className="bg-surface border border-primary rounded px-1.5 py-0.5 text-xs text-onSurface outline-none w-full"
                      />
                      <button onClick={() => handleSaveRename(el.id)} className="text-emerald-600 p-0.5">
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <span className="truncate text-[11px]">{el.name}</span>
                      <button
                        onClick={(e) => handleStartRename(el, e)}
                        className="opacity-0 group-hover:opacity-100 text-secondary hover:text-onSurface p-0.5"
                        title="Rename"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}

                  {el.parentId && (
                    <span className="text-[9px] px-1 rounded bg-muted text-secondary border border-border">
                      nested
                    </span>
                  )}
                </div>

                {/* Layer Quick Controls */}
                <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => bringForward(el.id)}
                    className="p-1 hover:text-onSurface text-secondary hover:bg-muted rounded"
                    title="Bring Forward"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => sendBackward(el.id)}
                    className="p-1 hover:text-onSurface text-secondary hover:bg-muted rounded"
                    title="Send Backward"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleLock(el.id)}
                    className={`p-1 hover:text-onSurface rounded ${el.locked ? 'text-amber-500' : 'text-secondary'}`}
                    title={el.locked ? 'Unlock element' : 'Lock element position'}
                  >
                    {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => toggleHide(el.id)}
                    className={`p-1 hover:text-onSurface rounded ${el.hidden ? 'text-error' : 'text-secondary'}`}
                    title={el.hidden ? 'Unhide element' : 'Hide element'}
                  >
                    {el.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => deleteElements([el.id])}
                    className="p-1 hover:text-error text-secondary hover:bg-red-50 rounded"
                    title="Delete element"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
