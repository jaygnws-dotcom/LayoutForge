import { describe, it, expect } from 'vitest';
import { STITCH_VIBES } from '../types/vibes';
import { applyVibeTheme } from '../engine/vibeEngine';
import { useProjectStore } from '../store/useProjectStore';
import { generateLayoutFromPrompt } from '../engine/aiLayoutEngine';
import { parseMarkdownDesign } from '../engine/markdownDesignParser';

describe('Google Stitch AI-Native Features', () => {
  it('includes all curated Google Stitch Vibe presets', () => {
    expect(STITCH_VIBES.length).toBeGreaterThanOrEqual(16);

    const atelier = STITCH_VIBES.find(v => v.id === 'atelier_studio');
    expect(atelier).toBeDefined();
    expect(atelier?.colors.primary).toBe('#B4573A'); // Terracotta
    expect(atelier?.colors.background).toBe('#F6F3EE'); // Warm off-white
    expect(atelier?.typography.headingFont).toBe('Playfair Display');

    const obsidian = STITCH_VIBES.find(v => v.id === 'linear_dark');
    expect(obsidian).toBeDefined();
    expect(obsidian?.colors.background).toBe('#0B0C10'); // Dark

    const cyberpunk = STITCH_VIBES.find(v => v.id === 'cyberpunk_neon');
    expect(cyberpunk).toBeDefined();
    expect(cyberpunk?.colors.primary).toBe('#06B6D4');

    const kyoto = STITCH_VIBES.find(v => v.id === 'kyoto_zen');
    expect(kyoto).toBeDefined();
  });

  it('applyVibeTheme updates elements and page settings cohesively', () => {
    const atelierVibe = STITCH_VIBES.find(v => v.id === 'atelier_studio');

    const mockElements = [
      {
        id: 'c1',
        type: 'card',
        styles: { backgroundColor: '#000000', borderColor: '#333333', borderRadius: 4 }
      },
      {
        id: 'h1',
        type: 'heading',
        styles: { fontFamily: 'Inter', color: '#FFFFFF' }
      },
      {
        id: 'btn1',
        type: 'button',
        content: { text: 'Start Project' },
        styles: { backgroundColor: '#3B82F6', borderRadius: 4 }
      }
    ];

    const mockSettings = {
      backgroundColor: '#000000',
      fontFamily: 'Inter'
    };

    const result = applyVibeTheme(atelierVibe, mockElements, mockSettings);

    // Page settings restyled
    expect(result.pageSettings.backgroundColor).toBe('#F6F3EE');
    expect(result.pageSettings.defaultFont).toBe('Rethink Sans');

    // Card restyled to surface and border tokens
    const card = result.elements.find(e => e.id === 'c1');
    expect(card?.styles?.backgroundColor).toBe('#FFFFFF');
    expect(card?.styles?.borderColor).toBe('#E6E1D8');
    expect(card?.styles?.borderRadius).toBe(10);

    // Heading restyled to Playfair Display and text color
    const heading = result.elements.find(e => e.id === 'h1');
    expect(heading?.styles?.fontFamily).toBe('Playfair Display');
    expect(heading?.styles?.color).toBe('#1A1A18');

    // Button restyled to primary terracotta
    const btn = result.elements.find(e => e.id === 'btn1');
    expect(btn?.styles?.backgroundColor).toBe('#B4573A');
    expect(btn?.styles?.borderRadius).toBe(8);
  });

  it('supports multi-page interactive screen prototype switching in store', () => {
    const store = useProjectStore.getState();
    expect(store.pages.length).toBeGreaterThan(0);

    const initialPage = store.activePageId;
    expect(initialPage).toBeDefined();

    // Check that pages maintain their own element arrays
    const homePage = store.pages.find(p => p.id === 'page_home');
    expect(homePage).toBeDefined();
    expect(homePage?.path).toBe('/');
  });

  it('Ask Stitch AI layout engine generates full design for architecture studio', () => {
    const prompt = 'Build a landing website for an architecture studio called Atelier Verra';
    const result = generateLayoutFromPrompt(prompt);

    expect(result.elements.length).toBeGreaterThan(5);
    expect(result.projectName).toContain('Atelier Verra');
    expect(result.pageSettings.backgroundColor).toBe('#F6F3EE'); // Warm off-white
    expect(result.pageSettings.pageWidth).toBe(1440);

    // Test that applyAiGeneratedLayout updates the store and pages
    useProjectStore.getState().applyAiGeneratedLayout({
      elements: result.elements,
      pageSettings: result.pageSettings,
      append: false,
      projectName: result.projectName
    });

    const currentElements = useProjectStore.getState().elements;
    expect(currentElements.length).toBe(result.elements.length);
    expect(useProjectStore.getState().pageSettings.backgroundColor).toBe('#F6F3EE');
  });

  it('applyVibeTheme dynamically updates background color and clears overrides', () => {
    const obsidianVibe = STITCH_VIBES.find(v => v.id === 'linear_dark');
    expect(obsidianVibe).toBeDefined();

    const mockElements = [
      {
        id: 'card_with_gradient',
        type: 'card',
        styles: {
          backgroundColor: '#FFFFFF',
          backgroundGradient: 'linear-gradient(135deg, #FF0080, #7928CA)',
          backgroundImage: 'url(https://example.com/bg.png)',
          borderRadius: 4
        }
      }
    ];

    const mockSettings = {
      backgroundColor: '#FFFFFF',
      backgroundGradient: 'linear-gradient(to right, #333, #666)',
      backgroundImage: 'https://example.com/paper.png',
      fontFamily: 'Inter'
    };

    const result = applyVibeTheme(obsidianVibe, mockElements, mockSettings);

    // Page settings background color must match dark obsidian and gradients must be cleared
    expect(result.pageSettings.backgroundColor).toBe('#0B0C10');
    expect(result.pageSettings.backgroundGradient).toBeNull();
    expect(result.pageSettings.backgroundImage).toBeNull();
    expect(result.pageSettings.textColor).toBe('#F8FAFC');

    // Card background should match obsidian surface (#151821) and gradient overrides cleared
    const updatedCard = result.elements.find(e => e.id === 'card_with_gradient');
    expect(updatedCard?.styles?.backgroundColor).toBe('#151821');
    expect(updatedCard?.styles?.backgroundGradient).toBeNull();
    expect(updatedCard?.styles?.backgroundImage).toBeNull();
  });

  it('switching from dark to warm vibe updates page background color accordingly', () => {
    const kyotoVibe = STITCH_VIBES.find(v => v.id === 'kyoto_zen');
    expect(kyotoVibe).toBeDefined();

    const darkSettings = {
      backgroundColor: '#0B0C10',
      fontFamily: 'Inter'
    };

    const result = applyVibeTheme(kyotoVibe, [], darkSettings);
    expect(result.pageSettings.backgroundColor).toBe('#F7F6F2');
    expect(result.pageSettings.textColor).toBe('#1E1F1E');
  });

  it('updatePageSettings in store updates both root pageSettings and active page in pages array', () => {
    const store = useProjectStore.getState();
    store.updatePageSettings({ backgroundColor: '#090D16' });

    const updatedState = useProjectStore.getState();
    expect(updatedState.pageSettings.backgroundColor).toBe('#090D16');

    const activePage = updatedState.pages.find(p => p.id === updatedState.activePageId);
    expect(activePage?.pageSettings?.backgroundColor).toBe('#090D16');
  });

  it('applyVibeTheme attaches activeVibeId to pageSettings for CanvasArtboard indicator', () => {
    const cyberpunk = STITCH_VIBES.find(v => v.id === 'cyberpunk_neon');
    const result = applyVibeTheme(cyberpunk, [], {});
    expect(result.pageSettings.activeVibeId).toBe('cyberpunk_neon');
  });

  it('supports applying design system styles selectively to chosen elements', () => {
    const cyberVibe = STITCH_VIBES.find(v => v.id === 'cyberpunk_neon');
    const elements = [
      { id: 'el_1', type: 'button', styles: { backgroundColor: '#FFFFFF', color: '#000000' } },
      { id: 'el_2', type: 'button', styles: { backgroundColor: '#111111', color: '#FFFFFF' } }
    ];

    // Only apply to el_1
    const selectedIds = ['el_1'];
    const selectedSubset = elements.filter(e => selectedIds.includes(e.id));
    const { elements: styledSubset } = applyVibeTheme(cyberVibe, selectedSubset, {});
    const styledMap = new Map(styledSubset.map(e => [e.id, e]));
    const finalElements = elements.map(e => styledMap.get(e.id) || e);

    expect(finalElements[0].styles.backgroundColor).toBe('#06B6D4'); // Styled with Cyberpunk primary
    expect(finalElements[1].styles.backgroundColor).toBe('#111111'); // Preserved untouched
  });

  it('includes glass effect and cosmic gradient presets in STITCH_VIBES', () => {
    const glass = STITCH_VIBES.find(v => v.id === 'glass_effect');
    expect(glass).toBeDefined();
    expect(glass?.name).toBe('Glass Effect Design');
    expect(glass?.colors.primary).toBe('#38BDF8');
    expect(glass?.colors.surface).toContain('rgba(255, 255, 255, 0.08)');
    expect(glass?.styles.borderRadius).toBe(20);

    const cosmic = STITCH_VIBES.find(v => v.id === 'cosmic_gradient');
    expect(cosmic).toBeDefined();
    expect(cosmic?.name).toBe('Cosmic Aurora Gradient');
    expect(cosmic?.colors.primary).toBe('#EC4899');
    expect(cosmic?.colors.background).toBe('#0D0B18');
  });

  it('parseMarkdownDesign extracts color palette, typography and radii from design.md', () => {
    const mdContent = `
# Obsidian Luxe Brand Tokens

## Color Palette
- Primary: #6366F1
- Background: #0B0F19
- Surface: #161D2F
- Text: #F8FAFC
- Secondary Text: #94A3B8
- Border: #263248
- Accent: #10B981

## Typography
- Heading Font: Plus Jakarta Sans
- Body Font: Inter

## Radii & Elevation
- Border Radius: 20px
- Button Radius: 9999px
`;

    const parsed = parseMarkdownDesign(mdContent, 'obsidian-luxe.md');
    expect(parsed.summary.colorsFound).toBeGreaterThanOrEqual(6);
    expect(parsed.theme.colors.primary).toBe('#6366F1');
    expect(parsed.theme.colors.background).toBe('#0B0F19');
    expect(parsed.theme.colors.surface).toBe('#161D2F');
    expect(parsed.theme.typography.headingFont).toBe('Plus Jakarta Sans');
    expect(parsed.theme.typography.bodyFont).toBe('Inter');
    expect(parsed.theme.styles.borderRadius).toBe(20);
    expect(parsed.theme.styles.buttonRadius).toBe(9999);

    // Test applying the parsed markdown design to canvas elements
    const mockElements = [
      { id: 'card1', type: 'card', styles: { backgroundColor: '#FFFFFF' } },
      { id: 'heading1', type: 'heading', styles: { fontFamily: 'Arial' } }
    ];

    const result = applyVibeTheme(parsed.theme, mockElements, {});
    expect(result.pageSettings.backgroundColor).toBe('#0B0F19');
    expect(result.elements[0].styles.backgroundColor).toBe('#161D2F');
    expect(result.elements[0].styles.borderRadius).toBe(20);
    expect(result.elements[1].styles.fontFamily).toBe('Plus Jakarta Sans');
  });
});
