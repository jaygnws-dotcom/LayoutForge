import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import * as LucideIcons from 'lucide-react';
import { Plus } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';

export default function PaletteItem({ item, onItemAdded }) {
  const { addElement } = useProjectStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette_${item.type}`,
    data: {
      isPaletteItem: true,
      type: item.type,
      defaultWidth: item.defaultWidth,
      defaultHeight: item.defaultHeight
    }
  });

  const IconComponent = LucideIcons[item.icon] || LucideIcons.Box;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
    opacity: 0.85
  } : undefined;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addElement(item.type, 200, 200);
    if (onItemAdded) onItemAdded(item);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface hover:bg-accentSoft/30 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all select-none shadow-sm ${
        isDragging ? 'ring-2 ring-primary shadow-xl opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-accentSoft border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-onSurface group-hover:text-primary truncate">
            {item.name}
          </div>
          <div className="text-[10px] text-secondary truncate">
            {item.description}
          </div>
        </div>
      </div>

      <button
        onClick={handleQuickAdd}
        title="Quick add to canvas"
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg bg-accentSoft hover:bg-primary text-primary hover:text-white transition-all ml-1 flex-shrink-0 cursor-pointer shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
