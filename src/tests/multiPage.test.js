import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/useProjectStore';

describe('Multi-Page Architecture (Feature 5)', () => {
  beforeEach(() => {
    // Reset state before tests
    useProjectStore.getState().resetTemplate();
  });

  it('initializes with default pages and active home page', () => {
    const { pages, activePageId } = useProjectStore.getState();
    expect(pages.length).toBeGreaterThanOrEqual(1);
    expect(activePageId).toBe('page_home');
    const homePage = pages.find(p => p.id === 'page_home');
    expect(homePage).toBeDefined();
    expect(homePage.name).toBe('Home');
  });

  it('allows adding a new page and auto-switches to it', () => {
    const { addPage } = useProjectStore.getState();
    addPage('Services', '/services');

    const state = useProjectStore.getState();
    expect(state.pages.some(p => p.name === 'Services')).toBe(true);
    const servicesPage = state.pages.find(p => p.name === 'Services');
    expect(state.activePageId).toBe(servicesPage.id);
  });

  it('preserves elements per page when switching between pages', () => {
    const { switchPage, addElement, pages } = useProjectStore.getState();
    const homeId = 'page_home';
    const aboutPage = pages.find(p => p.id === 'page_about') || pages[1];

    // Add an element to Home
    addElement('button', 100, 100);
    const homeElementsCount = useProjectStore.getState().elements.length;

    // Switch to About
    switchPage(aboutPage.id);
    expect(useProjectStore.getState().activePageId).toBe(aboutPage.id);

    // Switch back to Home
    switchPage(homeId);
    expect(useProjectStore.getState().activePageId).toBe(homeId);
    expect(useProjectStore.getState().elements.length).toBe(homeElementsCount);
  });

  it('supports duplicating and renaming pages', () => {
    const { duplicatePage, renamePage, pages, activePageId } = useProjectStore.getState();
    const initialCount = pages.length;

    duplicatePage(activePageId);
    const stateAfterDup = useProjectStore.getState();
    expect(stateAfterDup.pages.length).toBe(initialCount + 1);

    const dupPage = stateAfterDup.pages[stateAfterDup.pages.length - 1];
    expect(dupPage.name).toContain('(Copy)');

    renamePage(dupPage.id, 'Our Team', '/team');
    const stateAfterRename = useProjectStore.getState();
    const renamed = stateAfterRename.pages.find(p => p.id === dupPage.id);
    expect(renamed.name).toBe('Our Team');
    expect(renamed.path).toBe('/team');
  });
});
