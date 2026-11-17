import React, { useEffect, useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Copy, Trash2, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
  Lock, Unlock, Files, Layers, Layers2, SquareDashedMousePointer
} from 'lucide-react';
import { getRelatedGroupIds } from '../../utils/groupingUtils';

export default function ContextMenu({ menu, onClose }) {
  const {
    duplicateElements, copySelected, deleteElements,
    toggleLock, bringToFront, sendToBack, bringForward, sendBackward,
    elements, selectedElementIds, groupElements, ungroupElements, selectGroupElements
  } = useProjectStore();

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('wheel', onClose);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('wheel', onClose);
    };
  }, [onClose]);

  if (!menu || !menu.visible) return null;

  const currentEl = elements.find(e => e.id === menu.elementId);
  const isLocked = currentEl?.locked;
  const isGrouped = !!currentEl?.groupId;
  const isMulti = selectedElementIds.length > 1;
  const isContainer = currentEl && ['card', 'container', 'section'].includes(currentEl.type);
  const hasParent = !!currentEl?.parentId;

  return (
    <div
      ref={menuRef}
      style={{ left: menu.x, top: menu.y }}
      className="fixed z-50 w-56 bg-surface border border-border rounded-xl shadow-2xl p-1.5 text-xs text-onSurface backdrop-blur select-none"
    >
      <button
        onClick={() => { duplicateElements([menu.elementId]); onClose(); }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <span className="flex items-center gap-2"><Files className="w-3.5 h-3.5 text-primary" /> Duplicate</span>
        <span className="text-[10px] text-secondary font-mono">Ctrl+D</span>
      </button>

      <button
        onClick={() => { copySelected(); onClose(); }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5 text-primary" /> Copy</span>
        <span className="text-[10px] text-secondary font-mono">Ctrl+C</span>
      </button>

      <div className="h-px bg-border my-1" />

      {/* Grouping Actions */}
      {(isContainer || hasParent) && (
        <button
          onClick={() => { selectGroupElements(menu.elementId); onClose(); }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
        >
          <span className="flex items-center gap-2">
            <SquareDashedMousePointer className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Card & Contents</span>
          </span>
          <span className="text-[10px] text-secondary font-mono">Shift+Click</span>
        </button>
      )}

      {isMulti && (
        <button
          onClick={() => { groupElements(); onClose(); }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
        >
          <span className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-blue-600" /> Group Selected</span>
          <span className="text-[10px] text-secondary font-mono">Ctrl+G</span>
        </button>
      )}

      {isGrouped && (
        <button
          onClick={() => { ungroupElements([menu.elementId]); onClose(); }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
        >
          <span className="flex items-center gap-2"><Layers2 className="w-3.5 h-3.5 text-amber-600" /> Ungroup</span>
          <span className="text-[10px] text-secondary font-mono">Ctrl+Shift+G</span>
        </button>
      )}

      {(isContainer || hasParent || isMulti || isGrouped) && <div className="h-px bg-border my-1" />}

      <button
        onClick={() => { toggleLock(menu.elementId); onClose(); }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <span className="flex items-center gap-2">
          {isLocked ? <Unlock className="w-3.5 h-3.5 text-amber-500" /> : <Lock className="w-3.5 h-3.5 text-secondary" />}
          {isLocked ? 'Unlock Position' : 'Lock Position'}
        </span>
      </button>

      <div className="h-px bg-border my-1" />

      <button
        onClick={() => { bringToFront(menu.elementId); onClose(); }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <ChevronsUp className="w-3.5 h-3.5 text-primary" /> Bring to Front
      </button>

      <button
        onClick={() => { bringForward(menu.elementId); onClose(); }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <ArrowUp className="w-3.5 h-3.5 text-secondary" /> Bring Forward
      </button>

      <button
        onClick={() => { sendBackward(menu.elementId); onClose(); }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <ArrowDown className="w-3.5 h-3.5 text-secondary" /> Send Backward
      </button>

      <button
        onClick={() => { sendToBack(menu.elementId); onClose(); }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-onSurface"
      >
        <ChevronsDown className="w-3.5 h-3.5 text-secondary" /> Send to Back
      </button>

      <div className="h-px bg-border my-1" />

      <button
        onClick={() => { deleteElements([menu.elementId]); onClose(); }}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-error transition-colors"
      >
        <span className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete</span>
        <span className="text-[10px] text-error/60 font-mono">Del</span>
      </button>
    </div>
  );
}
