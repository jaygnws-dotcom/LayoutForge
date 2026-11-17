import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { useProjectStore } from '../../store/useProjectStore';
import RenderElementContent from './RenderElementContent';
import { Lock, Layers } from 'lucide-react';
import { getRelatedGroupIds } from '../../utils/groupingUtils';

export default function CanvasElement({
  element,
  zoom,
  isSelected,
  onContextMenu,
  isMultiSelected
}) {
  const {
    selectElement, setElementGeometry, updateElement,
    snapToGrid, gridSize, elements, selectedElementIds,
    moveElementsGroup
  } = useProjectStore();

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isGroupDragging, setIsGroupDragging] = useState(false);

  const dragGroupRef = useRef({
    startX: 0,
    startY: 0,
    relatedNodes: [],
    relatedIds: [],
    isGroupMove: false,
    shiftHeld: false
  });

  const animation = element.animation || {};

  // Listen for preview animation triggers (from AnimationSection or effect change)
  useEffect(() => {
    const handleTriggerAnimation = (e) => {
      if (e.detail?.elementId === element.id) {
        setIsPlayingAnimation(false);
        requestAnimationFrame(() => {
          setIsPlayingAnimation(true);
          const durationSec = Number(animation.duration) || 0.6;
          const delaySec = Number(animation.delay) || 0;
          const totalMs = (durationSec + delaySec) * 1000 + 150;
          setTimeout(() => setIsPlayingAnimation(false), totalMs);
        });
      }
    };

    window.addEventListener('lf-preview-animation', handleTriggerAnimation);
    return () => window.removeEventListener('lf-preview-animation', handleTriggerAnimation);
  }, [element.id, animation.duration, animation.delay]);

  if (element.hidden) return null;

  const handleDragStart = (e, d) => {
    // If clicking an unselected element without shift, select it
    if (!isSelected && !selectedElementIds.includes(element.id)) {
      selectElement(element.id, e.shiftKey);
    }

    const isShiftHeld = !!e.shiftKey;
    const relatedIds = getRelatedGroupIds(element, elements, selectedElementIds, isShiftHeld);

    if (relatedIds.length > 0) {
      setIsGroupDragging(true);
      const nodes = relatedIds
        .map(id => {
          const targetEl = elements.find(el => el.id === id);
          const domNode = document.querySelector(`[data-element-id="${id}"]`);
          return {
            id,
            domNode,
            initX: targetEl ? targetEl.x : 0,
            initY: targetEl ? targetEl.y : 0
          };
        })
        .filter(item => item.domNode);

      dragGroupRef.current = {
        startX: d.x,
        startY: d.y,
        relatedNodes: nodes,
        relatedIds,
        isGroupMove: true,
        shiftHeld: isShiftHeld
      };

      nodes.forEach(({ domNode }) => {
        domNode.classList.add('lf-group-moving');
      });
    } else {
      setIsGroupDragging(false);
      dragGroupRef.current = {
        startX: d.x,
        startY: d.y,
        relatedNodes: [],
        relatedIds: [],
        isGroupMove: false,
        shiftHeld: isShiftHeld
      };
    }
  };

  const handleDrag = (e, d) => {
    const { isGroupMove, relatedNodes, startX, startY } = dragGroupRef.current;
    if (isGroupMove && relatedNodes.length > 0) {
      const deltaX = d.x - startX;
      const deltaY = d.y - startY;
      relatedNodes.forEach(({ domNode, initX, initY }) => {
        domNode.style.transform = `translate(${initX + deltaX}px, ${initY + deltaY}px)`;
      });
    }
  };

  const handleDragStop = (e, d) => {
    const { isGroupMove, relatedNodes, relatedIds } = dragGroupRef.current;
    setIsGroupDragging(false);

    if (relatedNodes && relatedNodes.length > 0) {
      relatedNodes.forEach(({ domNode }) => {
        domNode.classList.remove('lf-group-moving');
        domNode.style.transform = '';
      });
    }

    const deltaX = d.x - element.x;
    const deltaY = d.y - element.y;

    if (isGroupMove && relatedIds.length > 0 && (deltaX !== 0 || deltaY !== 0)) {
      moveElementsGroup(element.id, relatedIds, deltaX, deltaY);
    } else {
      setElementGeometry(element.id, {
        x: d.x,
        y: d.y
      });
    }

    dragGroupRef.current = {
      startX: 0,
      startY: 0,
      relatedNodes: [],
      relatedIds: [],
      isGroupMove: false,
      shiftHeld: false
    };
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setElementGeometry(element.id, {
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      x: position.x,
      y: position.y
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    selectElement(element.id, e.shiftKey);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (['heading', 'text', 'button', 'badge', 'label'].includes(element.type)) {
      setIsEditingInline(true);
    }
  };

  const handleContentChange = (contentUpdates) => {
    updateElement(element.id, { content: contentUpdates });
  };

  const styles = element.styles || {};

  const customElementStyles = {
    fontFamily: styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : undefined,
    fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
    fontWeight: styles.fontWeight,
    color: styles.color,
    textAlign: styles.textAlign,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,

    backgroundColor: styles.backgroundGradient || styles.backgroundColor || undefined,
    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
    backgroundSize: styles.backgroundSize || 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: styles.opacity !== undefined ? styles.opacity : 1,

    borderWidth: styles.borderWidth !== undefined ? `${styles.borderWidth}px` : '0px',
    borderStyle: styles.borderWidth ? (styles.borderStyle || 'solid') : 'none',
    borderColor: styles.borderColor || 'transparent',
    borderRadius: styles.borderRadius !== undefined ? `${styles.borderRadius}px` : '0px',
    boxShadow: styles.boxShadow || 'none',
    backdropFilter: styles.backdropFilter || undefined,
    WebkitBackdropFilter: styles.backdropFilter || styles.WebkitBackdropFilter || undefined,

    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : undefined,
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : undefined,
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : undefined,
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : undefined,

    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined
  };

  // Determine if animation is currently executing
  const isHoverTriggered = isHovered && animation.trigger === 'hover' && animation.effect && animation.effect !== 'none';
  const shouldAnimate = isPlayingAnimation || isHoverTriggered;

  const animationStyles = shouldAnimate && animation.effect && animation.effect !== 'none'
    ? {
        animationName: `lf-${animation.effect}`,
        animationDuration: `${animation.duration || 0.6}s`,
        animationTimingFunction: animation.easing || 'ease-out',
        animationDelay: isPlayingAnimation ? '0s' : `${animation.delay || 0}s`,
        animationIterationCount: animation.iterationCount || '1',
        animationFillMode: 'both'
      }
    : {};

  const hover = element.hoverStyles || {};
  const isHoverActive = isHovered && (hover.scale || hover.yShift || hover.boxShadow);

  const appliedTransform = [
    element.rotation ? `rotate(${element.rotation}deg)` : '',
    isHoverActive && hover.scale ? `scale(${hover.scale})` : '',
    isHoverActive && hover.yShift ? `translateY(${hover.yShift}px)` : ''
  ].filter(Boolean).join(' ') || undefined;

  const appliedBoxShadow = isHoverActive && hover.boxShadow ? hover.boxShadow : customElementStyles.boxShadow;

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      scale={zoom}
      disableDragging={element.locked || isEditingInline}
      enableResizing={!element.locked && !isEditingInline}
      dragGrid={snapToGrid ? [gridSize, gridSize] : [1, 1]}
      resizeGrid={snapToGrid ? [gridSize, gridSize] : [1, 1]}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      data-element-id={element.id}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        selectElement(element.id);
        onContextMenu(e, element.id);
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        zIndex: isSelected ? 999 : (element.zIndex || 10)
      }}
      className={`group select-none ${
        isSelected
          ? 'outline outline-2 outline-primary outline-offset-2'
          : 'hover:outline hover:outline-1 hover:outline-primary/40 hover:outline-offset-1'
      }`}
      resizeHandleClasses={{
        topLeft: 'w-2.5 h-2.5 bg-white border-2 border-primary rounded-xs -translate-x-1 -translate-y-1',
        topRight: 'w-2.5 h-2.5 bg-white border-2 border-primary rounded-xs translate-x-1 -translate-y-1',
        bottomLeft: 'w-2.5 h-2.5 bg-white border-2 border-primary rounded-xs -translate-x-1 translate-y-1',
        bottomRight: 'w-2.5 h-2.5 bg-white border-2 border-primary rounded-xs translate-x-1 translate-y-1',
        top: 'h-1.5 bg-primary/40 -translate-y-1',
        bottom: 'h-1.5 bg-primary/40 translate-y-1',
        left: 'w-1.5 bg-primary/40 -translate-x-1',
        right: 'w-1.5 bg-primary/40 translate-x-1'
      }}
    >
      <div
        className="w-full h-full relative"
        data-element-id={element.id}
        style={{
          ...customElementStyles,
          transform: appliedTransform,
          boxShadow: appliedBoxShadow,
          transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
          ...animationStyles
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <RenderElementContent
          element={element}
          isEditing={isEditingInline}
          onContentChange={(updates) => {
            handleContentChange(updates);
          }}
          onStopEditing={() => setIsEditingInline(false)}
        />

        {element.locked && (
          <div className="absolute top-1 right-1 p-0.5 rounded bg-amber-500 text-white shadow-xs">
            <Lock className="w-2.5 h-2.5" />
          </div>
        )}

        {/* Group Dragging Badge */}
        {isGroupDragging && (
          <div className="absolute -top-7 left-0 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md flex items-center gap-1 whitespace-nowrap z-50 animate-in fade-in">
            <Layers className="w-3 h-3" />
            <span>Shift + Group Move Active</span>
          </div>
        )}

        {isSelected && (
          <div className="absolute bottom-0 right-0 px-1 py-0.5 bg-primary text-[9px] font-mono text-white rounded-tl pointer-events-none opacity-90">
            {element.width}×{element.height}
          </div>
        )}
      </div>
    </Rnd>
  );
}
