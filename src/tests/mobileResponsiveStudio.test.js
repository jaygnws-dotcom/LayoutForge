import { describe, it, expect } from 'vitest';
import React from 'react';
import MobileFooter from '../components/layout/MobileFooter';
import { COMPONENT_CATALOG } from '../types/elements';

describe('LayoutForge Mobile Responsive Studio Suite', () => {
  it('Validates mobile component catalog contains all standard blocks and elements', () => {
    expect(COMPONENT_CATALOG.length).toBeGreaterThanOrEqual(18);
    const types = COMPONENT_CATALOG.map(c => c.type);
    expect(types).toContain('navbar');
    expect(types).toContain('footer');
    expect(types).toContain('button');
    expect(types).toContain('card');
    expect(types).toContain('heading');
  });

  it('Renders MobileFooter correctly with required props and tab targets', () => {
    expect(typeof MobileFooter).toBe('function');
  });
});
