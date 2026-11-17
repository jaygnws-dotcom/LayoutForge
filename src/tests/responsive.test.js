import { describe, it, expect } from 'vitest';
import {
  groupElementsByRows,
  calculateFluidTypography,
  hasVerticalOverlap,
  buildResponsiveLayout,
  getResponsiveElementGeometry,
  getResponsiveArtboardMinHeight,
  DEVICE_WIDTHS
} from '../engine/responsive';
import { generateProjectCode } from '../engine/htmlGenerator';
import { COMPONENT_CATALOG, createNewElement } from '../types/elements';

describe('LayoutForge Responsive Engine', () => {

  // Scenario 1: Standard Hero Section (Heading + Text + 2 CTA buttons side-by-side)
  it('Scenario 1: Groups side-by-side CTA buttons into the same row while keeping Heading and Text in separate rows', () => {
    const elements = [
      { id: 'heading_1', type: 'heading', name: 'Hero Heading', x: 200, y: 100, width: 800, height: 80, content: { text: 'Title' } },
      { id: 'text_1', type: 'text', name: 'Hero Text', x: 250, y: 220, width: 700, height: 60, content: { text: 'Description' } },
      { id: 'btn_1', type: 'button', name: 'Primary CTA', x: 350, y: 320, width: 160, height: 48, content: { text: 'Start' } },
      { id: 'btn_2', type: 'button', name: 'Secondary CTA', x: 530, y: 320, width: 160, height: 48, content: { text: 'Learn More' } }
    ];

    const rows = groupElementsByRows(elements, 1440);

    expect(rows.length).toBe(3);
    expect(rows[0].elements[0].id).toBe('heading_1');
    expect(rows[1].elements[0].id).toBe('text_1');

    // Row 3 should contain both buttons side-by-side sorted by x
    expect(rows[2].elements.length).toBe(2);
    expect(rows[2].elements[0].id).toBe('btn_1');
    expect(rows[2].elements[1].id).toBe('btn_2');
    expect(rows[2].elements[0].x).toBeLessThan(rows[2].elements[1].x);
  });

  // Scenario 2: 3-Column Feature Cards Grid
  it('Scenario 2: Groups 3 parallel cards into a single responsive flex row with proportional percentages', () => {
    const elements = [
      { id: 'card_1', type: 'card', name: 'Card 1', x: 100, y: 400, width: 360, height: 240 },
      { id: 'card_2', type: 'card', name: 'Card 2', x: 500, y: 400, width: 360, height: 240 },
      { id: 'card_3', type: 'card', name: 'Card 3', x: 900, y: 400, width: 360, height: 240 }
    ];

    const rows = groupElementsByRows(elements, 1440);

    expect(rows.length).toBe(1);
    expect(rows[0].elements.length).toBe(3);

    // Each card is 360px on 1440px canvas -> 25%
    rows[0].elements.forEach(el => {
      expect(el.widthPercent).toBe(25);
    });
  });

  // Scenario 3: Navbar with Logo and CTA Links
  it('Scenario 3: Correctly generates semantic header and navigation links', () => {
    const navbar = [
      {
        id: 'nav_1',
        type: 'navbar',
        name: 'Top Nav',
        x: 0,
        y: 20,
        width: 1440,
        height: 70,
        content: { brandText: 'StudioPro', links: ['Features', 'Pricing', 'Docs'], ctaText: 'Sign In' }
      }
    ];

    const { html, css } = generateProjectCode(navbar, { pageWidth: 1440 });

    expect(html).toContain('<header class="lf-top-nav"');
    expect(html).toContain('StudioPro');
    expect(html).toContain('Features');
    expect(html).toContain('Sign In');
    expect(css).toContain('.lf-top-nav');
    expect(css).toContain('.lf-nav-links');
  });

  // Scenario 3a: Navbar with Custom Brand Title Color
  it('Scenario 3a: Generates navbar with custom brand header title text color', () => {
    const navbar = [
      {
        id: 'nav_colored',
        type: 'navbar',
        name: 'Top Nav Custom Color',
        x: 0,
        y: 20,
        width: 1440,
        height: 70,
        content: { brandText: 'ColorForge', brandTextColor: '#7C3AED', links: ['Home'] }
      }
    ];

    const { html } = generateProjectCode(navbar, { pageWidth: 1440 });
    expect(html).toContain('<span class="lf-brand-text" style="color:#7C3AED;">ColorForge</span>');
  });

  // Scenario 3b: Navbar with Full Options (Logo, Links with URLs, Avatar, Search, Badge)
  it('Scenario 3b: Generates complete navbar with logo image, badge, links with URLs, search bar, and avatar', () => {
    const navbar = [
      {
        id: 'nav_full',
        type: 'navbar',
        name: 'Top Nav Full',
        x: 0,
        y: 20,
        width: 1440,
        height: 70,
        content: {
          brandText: 'AlphaTech',
          brandTag: 'V2',
          showLogoImage: true,
          logoUrl: 'https://example.com/logo.png',
          logoHeight: 32,
          logoShape: 'circle',
          links: [
            { label: 'Products', url: '#products' },
            { label: 'Solutions', url: '/solutions' }
          ],
          linksAlignment: 'right',
          showSearch: true,
          searchPlaceholder: 'Quick search...',
          showCta: true,
          ctaText: 'Get Started',
          ctaUrl: '#signup',
          ctaVariant: 'outline',
          showAvatar: true,
          avatarUrl: 'https://example.com/avatar.jpg',
          avatarName: 'Jane Doe',
          avatarShape: 'circle',
          avatarSize: 34,
          showStatusDot: true
        }
      }
    ];

    const { html, css } = generateProjectCode(navbar, { pageWidth: 1440 });

    expect(html).toContain('https://example.com/logo.png');
    expect(html).toContain('AlphaTech');
    expect(html).toContain('V2');
    expect(html).toContain('href="#products"');
    expect(html).toContain('Products');
    expect(html).toContain('href="/solutions"');
    expect(html).toContain('Solutions');
    expect(html).toContain('Quick search...');
    expect(html).toContain('lf-cta-outline');
    expect(html).toContain('https://example.com/avatar.jpg');
    expect(html).toContain('lf-status-dot');
    expect(css).toContain('.lf-nav-logo');
    expect(css).toContain('.lf-nav-avatar');
    expect(css).toContain('.lf-status-dot');
    expect(css).toContain('.lf-nav-search');
  });

  // Scenario 3c: Navbar Typography, Border, Shadow, and Animation Styles
  it('Scenario 3c: Properly applies typography, border, shadow, and motion to navbar', () => {
    const navbar = [
      {
        id: 'nav_styled',
        type: 'navbar',
        name: 'Styled Nav',
        x: 0,
        y: 20,
        width: 1440,
        height: 70,
        content: {
          brandText: 'CustomBrand',
          links: ['Overview', 'Pricing']
        },
        styles: {
          fontFamily: 'Space Grotesk',
          fontSize: 18,
          fontWeight: '600',
          color: '#1E293B',
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: '#2563EB',
          borderRadius: 16,
          boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.12)'
        },
        animation: {
          effect: 'slide-down',
          trigger: 'load',
          duration: 0.8,
          delay: 0.2
        }
      }
    ];

    const { html, css } = generateProjectCode(navbar, { pageWidth: 1440 });

    expect(html).toContain('CustomBrand');
    expect(css).toContain('font-family: "Space Grotesk", sans-serif;');
    expect(css).toContain('font-weight: 600;');
    expect(css).toContain('color: #1E293B;');
    expect(css).toContain('border: 2px dashed #2563EB;');
    expect(css).toContain('border-radius: 16px;');
    expect(css).toContain('box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);');
    expect(css).toContain('animation: lf-slide-down 0.8s ease-out 0.2s 1 both;');
  });

  // Scenario 4: Nested Components inside Container
  it('Scenario 4: Resolves nested children inside container without treating them as separate canvas rows', () => {
    const elements = [
      { id: 'container_1', type: 'container', name: 'Hero Container', x: 100, y: 100, width: 1200, height: 400 },
      { id: 'child_heading', type: 'heading', name: 'Inside Title', parentId: 'container_1', x: 140, y: 140, width: 600, height: 60 },
      { id: 'child_btn', type: 'button', name: 'Inside Button', parentId: 'container_1', x: 140, y: 220, width: 140, height: 44 }
    ];

    const layout = buildResponsiveLayout(elements, {}, 1440);

    // Only 1 top-level row (the container itself)
    expect(layout.rows.length).toBe(1);
    expect(layout.rows[0].elements[0].id).toBe('container_1');

    // Nested children mapped cleanly under container_1
    expect(layout.nestedChildrenMap['container_1'].length).toBe(2);
    expect(layout.nestedChildrenMap['container_1'][0].id).toBe('child_heading');
    expect(layout.nestedChildrenMap['container_1'][1].id).toBe('child_btn');
  });

  // Scenario 5: Multi-breakpoint Overrides & CSS Clamp Typography
  it('Scenario 5: Generates clamp() typography and visibility overrides for mobile and tablet', () => {
    const fontClamp = calculateFluidTypography(48);
    expect(fontClamp).toContain('clamp(');
    expect(fontClamp).toContain('rem');

    const elementsWithOverrides = [
      {
        id: 'desktop_only_banner',
        type: 'badge',
        name: 'Desktop Banner',
        x: 100,
        y: 50,
        width: 300,
        height: 40,
        responsive: { hideOnMobile: true, hideOnTablet: false, hideOnDesktop: false }
      }
    ];

    const { html, css } = generateProjectCode(elementsWithOverrides, {});

    expect(html).toContain('lf-hide-mobile');
    expect(css).toContain('@media (max-width: 639px)');
    expect(css).toContain('.lf-hide-mobile');
    expect(css).toContain('display: none !important');
  });

  // Scenario 6: All Catalog Components Creation, Properties, and HTML Generation
  it('Scenario 6: Successfully creates and generates HTML/CSS for all 19 catalog components', () => {
    expect(COMPONENT_CATALOG.length).toBe(19);

    const allElements = COMPONENT_CATALOG.map((item, index) => {
      const el = createNewElement(item.type, 100, index * 60);
      expect(el.id).toBeTruthy();
      expect(el.type).toBe(item.type);
      expect(el.width).toBeGreaterThan(0);
      expect(el.height).toBeGreaterThan(0);
      return el;
    });

    const { html, css, singleFile } = generateProjectCode(allElements, { pageWidth: 1440 });

    expect(html).toBeTruthy();
    expect(css).toBeTruthy();
    expect(singleFile).toContain('<!DOCTYPE html>');

    // Check key components presence in generated HTML
    expect(html).toContain('Build Extraordinary Homepages Faster');
    expect(html).toContain('<p class="lf-');
    expect(html).toContain('<a href=');
    expect(html).toContain('<header');
    expect(html).toContain('<footer');
    expect(html).toContain('<input type="checkbox"');
    expect(html).toContain('<input type="radio"');
    expect(html).toContain('<select');
    expect(html).toContain('<textarea');
    expect(html).toContain('<hr class="');
    expect(html).toContain('Intelligent responsive flex clustering');
  });

  // Scenario 7: Label and Typography Alignment Verification
  it('Scenario 7: Generates proper alignment and block styles for Label component', () => {
    const labelCentered = [
      {
        id: 'label_centered',
        type: 'label',
        name: 'Centered Label',
        x: 100,
        y: 100,
        width: 300,
        height: 40,
        content: { text: 'CENTERED LABEL' },
        styles: { textAlign: 'center', color: '#2563EB' }
      }
    ];

    const { html, css } = generateProjectCode(labelCentered, {});

    expect(html).toContain('CENTERED LABEL');
    expect(css).toContain('text-align: center;');
    expect(css).toContain('display: block; width: 100%;');
  });

  // Scenario 8: Automatic Responsive Geometry for Navbar and Footer
  it('Scenario 8: Automatically adapts Navbar and Footer width and height across viewports', () => {
    const navbar = { id: 'nav_1', type: 'navbar', x: 0, y: 0, width: 1440, height: 72 };
    const footer = { id: 'foot_1', type: 'footer', x: 0, y: 800, width: 1440, height: 120 };

    // Desktop
    const navDesktop = getResponsiveElementGeometry(navbar, 'desktop');
    expect(navDesktop.width).toBe(1440);
    expect(navDesktop.height).toBe(72);

    // Tablet (768px)
    const navTablet = getResponsiveElementGeometry(navbar, 'tablet');
    expect(navTablet.width).toBe(DEVICE_WIDTHS.tablet);
    expect(navTablet.x).toBe(0);

    const footTablet = getResponsiveElementGeometry(footer, 'tablet');
    expect(footTablet.width).toBe(DEVICE_WIDTHS.tablet);
    expect(footTablet.x).toBe(0);

    // Mobile (375px)
    const navMobile = getResponsiveElementGeometry(navbar, 'mobile');
    expect(navMobile.width).toBe(DEVICE_WIDTHS.mobile);
    expect(navMobile.x).toBe(0);

    const footMobile = getResponsiveElementGeometry(footer, 'mobile');
    expect(footMobile.width).toBe(DEVICE_WIDTHS.mobile);
    expect(footMobile.height).toBeGreaterThanOrEqual(140); // Expanded for vertical stack
  });

  // Scenario 9: Multi-column Cards Stacking on Mobile and Tablet
  it('Scenario 9: Stacks 3-column desktop cards into single column on mobile and 2-column on tablet', () => {
    const cards = [
      { id: 'c1', type: 'card', x: 60, y: 300, width: 400, height: 220 },
      { id: 'c2', type: 'card', x: 520, y: 300, width: 400, height: 220 },
      { id: 'c3', type: 'card', x: 980, y: 300, width: 400, height: 220 }
    ];

    // Mobile: cards stack vertically, width 335px (375 - 40)
    const m1 = getResponsiveElementGeometry(cards[0], 'mobile', cards);
    const m2 = getResponsiveElementGeometry(cards[1], 'mobile', cards);
    const m3 = getResponsiveElementGeometry(cards[2], 'mobile', cards);

    expect(m1.width).toBe(335);
    expect(m2.width).toBe(335);
    expect(m3.width).toBe(335);
    expect(m1.x).toBe(20);
    expect(m2.x).toBe(20);
    expect(m3.x).toBe(20);

    // Stacking Y coordinates
    expect(m1.y).toBe(300);
    expect(m2.y).toBeGreaterThan(m1.y);
    expect(m3.y).toBeGreaterThan(m2.y);

    // Tablet: 2 columns in first row, 3rd card on row 2
    const t1 = getResponsiveElementGeometry(cards[0], 'tablet', cards);
    const t2 = getResponsiveElementGeometry(cards[1], 'tablet', cards);
    const t3 = getResponsiveElementGeometry(cards[2], 'tablet', cards);

    expect(t1.width).toBe(t2.width);
    expect(t1.y).toBe(t2.y);
    expect(t2.x).toBeGreaterThan(t1.x);
    expect(t3.y).toBeGreaterThan(t1.y);
  });

  // Scenario 10: Headings and Typography Scaling with Center Alignment Preservation
  it('Scenario 10: Dynamically scales typography sizes and preserves center alignment', () => {
    const heading = {
      id: 'h1',
      type: 'heading',
      x: 320,
      y: 100,
      width: 800,
      height: 60,
      styles: { fontSize: 48 }
    };

    const hMobile = getResponsiveElementGeometry(heading, 'mobile');
    expect(hMobile.width).toBeLessThanOrEqual(335);
    expect(hMobile.styles.fontSize).toBeLessThan(48);
    expect(hMobile.styles.fontSize).toBeGreaterThanOrEqual(22);
    // Center aligned within mobile viewport (375 - width) / 2
    expect(hMobile.x).toBe(Math.round((375 - hMobile.width) / 2));
  });

  // Scenario 11: Dynamic Artboard Min Height Expansion and User Responsive Overrides
  it('Scenario 11: Expands artboard min height for stacked content and honors user overrides', () => {
    const elements = [
      { id: 'c1', type: 'card', x: 60, y: 400, width: 400, height: 250 },
      { id: 'c2', type: 'card', x: 520, y: 400, width: 400, height: 250 },
      { id: 'c3', type: 'card', x: 980, y: 400, width: 400, height: 250 },
      { id: 'footer', type: 'footer', x: 0, y: 700, width: 1440, height: 120 }
    ];

    const desktopHeight = getResponsiveArtboardMinHeight(elements, 'desktop', 960);
    expect(desktopHeight).toBe(960);

    const mobileHeight = getResponsiveArtboardMinHeight(elements, 'mobile', 960);
    expect(mobileHeight).toBeGreaterThan(desktopHeight);

    // Explicit override test
    const customCard = {
      id: 'custom_1',
      type: 'card',
      x: 100,
      y: 100,
      width: 400,
      height: 200,
      responsiveOverride: {
        mobile: { x: 15, y: 120, width: 345, height: 280 }
      }
    };
    const overridden = getResponsiveElementGeometry(customCard, 'mobile', [customCard]);
    expect(overridden.x).toBe(15);
    expect(overridden.y).toBe(120);
    expect(overridden.width).toBe(345);
    expect(overridden.height).toBe(280);
  });
});
