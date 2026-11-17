import { describe, it, expect } from 'vitest';
import {
  analyzeImageVisuals,
  generateLayoutFromImage,
  SAMPLE_DESIGN_IMAGES
} from '../engine/imageLayoutEngine';
import { generateProjectCode } from '../engine/htmlGenerator';

describe('Image to Design AI Vision Engine', () => {
  it('analyzes image visual properties with fallback safety', async () => {
    const analysis = await analyzeImageVisuals('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');

    expect(analysis).toBeDefined();
    expect(analysis.backgroundColor).toMatch(/^#[0-9A-F]{6}$/i);
    expect(analysis.accentColor).toMatch(/^#[0-9A-F]{6}$/i);
    expect(Array.isArray(analysis.detectedSections)).toBe(true);
    expect(analysis.detectedSections.length).toBeGreaterThan(0);
  });

  it('generates a complete design layout from an image source', async () => {
    const sample = SAMPLE_DESIGN_IMAGES[0];
    const layout = await generateLayoutFromImage(sample.url, {
      imageName: sample.title,
      overrideBg: '#F6F3EE',
      overrideAccent: '#B4573A'
    });

    expect(layout).toBeDefined();
    expect(layout.projectName).toContain('Modern Architecture');
    expect(layout.pageSettings.backgroundColor).toBe('#F6F3EE');
    expect(layout.elements.length).toBeGreaterThan(5);

    // Verify key UI elements exist
    const types = layout.elements.map(e => e.type);
    expect(types).toContain('navbar');
    expect(types).toContain('heading');
    expect(types).toContain('card');

    // Verify accent color was applied to CTA button
    const ctaButton = layout.elements.find(e => e.type === 'button' && e.name === 'Primary CTA Button');
    expect(ctaButton).toBeDefined();
    expect(ctaButton.styles.backgroundColor).toBe('#B4573A');

    // Verify HTML generator compiles cleanly
    const generated = generateProjectCode(layout.elements, layout.pageSettings);
    expect(generated.html).toContain('<!DOCTYPE html>');
    expect(generated.css).toContain('#B4573A');
  });

  it('embeds the uploaded image directly into the canvas hero image and respects design notes', async () => {
    const mockImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    const layout = await generateLayoutFromImage(mockImageSrc, {
      imageName: 'atelier-sketch.png',
      designNotes: 'Architecture studio called "Atelier Verra" with stone surfaces',
      overrideBg: '#F6F3EE',
      overrideAccent: '#B4573A'
    });

    expect(layout.projectName).toContain('Atelier Verra');
    expect(layout.pageSettings.backgroundColor).toBe('#F6F3EE');

    // Verify hero image element has the exact uploaded data URL
    const heroImage = layout.elements.find(e => e.type === 'image');
    expect(heroImage).toBeDefined();
    expect(heroImage.content.src).toBe(mockImageSrc);

    // Verify navbar has Atelier Verra
    const navbar = layout.elements.find(e => e.type === 'navbar');
    expect(navbar).toBeDefined();
    expect(navbar.content.brandText).toBe('Atelier Verra');
  });

  it('provides rich sample design inspiration mockups', () => {
    expect(SAMPLE_DESIGN_IMAGES.length).toBeGreaterThanOrEqual(4);
    SAMPLE_DESIGN_IMAGES.forEach(sample => {
      expect(sample.title).toBeTruthy();
      expect(sample.url).toBeTruthy();
      expect(sample.category).toBeTruthy();
    });
  });
});
