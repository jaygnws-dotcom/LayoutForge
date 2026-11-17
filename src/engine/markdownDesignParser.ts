import { VibeTheme } from '../types/vibes';

export interface ParsedDesignResult {
  theme: VibeTheme;
  rawTokens: {
    colors: Record<string, string>;
    palette: string[];
    headingFont: string;
    bodyFont: string;
    borderRadius: number;
    buttonRadius: number;
  };
  summary: {
    colorsFound: number;
    fontsFound: string[];
    name: string;
  };
}

/**
 * Dynamically loads a Google Font by injecting a stylesheet link into document head.
 */
export function injectGoogleFont(fontFamily: string) {
  if (typeof document === 'undefined' || !fontFamily) return;
  const cleanFont = fontFamily.trim().replace(/['"]/g, '');
  if (['system-ui', 'sans-serif', 'serif', 'monospace', 'inherit'].includes(cleanFont.toLowerCase())) {
    return;
  }

  const linkId = `gfont-${cleanFont.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFont)}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

/**
 * Parses markdown content (such as design.md, styleguide.md, theme tokens)
 * and extracts color palettes, typography, and styling tokens.
 */
export function parseMarkdownDesign(content: string, fileName = 'design.md'): ParsedDesignResult {
  const lines = content.split('\n');

  // Extract all hex colors
  const hexRegex = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  const rawHexes = Array.from(content.match(hexRegex) || []);
  // Deduplicate and normalize
  const uniqueHexes: string[] = [];
  rawHexes.forEach(h => {
    const norm = h.toUpperCase();
    if (!uniqueHexes.includes(norm)) uniqueHexes.push(norm);
  });

  const tokenColors: Record<string, string> = {};

  // Parse lines for semantic color declarations
  lines.forEach(line => {
    const l = line.trim();
    if (!l) return;

    // Matches: - Primary: #6366F1 or --primary: #6366F1 or "primary": "#6366F1" or | Primary | #6366F1 |
    const match = l.match(/(?:[-*|`\s]*)(primary|brand|main|accent|background|bg|surface|card|container|paper|text|foreground|secondary[-_\s]?text|muted|subtext|border|stroke|divider|highlight)(?:[:|=|\s|`|"]+)(#(?:[0-9a-fA-F]{3,8})|rgba?\([^)]+\))/i);
    if (match) {
      const rawKey = match[1].toLowerCase().replace(/[-_\s]+/g, '');
      const val = match[2];

      if (rawKey.includes('primary') || rawKey.includes('brand') || rawKey === 'main') {
        tokenColors.primary = val;
      } else if (rawKey.includes('background') || rawKey === 'bg') {
        tokenColors.background = val;
      } else if (rawKey.includes('surface') || rawKey.includes('card') || rawKey.includes('container') || rawKey === 'paper') {
        tokenColors.surface = val;
      } else if (rawKey.includes('secondarytext') || rawKey.includes('muted') || rawKey.includes('subtext')) {
        tokenColors.secondaryText = val;
      } else if (rawKey.includes('text') || rawKey.includes('foreground')) {
        tokenColors.text = val;
      } else if (rawKey.includes('border') || rawKey.includes('stroke') || rawKey === 'divider') {
        tokenColors.border = val;
      } else if (rawKey.includes('accent') || rawKey.includes('highlight')) {
        tokenColors.accent = val;
      }
    }
  });

  // Extract Typography
  let headingFont = '';
  let bodyFont = '';

  const popularFonts = [
    'Playfair Display', 'Space Grotesk', 'Plus Jakarta Sans', 'Outfit',
    'Montserrat', 'Syne', 'Inter', 'Poppins', 'Rethink Sans', 'DM Sans',
    'Cinzel', 'Fraunces', 'Cabinet Grotesk', 'Roboto', 'Epilogue',
    'Clash Display', 'Geist', 'Manrope', 'Sora', 'Lora', 'Merriweather'
  ];

  lines.forEach(line => {
    const l = line.toLowerCase();
    if (l.includes('heading') && (l.includes('font') || l.includes('family'))) {
      const match = line.match(/[:|=]\s*['"]?([^,'"\n;]+)/);
      if (match && match[1]) headingFont = match[1].trim();
    }
    if ((l.includes('body') || l.includes('text') || l.includes('primary')) && (l.includes('font') || l.includes('family'))) {
      const match = line.match(/[:|=]\s*['"]?([^,'"\n;]+)/);
      if (match && match[1]) bodyFont = match[1].trim();
    }
  });

  // If not explicitly keyed, search for mentions of popular fonts in markdown
  if (!headingFont || !bodyFont) {
    const mentionedFonts = popularFonts.filter(f =>
      new RegExp(`\\b${f}\\b`, 'i').test(content)
    );
    if (mentionedFonts.length >= 2) {
      if (!headingFont) headingFont = mentionedFonts[0];
      if (!bodyFont) bodyFont = mentionedFonts[1];
    } else if (mentionedFonts.length === 1) {
      if (!headingFont) headingFont = mentionedFonts[0];
      if (!bodyFont) bodyFont = 'Rethink Sans';
    }
  }

  // Fallbacks
  if (!headingFont) headingFont = 'Playfair Display';
  if (!bodyFont) bodyFont = 'Rethink Sans';

  // Inject discovered fonts into the document head
  injectGoogleFont(headingFont);
  injectGoogleFont(bodyFont);

  // Extract Radius
  let borderRadius = 12;
  let buttonRadius = 8;
  const radiusMatch = content.match(/(?:border[-_\s]?radius|radius)[:|=|\s]+(\d+)(?:px)?/i);
  if (radiusMatch) {
    borderRadius = Math.min(48, Math.max(0, parseInt(radiusMatch[1], 10)));
    buttonRadius = Math.min(9999, Math.max(0, Math.round(borderRadius * 0.75)));
  }
  const btnRadiusMatch = content.match(/button[-_\s]?(?:border[-_\s]?)?radius[:|=|\s]+(\d+)(?:px)?/i);
  if (btnRadiusMatch) {
    buttonRadius = Math.min(9999, Math.max(0, parseInt(btnRadiusMatch[1], 10)));
  }

  // Determine dark or light mode based on background color or mention
  const isDarkKeyword = content.toLowerCase().includes('dark mode') || content.toLowerCase().includes('dark theme');
  const primaryColor = tokenColors.primary || uniqueHexes[0] || '#6366F1';
  let backgroundColor = tokenColors.background;
  if (!backgroundColor) {
    if (isDarkKeyword) {
      backgroundColor = uniqueHexes.find(h => isDarkColor(h)) || '#0B0C10';
    } else {
      backgroundColor = uniqueHexes.find(h => !isDarkColor(h)) || '#FAFAFA';
    }
  }

  const isDark = isDarkColor(backgroundColor);
  const surfaceColor = tokenColors.surface || (isDark ? '#151821' : '#FFFFFF');
  const textColor = tokenColors.text || (isDark ? '#F8FAFC' : '#111827');
  const secondaryTextColor = tokenColors.secondaryText || (isDark ? '#94A3B8' : '#6B7280');
  const borderColor = tokenColors.border || (isDark ? '#2D3343' : '#E5E7EB');
  const accentColor = tokenColors.accent || primaryColor;

  const cleanName = fileName
    .replace(/\.(md|markdown|txt)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const theme: VibeTheme = {
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName || 'Custom Markdown Design',
    tagline: `Extracted from ${fileName}: ${headingFont} + ${bodyFont}`,
    category: isDark ? 'dark' : 'modern',
    colors: {
      primary: primaryColor,
      background: backgroundColor,
      surface: surfaceColor,
      text: textColor,
      secondaryText: secondaryTextColor,
      border: borderColor,
      accent: accentColor,
      accentSoft: isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.1)'
    },
    typography: {
      headingFont,
      bodyFont
    },
    styles: {
      borderRadius,
      buttonRadius,
      boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.06)',
      borderWidth: 1
    }
  };

  return {
    theme,
    rawTokens: {
      colors: tokenColors,
      palette: uniqueHexes,
      headingFont,
      bodyFont,
      borderRadius,
      buttonRadius
    },
    summary: {
      colorsFound: uniqueHexes.length,
      fontsFound: [headingFont, bodyFont].filter(Boolean),
      name: cleanName
    }
  };
}

function isDarkColor(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false;
  let clean = hex.slice(1);
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 120;
  }
  return false;
}
