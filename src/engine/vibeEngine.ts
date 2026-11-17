import { VibeTheme } from '../types/vibes';
import { CanvasElement, PageSettings } from '../types';

/**
 * Applies a Stitch Vibe theme token set globally across all canvas elements and page settings.
 */
export function applyVibeTheme(
  vibe: VibeTheme,
  elements: CanvasElement[],
  pageSettings: PageSettings
): { elements: CanvasElement[]; pageSettings: PageSettings } {
  const updatedPageSettings: PageSettings = {
    ...pageSettings,
    backgroundColor: vibe.colors.background,
    backgroundGradient: null,
    backgroundImage: null,
    textColor: vibe.colors.text,
    primaryColor: vibe.colors.primary,
    defaultFont: vibe.typography.bodyFont,
    fontFamily: vibe.typography.bodyFont,
    activeVibeId: vibe.id
  };

  const isDarkVibe =
    vibe.colors.background?.startsWith('#0') ||
    vibe.colors.background?.startsWith('#1') ||
    vibe.colors.background === '#18181B' ||
    vibe.category === 'dark';
  const primaryButtonTextColor = isDarkVibe ? '#0B0C10' : '#FFFFFF';

  const updatedElements = elements.map(el => {
    const s = el.styles || {};
    const newStyles: Record<string, unknown> = { ...s };

    if (el.type === 'card' || el.type === 'container') {
      newStyles.backgroundColor = vibe.colors.surface;
      newStyles.backgroundGradient = null;
      newStyles.backgroundImage = null;
      newStyles.borderColor = vibe.colors.border;
      newStyles.borderWidth = vibe.styles.borderWidth;
      newStyles.borderRadius = vibe.styles.borderRadius;
      newStyles.boxShadow = vibe.styles.boxShadow;
      if (vibe.id === 'glass_effect' || vibe.id === 'frosted_glass' || vibe.name.toLowerCase().includes('glass')) {
        newStyles.backdropFilter = 'blur(16px)';
        newStyles.WebkitBackdropFilter = 'blur(16px)';
      }
    } else if (el.type === 'heading') {
      newStyles.fontFamily = vibe.typography.headingFont;
      newStyles.color = vibe.colors.text;
    } else if (el.type === 'text') {
      newStyles.fontFamily = vibe.typography.bodyFont;
      newStyles.color = vibe.colors.secondaryText;
    } else if (el.type === 'label') {
      newStyles.fontFamily = vibe.typography.bodyFont;
      newStyles.color = vibe.colors.text;
    } else if (el.type === 'badge') {
      newStyles.fontFamily = vibe.typography.bodyFont;
      newStyles.backgroundColor = vibe.colors.accentSoft;
      newStyles.borderColor = vibe.colors.primary;
      newStyles.color = vibe.colors.primary;
    } else if (el.type === 'button') {
      newStyles.fontFamily = vibe.typography.bodyFont;
      newStyles.borderRadius = vibe.styles.buttonRadius;
      newStyles.backgroundGradient = null;
      const borderWidthVal = typeof s.borderWidth === 'number' ? s.borderWidth : 0;
      const isOutline = s.backgroundColor === 'transparent' || s.backgroundColor === '#FFFFFF' || borderWidthVal > 0;
      const textVal = el.content?.text?.toLowerCase() || '';

      if (isOutline && (textVal.includes('secondary') || textVal.includes('learn') || textVal.includes('view'))) {
        newStyles.backgroundColor = vibe.colors.surface;
        newStyles.borderColor = vibe.colors.border;
        newStyles.borderWidth = 1;
        newStyles.color = vibe.colors.text;
      } else {
        if (vibe.id === 'cosmic_gradient') {
          newStyles.backgroundColor = '#EC4899';
          newStyles.backgroundGradient = 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)';
          newStyles.borderColor = 'transparent';
          newStyles.color = '#FFFFFF';
        } else {
          newStyles.backgroundColor = vibe.colors.primary;
          newStyles.borderColor = 'transparent';
          newStyles.color = primaryButtonTextColor;
        }
      }
    } else if (el.type === 'navbar') {
      newStyles.backgroundColor = vibe.colors.surface;
      newStyles.backgroundGradient = null;
      newStyles.backgroundImage = null;
      newStyles.borderColor = vibe.colors.border;
      newStyles.borderRadius = vibe.styles.borderRadius;
      newStyles.boxShadow = vibe.styles.boxShadow;
    } else if (el.type === 'footer') {
      newStyles.backgroundColor = vibe.colors.surface;
      newStyles.backgroundGradient = null;
      newStyles.backgroundImage = null;
      newStyles.borderColor = vibe.colors.border;
    }

    return {
      ...el,
      styles: newStyles as unknown as typeof el.styles
    };
  });

  return {
    elements: updatedElements,
    pageSettings: updatedPageSettings
  };
}
