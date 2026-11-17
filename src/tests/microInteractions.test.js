import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/useProjectStore';

describe('Micro-Interactions & Hover States (Feature 3)', () => {
  beforeEach(() => {
    useProjectStore.getState().resetTemplate();
  });

  it('allows setting hoverStyles on canvas elements', () => {
    const { addElement, updateElement } = useProjectStore.getState();
    const btn = addElement('button', 200, 200);

    updateElement(btn.id, {
      hoverStyles: {
        scale: 1.05,
        yShift: -4,
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.12)'
      }
    });

    const updated = useProjectStore.getState().elements.find(el => el.id === btn.id);
    expect(updated.hoverStyles).toBeDefined();
    expect(updated.hoverStyles.scale).toBe(1.05);
    expect(updated.hoverStyles.yShift).toBe(-4);
    expect(updated.hoverStyles.boxShadow).toContain('0 12px 28px');
  });

  it('retains animation triggers and hover effects', () => {
    const { addElement, updateElement } = useProjectStore.getState();
    const card = addElement('card', 150, 150);

    updateElement(card.id, {
      animation: {
        effect: 'slide-up',
        trigger: 'hover',
        duration: 0.4
      }
    });

    const updated = useProjectStore.getState().elements.find(el => el.id === card.id);
    expect(updated.animation.trigger).toBe('hover');
    expect(updated.animation.effect).toBe('slide-up');
    expect(updated.animation.duration).toBe(0.4);
  });
});
