import { describe, it, expect } from 'vitest';
import { generateLayoutFromPrompt, AI_PROMPT_PRESETS } from '../engine/aiLayoutEngine';
import { generateProjectCode } from '../engine/htmlGenerator';

describe('AI Layout Engine', () => {
  it('generates a complete SaaS landing page layout with navbar, hero, cards, and list', () => {
    const prompt = 'Create a modern SaaS landing page for an AI Analytics startup with a sleek navbar, hero section with badge and dual CTA buttons, 3 feature cards with icons, and a pricing comparison grid';
    const result = generateLayoutFromPrompt(prompt);

    expect(result).toBeDefined();
    expect(result.elements.length).toBeGreaterThan(10);
    expect(result.pageSettings.pageWidth).toBe(1440);
    expect(result.pageSettings.minHeight).toBeGreaterThanOrEqual(960);

    // Verify key component types exist
    const types = result.elements.map(e => e.type);
    expect(types).toContain('navbar');
    expect(types).toContain('heading');
    expect(types).toContain('button');
    expect(types).toContain('card');
    expect(types).toContain('list');
    expect(types).toContain('footer');

    // Verify HTML generator produces valid markup without throwing
    const generated = generateProjectCode(result.elements, result.pageSettings);
    expect(generated.html).toContain('<!DOCTYPE html>');
    expect(generated.html).toContain('HyperMind AI');
    expect(generated.css).toBeDefined();
  });

  it('correctly adapts palette tokens and styling when dark mode is requested', () => {
    const result = generateLayoutFromPrompt('Build a dark cyber futuristic tech platform', { themeMood: 'dark' });

    expect(result.pageSettings.backgroundColor).toBe('#0F172A');
    const navbar = result.elements.find(e => e.type === 'navbar');
    expect(navbar).toBeDefined();
    expect(navbar.styles.backgroundColor).toBe('#1E293B');
  });

  it('generates interactive form elements when contact page is requested', () => {
    const prompt = 'Create a contact inquiry page with a contact form, email input, subject dropdown, and message textarea';
    const result = generateLayoutFromPrompt(prompt);

    const types = result.elements.map(e => e.type);
    expect(types).toContain('input');
    expect(types).toContain('select');
    expect(types).toContain('textarea');
    expect(types).toContain('checkbox');

    const generated = generateProjectCode(result.elements, result.pageSettings);
    expect(generated.html).toContain('Email Address');
    expect(generated.html).toContain('textarea');
  });

  it('validates that all AI prompt presets generate valid layouts', () => {
    AI_PROMPT_PRESETS.forEach(preset => {
      const layout = generateLayoutFromPrompt(preset.prompt);
      expect(layout.elements.length).toBeGreaterThan(5);
      expect(layout.projectName).toBeTruthy();

      // Ensure every element has proper geometry
      layout.elements.forEach(el => {
        expect(el.x).toBeGreaterThanOrEqual(0);
        expect(el.y).toBeGreaterThanOrEqual(0);
        expect(el.width).toBeGreaterThan(0);
        expect(el.height).toBeGreaterThan(0);
      });
    });
  });

  it('respects granular section toggles (e.g. without navbar or with pricing)', () => {
    const layout = generateLayoutFromPrompt('Landing page', {
      sections: {
        navbar: false,
        hero: true,
        features: true,
        list: false,
        pricing: true,
        contact: false,
        footer: false
      }
    });

    const types = layout.elements.map(e => e.type);
    expect(types).not.toContain('navbar');
    expect(types).not.toContain('footer');
    expect(types).toContain('heading');
    expect(types).toContain('card');
  });

  it('correctly handles the Atelier Verra architectural brief with custom colors, brand, serif font and sections', () => {
    const userPrompt = `Build a long, single-page landing website for an architecture studio called "Atelier Verra" (you can rename it). It should look hand-designed by a professional studio, like an award-winning agency site, not a template.
DESIGN DIRECTION
- Light mode only. Warm off-white background (#F6F3EE), with stone, sand, and soft grey surfaces, near-black text (#1A1A18), and one muted accent such as terracotta (#B4573A) or deep olive.
- Editorial, minimal, and confident. Generous whitespace, large typography, and thin 1px divider lines.
- Typography: an elegant serif for headlines (Cormorant Garamond or Playfair Display) paired with a clean sans for body (Inter or DM Sans).
STRICTLY AVOID (so it doesn't look AI-generated)
- No purple/blue gradients, neon glows, glassmorphism overload, or gradient text.
- No emoji icons, generic stock-icon grids, or "AI", "powered by", or "smart" labels anywhere.
SECTIONS (in order)
1. Navbar: a minimal logo, links (Projects, Studio, Services, Journal, Contact), and an "Start a project" button.
2. Hero: a full-screen architectural image with a slow Ken Burns zoom and a big headline. Stats at bottom (120+ projects, 18 years, 14 awards).
3. Intro/Philosophy: a large paragraph.
4. Featured Projects slider.
5. Services: an interactive list.
6. Project Gallery.
7. Process: 4 steps.
8. Numbers/Awards.
12. Contact CTA: "Let's build something that lasts."
13. Footer.`;

    const result = generateLayoutFromPrompt(userPrompt);

    expect(result).toBeDefined();
    expect(result.projectName).toContain('Atelier Verra');
    expect(result.pageSettings.backgroundColor).toBe('#F6F3EE');
    expect(result.pageSettings.defaultFont).toContain('Playfair Display');

    const navbar = result.elements.find(e => e.type === 'navbar');
    expect(navbar).toBeDefined();
    expect(navbar.content.brandText).toBe('Atelier Verra');
    expect(navbar.content.ctaText).toBe('Start a project');

    const heading = result.elements.find(e => e.type === 'heading' && e.name === 'Hero Main Headline');
    expect(heading).toBeDefined();
    expect(heading.styles.fontFamily).toContain('Playfair Display');

    const contact = result.elements.find(e => e.content?.text === "Let's build something that lasts.");
    expect(contact).toBeDefined();

    // Verify HTML export includes Atelier Verra, terracotta accent, and valid structure
    const generated = generateProjectCode(result.elements, result.pageSettings);
    expect(generated.html).toContain('Atelier Verra');
    expect(generated.html).toContain('120+');
    expect(generated.html).toContain("Let's build something that lasts.");
    expect(generated.css).toContain('#B4573A');
  });
});
