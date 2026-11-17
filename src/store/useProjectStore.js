import { create } from 'zustand';
import { createNewElement, THEME_COLORS } from '../types/elements';
import { isElementInsideContainer, getRelatedGroupIds } from '../utils/groupingUtils';

const STORAGE_KEY = 'layoutforge_project_light_v2';
const MAX_HISTORY = 40;

const DEFAULT_INITIAL_ELEMENTS = [
  // Navbar
  {
    id: 'el_navbar_1',
    type: 'navbar',
    name: 'Top Navigation',
    parentId: null,
    locked: false,
    hidden: false,
    x: 120,
    y: 30,
    width: 1200,
    height: 68,
    rotation: 0,
    zIndex: 15,
    content: {
      brandText: 'LayoutForge',
      brandTag: 'v2.4',
      showLogoImage: true,
      logoUrl: '',
      logoHeight: 28,
      logoShape: 'rounded',
      links: [
        { label: 'Features', url: '#features' },
        { label: 'Showcase', url: '#showcase' },
        { label: 'Engine', url: '#engine' },
        { label: 'Pricing', url: '#pricing' }
      ],
      linksAlignment: 'center',
      showSearch: false,
      searchPlaceholder: 'Search...',
      showCta: true,
      ctaText: 'Launch Studio',
      ctaUrl: '#',
      ctaVariant: 'primary',
      showAvatar: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      avatarName: 'Sarah K.',
      avatarShape: 'circle',
      avatarSize: 32,
      showStatusDot: true
    },
    styles: {
      fontFamily: 'Rethink Sans',
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 14,
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      padding: { top: 12, right: 24, bottom: 12, left: 24 }
    },
    animation: { effect: 'fade-in', trigger: 'load', duration: 0.6, delay: 0.1, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Badge
  {
    id: 'el_badge_1',
    type: 'badge',
    name: 'Release Pill',
    parentId: null,
    locked: false,
    hidden: false,
    x: 620,
    y: 135,
    width: 200,
    height: 32,
    rotation: 0,
    zIndex: 10,
    content: { text: '✨ ENGINE v2.0 READY' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 12,
      fontWeight: '400',
      color: THEME_COLORS.primary,
      textAlign: 'center',
      backgroundColor: THEME_COLORS.accentSoft,
      borderColor: THEME_COLORS.primary,
      borderWidth: 1,
      borderRadius: 9999,
      padding: { top: 4, right: 12, bottom: 4, left: 12 }
    },
    animation: { effect: 'zoom-in', trigger: 'load', duration: 0.5, delay: 0.2, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Main Hero Heading
  {
    id: 'el_heading_1',
    type: 'heading',
    name: 'Hero Title',
    parentId: null,
    locked: false,
    hidden: false,
    x: 270,
    y: 185,
    width: 900,
    height: 96,
    rotation: 0,
    zIndex: 10,
    content: { text: 'Visual Layouts That Convert To Flawless Responsive Code', tag: 'h1' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 41,
      fontWeight: '400',
      color: THEME_COLORS.onSurface,
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 0,
      backgroundColor: 'transparent',
      padding: { top: 4, right: 8, bottom: 4, left: 8 }
    },
    animation: { effect: 'slide-up', trigger: 'load', duration: 0.7, delay: 0.3, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Subtext Paragraph
  {
    id: 'el_text_1',
    type: 'text',
    name: 'Hero Description',
    parentId: null,
    locked: false,
    hidden: false,
    x: 360,
    y: 300,
    width: 720,
    height: 60,
    rotation: 0,
    zIndex: 10,
    content: {
      text: 'Place elements anywhere with pixel freedom. Our responsive clustering engine automatically converts absolute coordinates into semantic Flexbox and fluid media queries.'
    },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 16.2,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      textAlign: 'center',
      lineHeight: 1.62,
      backgroundColor: 'transparent',
      padding: { top: 4, right: 8, bottom: 4, left: 8 }
    },
    animation: { effect: 'slide-up', trigger: 'load', duration: 0.7, delay: 0.4, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Primary CTA Button
  {
    id: 'el_btn_1',
    type: 'button',
    name: 'Primary Button',
    parentId: null,
    locked: false,
    hidden: false,
    x: 545,
    y: 385,
    width: 170,
    height: 50,
    rotation: 0,
    zIndex: 10,
    content: { text: 'Export HTML & CSS', url: '#' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.neutral,
      textAlign: 'center',
      backgroundColor: THEME_COLORS.primary,
      borderColor: THEME_COLORS.primary,
      borderWidth: 1,
      borderRadius: 10,
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
      padding: { top: 12, right: 20, bottom: 12, left: 20 }
    },
    animation: { effect: 'pulse', trigger: 'load', duration: 0.8, delay: 0.5, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Secondary CTA Button
  {
    id: 'el_btn_2',
    type: 'button',
    name: 'Secondary Button',
    parentId: null,
    locked: false,
    hidden: false,
    x: 735,
    y: 385,
    width: 160,
    height: 50,
    rotation: 0,
    zIndex: 10,
    content: { text: 'Live Preview', url: '#' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      textAlign: 'center',
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 10,
      padding: { top: 12, right: 20, bottom: 12, left: 20 }
    },
    animation: { effect: 'slide-up', trigger: 'load', duration: 0.8, delay: 0.55, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Feature Card 1
  {
    id: 'el_card_1',
    type: 'card',
    name: 'Feature Card 1',
    parentId: null,
    locked: false,
    hidden: false,
    x: 120,
    y: 475,
    width: 360,
    height: 220,
    rotation: 0,
    zIndex: 5,
    content: {},
    styles: {
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 16,
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
      padding: { top: 24, right: 24, bottom: 24, left: 24 }
    },
    animation: { effect: 'fade-in', trigger: 'scroll', duration: 0.6, delay: 0.1, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  {
    id: 'el_card_heading_1',
    type: 'heading',
    name: 'Card 1 Title',
    parentId: 'el_card_1',
    locked: false,
    hidden: false,
    x: 144,
    y: 505,
    width: 310,
    height: 36,
    rotation: 0,
    zIndex: 10,
    content: { text: '⚡ Zero Dependency Output', tag: 'h3' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 22,
      fontWeight: '400',
      color: THEME_COLORS.onSurface,
      textAlign: 'center',
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  {
    id: 'el_card_text_1',
    type: 'text',
    name: 'Card 1 Body',
    parentId: 'el_card_1',
    locked: false,
    hidden: false,
    x: 144,
    y: 550,
    width: 310,
    height: 70,
    rotation: 0,
    zIndex: 10,
    content: { text: 'Download pure HTML and CSS with standard CSS variables. No React runtimes or bloated libraries required.' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      textAlign: 'center',
      lineHeight: 1.53,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Feature Card 2
  {
    id: 'el_card_2',
    type: 'card',
    name: 'Feature Card 2',
    parentId: null,
    locked: false,
    hidden: false,
    x: 540,
    y: 475,
    width: 360,
    height: 220,
    rotation: 0,
    zIndex: 5,
    content: {},
    styles: {
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 16,
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
      padding: { top: 24, right: 24, bottom: 24, left: 24 }
    },
    animation: { effect: 'fade-in', trigger: 'scroll', duration: 0.6, delay: 0.2, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  {
    id: 'el_card_heading_2',
    type: 'heading',
    name: 'Card 2 Title',
    parentId: 'el_card_2',
    locked: false,
    hidden: false,
    x: 564,
    y: 505,
    width: 310,
    height: 36,
    rotation: 0,
    zIndex: 10,
    content: { text: '📐 Fluid CSS Clamp', tag: 'h3' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 22,
      fontWeight: '400',
      color: THEME_COLORS.onSurface,
      textAlign: 'center',
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  {
    id: 'el_card_text_2',
    type: 'text',
    name: 'Card 2 Body',
    parentId: 'el_card_2',
    locked: false,
    hidden: false,
    x: 564,
    y: 550,
    width: 310,
    height: 70,
    rotation: 0,
    zIndex: 10,
    content: { text: 'Headings and text automatically scale between mobile and desktop viewports using CSS clamp() calculations.' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      textAlign: 'center',
      lineHeight: 1.53,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Feature Card 3
  {
    id: 'el_card_3',
    type: 'card',
    name: 'Feature Card 3',
    parentId: null,
    locked: false,
    hidden: false,
    x: 960,
    y: 475,
    width: 360,
    height: 220,
    rotation: 0,
    zIndex: 5,
    content: {},
    styles: {
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 16,
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
      padding: { top: 24, right: 24, bottom: 24, left: 24 }
    },
    animation: { effect: 'fade-in', trigger: 'scroll', duration: 0.6, delay: 0.3, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  {
    id: 'el_card_heading_3',
    type: 'heading',
    name: 'Card 3 Title',
    parentId: 'el_card_3',
    locked: false,
    hidden: false,
    x: 984,
    y: 505,
    width: 310,
    height: 36,
    rotation: 0,
    zIndex: 10,
    content: { text: '📦 Asset ZIP Packaging', tag: 'h3' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 22,
      fontWeight: '400',
      color: THEME_COLORS.onSurface,
      textAlign: 'center',
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  {
    id: 'el_card_text_3',
    type: 'text',
    name: 'Card 3 Body',
    parentId: 'el_card_3',
    locked: false,
    hidden: false,
    x: 984,
    y: 550,
    width: 310,
    height: 70,
    rotation: 0,
    zIndex: 10,
    content: { text: 'Uploaded images are extracted into an assets folder and paths are automatically rewritten for deployment.' },
    styles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      textAlign: 'center',
      lineHeight: 1.53,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  },
  // Footer
  {
    id: 'el_footer_1',
    type: 'footer',
    name: 'Bottom Footer',
    parentId: null,
    locked: false,
    hidden: false,
    x: 120,
    y: 740,
    width: 1200,
    height: 110,
    rotation: 0,
    zIndex: 10,
    content: {
      copyright: '© 2026 LayoutForge. Pure Semantic Responsive Export.',
      links: ['Privacy', 'Documentation', 'GitHub', 'Export Guide']
    },
    styles: {
      backgroundColor: THEME_COLORS.muted,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: { top: 20, right: 24, bottom: 20, left: 24 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.5, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  }
];

const loadPersistedProject = () => {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.elements) && data.elements.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // silently catch in test/SSR environments
  }
  return null;
};

const persisted = loadPersistedProject();

const DEFAULT_PAGES = [
  {
    id: 'page_home',
    name: 'Home',
    path: '/',
    pageSettings: persisted?.pageSettings || {
      backgroundColor: THEME_COLORS.surface,
      backgroundGradient: null,
      backgroundImage: null,
      defaultFont: 'Rethink Sans',
      pageWidth: 1440,
      minHeight: 960
    },
    elements: persisted?.elements || DEFAULT_INITIAL_ELEMENTS
  },
  {
    id: 'page_about',
    name: 'About Studio',
    path: '/about',
    pageSettings: {
      backgroundColor: '#FAF8F5',
      backgroundGradient: null,
      backgroundImage: null,
      defaultFont: 'Rethink Sans',
      pageWidth: 1440,
      minHeight: 800
    },
    elements: []
  },
  {
    id: 'page_pricing',
    name: 'Pricing & Plans',
    path: '/pricing',
    pageSettings: {
      backgroundColor: THEME_COLORS.surface,
      defaultFont: 'Rethink Sans',
      pageWidth: 1440,
      minHeight: 800
    },
    elements: []
  },
  {
    id: 'page_contact',
    name: 'Contact',
    path: '/contact',
    pageSettings: {
      backgroundColor: THEME_COLORS.surface,
      defaultFont: 'Rethink Sans',
      pageWidth: 1440,
      minHeight: 800
    },
    elements: []
  }
];

export const useProjectStore = create((set, get) => ({
  // Project Info
  projectName: persisted?.projectName || 'My Next-Gen Homepage',
  setProjectName: (name) => {
    set({ projectName: name });
    get().saveToStorage();
  },

  // Multi-Page Management
  pages: (persisted?.pages && Array.isArray(persisted.pages) && persisted.pages.length > 0)
    ? persisted.pages
    : DEFAULT_PAGES,
  activePageId: persisted?.activePageId || 'page_home',

  switchPage: (pageId) => {
    const { pages, activePageId, elements, pageSettings } = get();
    if (pageId === activePageId) return;

    // Save current active page state into pages array
    const updatedPages = pages.map(p =>
      p.id === activePageId ? { ...p, elements, pageSettings } : p
    );

    const targetPage = updatedPages.find(p => p.id === pageId);
    if (!targetPage) return;

    set({
      pages: updatedPages,
      activePageId: pageId,
      elements: targetPage.elements || [],
      pageSettings: targetPage.pageSettings || pageSettings,
      selectedElementIds: [],
      history: [],
      future: []
    });

    get().saveToStorage();
  },

  addPage: (name = 'New Page', path = '') => {
    get().pushHistory();
    const { pages, elements, pageSettings } = get();
    const cleanId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const pagePath = path || `/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // Optionally keep existing Navbar and Footer for seamless consistency
    const sharedNav = elements.find(el => el.type === 'navbar');
    const sharedFooter = elements.find(el => el.type === 'footer');
    const initialElements = [];
    if (sharedNav) initialElements.push({ ...JSON.parse(JSON.stringify(sharedNav)), id: `el_nav_${Date.now()}` });
    if (sharedFooter) initialElements.push({ ...JSON.parse(JSON.stringify(sharedFooter)), id: `el_footer_${Date.now()}` });

    const newPage = {
      id: cleanId,
      name,
      path: pagePath,
      pageSettings: { ...pageSettings },
      elements: initialElements
    };

    set({
      pages: [...pages, newPage]
    });

    get().switchPage(cleanId);
  },

  duplicatePage: (pageId) => {
    get().pushHistory();
    const { pages } = get();
    const target = pages.find(p => p.id === pageId);
    if (!target) return;

    const cleanId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: cleanId,
      name: `${target.name} (Copy)`,
      path: `${target.path}-copy`
    };

    set({ pages: [...pages, duplicated] });
    get().saveToStorage();
  },

  deletePage: (pageId) => {
    const { pages, activePageId } = get();
    if (pages.length <= 1) return; // Keep at least one page
    get().pushHistory();

    const filtered = pages.filter(p => p.id !== pageId);
    let nextActiveId = activePageId;
    if (activePageId === pageId) {
      nextActiveId = filtered[0].id;
    }

    set({ pages: filtered });
    if (nextActiveId !== activePageId) {
      get().switchPage(nextActiveId);
    } else {
      get().saveToStorage();
    }
  },

  renamePage: (pageId, newName, newPath) => {
    set(state => ({
      pages: state.pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              name: newName || p.name,
              path: newPath !== undefined ? newPath : p.path
            }
          : p
      )
    }));
    get().saveToStorage();
  },

  // Page Settings (Light Mode Defaults)
  pageSettings: persisted?.pageSettings || {
    backgroundColor: THEME_COLORS.surface,
    backgroundGradient: null,
    backgroundImage: null,
    defaultFont: 'Rethink Sans',
    pageWidth: 1440,
    minHeight: 960
  },
  updatePageSettings: (settings) => {
    get().pushHistory();
    set(state => {
      const nextSettings = { ...state.pageSettings, ...settings };
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, pageSettings: nextSettings } : p
      );
      return {
        pageSettings: nextSettings,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Viewport & Zoom
  activeDevice: 'desktop',
  setActiveDevice: (device) => set({ activeDevice: device }),
  zoom: 0.85,
  setZoom: (zoom) => set({ zoom: Math.min(2.0, Math.max(0.25, zoom)) }),
  zoomIn: () => set(s => ({ zoom: Math.min(2.0, +(s.zoom + 0.1).toFixed(2)) })),
  zoomOut: () => set(s => ({ zoom: Math.max(0.25, +(s.zoom - 0.1).toFixed(2)) })),
  resetZoom: () => set({ zoom: 0.85 }),

  // Grid & Guides
  showGrid: true,
  toggleGrid: () => set(s => ({ showGrid: !s.showGrid })),
  gridSize: 20,
  setGridSize: (size) => set({ gridSize: size }),
  gridType: 'lines', // 'lines' | 'dots' | 'columns'
  setGridType: (gridType) => set({ gridType }),
  snapToGrid: true,
  toggleSnapToGrid: () => set(s => ({ snapToGrid: !s.snapToGrid })),
  showSnapGuides: true,
  toggleSnapGuides: () => set(s => ({ showSnapGuides: !s.showSnapGuides })),

  // Elements
  elements: persisted?.elements || DEFAULT_INITIAL_ELEMENTS,
  selectedElementIds: [],

  // Selection
  selectElement: (id, isMulti = false) => {
    set(state => {
      if (!id) return { selectedElementIds: [] };
      if (isMulti) {
        const exists = state.selectedElementIds.includes(id);
        return {
          selectedElementIds: exists
            ? state.selectedElementIds.filter(x => x !== id)
            : [...state.selectedElementIds, id]
        };
      }
      return { selectedElementIds: [id] };
    });
  },

  clearSelection: () => set({ selectedElementIds: [] }),

  // Add Element
  addElement: (type, x = 120, y = 120, parentId = null) => {
    get().pushHistory();
    const newEl = createNewElement(type, x, y, parentId);
    set(state => {
      const nextElements = [...state.elements, newEl];
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages,
        selectedElementIds: [newEl.id]
      };
    });
    get().saveToStorage();
    return newEl;
  },

  // Update Single Element
  updateElement: (id, updates) => {
    set(state => {
      const nextElements = state.elements.map(el => {
        if (el.id !== id) return el;
        return {
          ...el,
          ...updates,
          content: updates.content ? { ...el.content, ...updates.content } : el.content,
          styles: updates.styles ? { ...el.styles, ...updates.styles } : el.styles,
          animation: updates.animation ? { ...el.animation, ...updates.animation } : el.animation,
          hoverStyles: updates.hoverStyles ? { ...el.hoverStyles, ...updates.hoverStyles } : el.hoverStyles,
          responsive: updates.responsive ? { ...el.responsive, ...updates.responsive } : el.responsive
        };
      });
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Update Element with History recorded
  updateElementWithHistory: (id, updates) => {
    get().pushHistory();
    get().updateElement(id, updates);
  },

  // Move or Resize Element
  setElementGeometry: (id, { x, y, width, height, rotation }) => {
    set(state => {
      const activeDevice = state.activeDevice;
      const isDeviceOverride = activeDevice && activeDevice !== 'desktop';

      const nextElements = state.elements.map(el => {
        if (el.id !== id) return el;

        if (isDeviceOverride) {
          const prevOverride = el.responsiveOverride?.[activeDevice] || {};
          return {
            ...el,
            responsiveOverride: {
              ...(el.responsiveOverride || {}),
              [activeDevice]: {
                ...prevOverride,
                ...(x !== undefined ? { x: Math.round(x) } : {}),
                ...(y !== undefined ? { y: Math.round(y) } : {}),
                ...(width !== undefined ? { width: Math.max(20, Math.round(width)) } : {}),
                ...(height !== undefined ? { height: Math.max(10, Math.round(height)) } : {})
              }
            }
          };
        }

        return {
          ...el,
          x: x !== undefined ? Math.round(x) : el.x,
          y: y !== undefined ? Math.round(y) : el.y,
          width: width !== undefined ? Math.max(20, Math.round(width)) : el.width,
          height: height !== undefined ? Math.max(10, Math.round(height)) : el.height,
          rotation: rotation !== undefined ? Math.round(rotation) : el.rotation
        };
      });
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Move Element and its grouped/contained elements together (Shift + mouse drag / Card drag)
  moveElementsGroup: (primaryId, relatedIds = [], dx = 0, dy = 0) => {
    if (!dx && !dy) return;
    get().pushHistory();
    set(state => {
      const allTargetIds = new Set([primaryId, ...(relatedIds || [])]);
      const nextElements = state.elements.map(el => {
        if (!allTargetIds.has(el.id) || el.locked) return el;
        return {
          ...el,
          x: Math.round(el.x + dx),
          y: Math.round(el.y + dy)
        };
      });
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Group multiple elements (Ctrl+G)
  groupElements: (ids = null) => {
    const targetIds = ids || get().selectedElementIds;
    if (!targetIds || targetIds.length < 2) return;
    get().pushHistory();
    const newGroupId = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    set(state => {
      const nextElements = state.elements.map(el => {
        if (targetIds.includes(el.id)) {
          return { ...el, groupId: newGroupId };
        }
        return el;
      });
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Ungroup elements (Ctrl+Shift+G)
  ungroupElements: (ids = null) => {
    const targetIds = ids || get().selectedElementIds;
    if (!targetIds || !targetIds.length) return;
    get().pushHistory();
    set(state => {
      const nextElements = state.elements.map(el => {
        if (targetIds.includes(el.id)) {
          const { groupId, ...rest } = el;
          return { ...rest, groupId: null };
        }
        return el;
      });
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Select an entire group/card and its contents
  selectGroupElements: (elementId) => {
    const state = get();
    const target = state.elements.find(e => e.id === elementId);
    if (!target) return;
    const relatedIds = getRelatedGroupIds(target, state.elements, state.selectedElementIds, true);
    set({
      selectedElementIds: Array.from(new Set([elementId, ...relatedIds]))
    });
  },

  // Delete Selected or By ID
  deleteElements: (idsToDelete = null) => {
    const targetIds = idsToDelete || get().selectedElementIds;
    if (!targetIds.length) return;
    get().pushHistory();
    set(state => {
      const allToRemove = new Set(targetIds);
      let foundMore = true;
      while (foundMore) {
        foundMore = false;
        state.elements.forEach(el => {
          if (el.parentId && allToRemove.has(el.parentId) && !allToRemove.has(el.id)) {
            allToRemove.add(el.id);
            foundMore = true;
          }
        });
      }
      return {
        elements: state.elements.filter(el => !allToRemove.has(el.id)),
        selectedElementIds: []
      };
    });
    get().saveToStorage();
  },

  // Duplicate Selected Elements
  duplicateElements: (idsToDuplicate = null) => {
    const targetIds = idsToDuplicate || get().selectedElementIds;
    if (!targetIds.length) return;
    get().pushHistory();
    set(state => {
      const clones = [];
      const newSelected = [];
      targetIds.forEach(id => {
        const el = state.elements.find(e => e.id === id);
        if (!el) return;
        const cloneId = `el_${el.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const cloned = {
          ...JSON.parse(JSON.stringify(el)),
          id: cloneId,
          name: `${el.name} (Copy)`,
          x: el.x + 24,
          y: el.y + 24
        };
        clones.push(cloned);
        newSelected.push(cloneId);
      });
      return {
        elements: [...state.elements, ...clones],
        selectedElementIds: newSelected
      };
    });
    get().saveToStorage();
  },

  // Z-Index reordering
  bringForward: (id) => {
    get().pushHistory();
    set(state => {
      const el = state.elements.find(e => e.id === id);
      if (!el) return {};
      return {
        elements: state.elements.map(e => e.id === id ? { ...e, zIndex: (e.zIndex || 10) + 1 } : e)
      };
    });
    get().saveToStorage();
  },

  sendBackward: (id) => {
    get().pushHistory();
    set(state => {
      const el = state.elements.find(e => e.id === id);
      if (!el) return {};
      return {
        elements: state.elements.map(e => e.id === id ? { ...e, zIndex: Math.max(1, (e.zIndex || 10) - 1) } : e)
      };
    });
    get().saveToStorage();
  },

  bringToFront: (id) => {
    get().pushHistory();
    set(state => {
      const maxZ = Math.max(...state.elements.map(e => e.zIndex || 1), 10);
      return {
        elements: state.elements.map(e => e.id === id ? { ...e, zIndex: maxZ + 2 } : e)
      };
    });
    get().saveToStorage();
  },

  sendToBack: (id) => {
    get().pushHistory();
    set(state => {
      return {
        elements: state.elements.map(e => e.id === id ? { ...e, zIndex: 1 } : e)
      };
    });
    get().saveToStorage();
  },

  toggleLock: (id) => {
    set(state => ({
      elements: state.elements.map(e => e.id === id ? { ...e, locked: !e.locked } : e)
    }));
    get().saveToStorage();
  },

  toggleHide: (id) => {
    set(state => ({
      elements: state.elements.map(e => e.id === id ? { ...e, hidden: !e.hidden } : e)
    }));
    get().saveToStorage();
  },

  reorderElements: (newOrder) => {
    get().pushHistory();
    set({ elements: newOrder });
    get().saveToStorage();
  },

  // Align tools
  alignElements: (type) => {
    const selectedIds = get().selectedElementIds;
    if (selectedIds.length === 0) return;
    get().pushHistory();

    set(state => {
      const selected = state.elements.filter(e => selectedIds.includes(e.id));
      if (!selected.length) return {};
      const artboardWidth = state.pageSettings.pageWidth || 1440;
      const artboardHeight = state.pageSettings.minHeight || 960;

      let updateMap = {};
      if (selected.length === 1) {
        const el = selected[0];
        if (type === 'center') {
          updateMap[el.id] = { x: Math.max(0, Math.round((artboardWidth - el.width) / 2)) };
        } else if (type === 'left') {
          updateMap[el.id] = { x: 40 };
        } else if (type === 'right') {
          updateMap[el.id] = { x: Math.max(0, artboardWidth - el.width - 40) };
        } else if (type === 'middle') {
          updateMap[el.id] = { y: Math.max(0, Math.round((artboardHeight - el.height) / 2)) };
        } else if (type === 'top') {
          updateMap[el.id] = { y: 40 };
        } else if (type === 'bottom') {
          updateMap[el.id] = { y: Math.max(0, artboardHeight - el.height - 40) };
        }
      } else {
        if (type === 'left') {
          const minX = Math.min(...selected.map(e => e.x));
          selected.forEach(e => { updateMap[e.id] = { x: minX }; });
        } else if (type === 'center') {
          const avgCenterX = selected.reduce((acc, e) => acc + (e.x + e.width / 2), 0) / selected.length;
          selected.forEach(e => { updateMap[e.id] = { x: Math.round(avgCenterX - e.width / 2) }; });
        } else if (type === 'right') {
          const maxRight = Math.max(...selected.map(e => e.x + e.width));
          selected.forEach(e => { updateMap[e.id] = { x: Math.round(maxRight - e.width) }; });
        } else if (type === 'top') {
          const minY = Math.min(...selected.map(e => e.y));
          selected.forEach(e => { updateMap[e.id] = { y: minY }; });
        } else if (type === 'middle') {
          const avgCenterY = selected.reduce((acc, e) => acc + (e.y + e.height / 2), 0) / selected.length;
          selected.forEach(e => { updateMap[e.id] = { y: Math.round(avgCenterY - e.height / 2) }; });
        } else if (type === 'bottom') {
          const maxBottom = Math.max(...selected.map(e => e.y + e.height));
          selected.forEach(e => { updateMap[e.id] = { y: Math.round(maxBottom - e.height) }; });
        }
      }

      return {
        elements: state.elements.map(e => updateMap[e.id] ? { ...e, ...updateMap[e.id] } : e)
      };
    });
    get().saveToStorage();
  },

  // Distribute tools
  distributeElements: (direction) => {
    const selectedIds = get().selectedElementIds;
    if (selectedIds.length < 3) return;
    get().pushHistory();

    set(state => {
      const selected = state.elements.filter(e => selectedIds.includes(e.id));
      let updateMap = {};

      if (direction === 'horizontal') {
        const sorted = [...selected].sort((a, b) => a.x - b.x);
        const minX = sorted[0].x;
        const lastEl = sorted[sorted.length - 1];
        const maxX = lastEl.x + lastEl.width;
        const totalElemWidth = sorted.reduce((sum, e) => sum + e.width, 0);
        const gap = Math.max(0, (maxX - minX - totalElemWidth) / (sorted.length - 1));

        let currentX = minX;
        sorted.forEach(e => {
          updateMap[e.id] = { x: Math.round(currentX) };
          currentX += e.width + gap;
        });
      } else if (direction === 'vertical') {
        const sorted = [...selected].sort((a, b) => a.y - b.y);
        const minY = sorted[0].y;
        const lastEl = sorted[sorted.length - 1];
        const maxY = lastEl.y + lastEl.height;
        const totalElemHeight = sorted.reduce((sum, e) => sum + e.height, 0);
        const gap = Math.max(0, (maxY - minY - totalElemHeight) / (sorted.length - 1));

        let currentY = minY;
        sorted.forEach(e => {
          updateMap[e.id] = { y: Math.round(currentY) };
          currentY += e.height + gap;
        });
      }

      return {
        elements: state.elements.map(e => updateMap[e.id] ? { ...e, ...updateMap[e.id] } : e)
      };
    });
    get().saveToStorage();
  },

  // Nudge by arrow keys (includes contained elements for cards/containers)
  nudgeSelected: (dx, dy) => {
    const selectedIds = get().selectedElementIds;
    if (!selectedIds.length) return;
    set(state => {
      const expandedIds = new Set(selectedIds);
      state.elements.forEach(el => {
        if (selectedIds.includes(el.id)) {
          if (['card', 'container', 'section'].includes(el.type)) {
            state.elements.forEach(child => {
              if (child.parentId === el.id || isElementInsideContainer(el, child)) {
                expandedIds.add(child.id);
              }
            });
          }
        }
      });
      const nextElements = state.elements.map(e => {
        if (!expandedIds.has(e.id) || e.locked) return e;
        return {
          ...e,
          x: Math.max(0, e.x + dx),
          y: Math.max(0, e.y + dy)
        };
      });
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: nextElements } : p
      );
      return {
        elements: nextElements,
        pages: updatedPages
      };
    });
    get().saveToStorage();
  },

  // Clear Canvas
  clearCanvas: () => {
    get().pushHistory();
    set({ elements: [], selectedElementIds: [] });
    get().saveToStorage();
  },

  // Apply AI Generated Layout
  applyAiGeneratedLayout: ({ elements, pageSettings, append = false, projectName }) => {
    get().pushHistory();
    set(state => {
      let finalElements = [];
      let finalPageSettings = { ...state.pageSettings };

      if (pageSettings && !append) {
        finalPageSettings = { ...finalPageSettings, ...pageSettings };
      }

      if (append) {
        // Find bottommost Y coordinate among existing elements
        const currentMaxY = state.elements.reduce((max, el) => Math.max(max, (el.y || 0) + (el.height || 0)), 0);
        const yOffset = currentMaxY > 0 ? currentMaxY + 80 : 0;

        const shiftedElements = elements.map(el => ({
          ...el,
          id: `el_${el.type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          y: Math.round(el.y + yOffset)
        }));

        finalElements = [...state.elements, ...shiftedElements];
      } else {
        finalElements = elements;
      }

      // Automatically adjust artboard minHeight if content overflows
      const totalBottom = finalElements.reduce((max, el) => Math.max(max, (el.y || 0) + (el.height || 0)), 0);
      if (totalBottom + 120 > (finalPageSettings.minHeight || 960)) {
        finalPageSettings.minHeight = Math.max(960, Math.ceil((totalBottom + 120) / 100) * 100);
      }

      return {
        elements: finalElements,
        pageSettings: finalPageSettings,
        selectedElementIds: finalElements.length > 0 ? [finalElements[0].id] : [],
        projectName: projectName || state.projectName
      };
    });
    get().saveToStorage();
  },

  // Reset to Default Template
  resetTemplate: () => {
    get().pushHistory();
    const defaultSettings = {
      backgroundColor: THEME_COLORS.surface,
      backgroundGradient: null,
      backgroundImage: null,
      defaultFont: 'Rethink Sans',
      pageWidth: 1440,
      minHeight: 960
    };
    const freshPages = [
      { id: 'page_home', name: 'Home', path: '/', pageSettings: { ...defaultSettings }, elements: DEFAULT_INITIAL_ELEMENTS },
      { id: 'page_about', name: 'About Studio', path: '/about', pageSettings: { ...defaultSettings, backgroundColor: '#FAF8F5' }, elements: [] },
      { id: 'page_pricing', name: 'Pricing & Plans', path: '/pricing', pageSettings: { ...defaultSettings }, elements: [] },
      { id: 'page_contact', name: 'Contact', path: '/contact', pageSettings: { ...defaultSettings }, elements: [] }
    ];
    set({
      projectName: 'My Next-Gen Homepage',
      pages: freshPages,
      activePageId: 'page_home',
      pageSettings: defaultSettings,
      elements: DEFAULT_INITIAL_ELEMENTS,
      selectedElementIds: []
    });
    get().saveToStorage();
  },

  // Load imported JSON project
  loadProjectData: (projectData) => {
    get().pushHistory();
    set({
      projectName: projectData.projectName || 'Imported Project',
      pageSettings: projectData.pageSettings || get().pageSettings,
      elements: Array.isArray(projectData.elements) ? projectData.elements : [],
      selectedElementIds: []
    });
    get().saveToStorage();
  },

  // Clipboard
  clipboard: [],
  copySelected: () => {
    const selected = get().elements.filter(e => get().selectedElementIds.includes(e.id));
    if (selected.length > 0) {
      set({ clipboard: JSON.parse(JSON.stringify(selected)) });
    }
  },
  pasteClipboard: () => {
    const { clipboard } = get();
    if (!clipboard || !clipboard.length) return;
    get().pushHistory();
    set(state => {
      const clones = [];
      const newSelected = [];
      clipboard.forEach(el => {
        const cloneId = `el_${el.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const cloned = {
          ...JSON.parse(JSON.stringify(el)),
          id: cloneId,
          name: `${el.name} (Copy)`,
          x: el.x + 30,
          y: el.y + 30
        };
        clones.push(cloned);
        newSelected.push(cloneId);
      });
      return {
        elements: [...state.elements, ...clones],
        selectedElementIds: newSelected
      };
    });
    get().saveToStorage();
  },

  // Undo / Redo History
  history: [],
  future: [],
  pushHistory: () => {
    const currentSnapshot = {
      elements: JSON.parse(JSON.stringify(get().elements)),
      pageSettings: JSON.parse(JSON.stringify(get().pageSettings))
    };
    set(state => ({
      history: [...state.history.slice(-MAX_HISTORY), currentSnapshot],
      future: []
    }));
  },

  undo: () => {
    const { history, elements, pageSettings, future } = get();
    if (!history.length) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    set({
      history: newHistory,
      future: [{ elements: JSON.parse(JSON.stringify(elements)), pageSettings: JSON.parse(JSON.stringify(pageSettings)) }, ...future],
      elements: previous.elements,
      pageSettings: previous.pageSettings,
      selectedElementIds: []
    });
    get().saveToStorage();
  },

  redo: () => {
    const { history, elements, pageSettings, future } = get();
    if (!future.length) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      history: [...history, { elements: JSON.parse(JSON.stringify(elements)), pageSettings: JSON.parse(JSON.stringify(pageSettings)) }],
      future: newFuture,
      elements: next.elements,
      pageSettings: next.pageSettings,
      selectedElementIds: []
    });
    get().saveToStorage();
  },

  // Save to LocalStorage
  saveToStorage: () => {
    try {
      if (typeof localStorage === 'undefined') return;
      const state = get();
      const updatedPages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: state.elements, pageSettings: state.pageSettings } : p
      );
      const payload = {
        projectName: state.projectName,
        pages: updatedPages,
        activePageId: state.activePageId,
        pageSettings: state.pageSettings,
        elements: state.elements
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore storage errors in test or restricted environments
    }
  }
}));
