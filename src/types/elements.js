// Definitions, color tokens and default properties for LayoutForge in Light Mode

export const THEME_COLORS = {
  primary: '#2563EB',
  secondary: '#4D4D4D',
  tertiary: '#E6E6E6',
  neutral: '#FFFFFF',
  surface: '#FFFFFF',
  onSurface: '#000000',
  error: '#D92D20',
  border: '#E6E6E6',
  muted: '#F5F5F5',
  accentSoft: '#EAF1FF'
};

export const TYPOGRAPHY_PRESETS = [
  { id: 'headline-display', name: 'Headline Display (56px)', fontFamily: 'Rethink Sans', fontSize: 56, fontWeight: '400', lineHeight: 1.08, letterSpacing: -1.96 },
  { id: 'headline-lg', name: 'Headline LG (41px)', fontFamily: 'Rethink Sans', fontSize: 41, fontWeight: '400', lineHeight: 1.2, letterSpacing: 0 },
  { id: 'headline-md', name: 'Headline MD (30px)', fontFamily: 'Rethink Sans', fontSize: 30, fontWeight: '400', lineHeight: 1.15, letterSpacing: 0 },
  { id: 'headline-sm', name: 'Headline SM (22px)', fontFamily: 'Rethink Sans', fontSize: 22, fontWeight: '400', lineHeight: 1.18, letterSpacing: 0 },
  { id: 'body-lg', name: 'Body LG (16.2px)', fontFamily: 'Rethink Sans', fontSize: 16.2, fontWeight: '400', lineHeight: 1.62, letterSpacing: 0 },
  { id: 'body-md', name: 'Body MD (14.4px)', fontFamily: 'Rethink Sans', fontSize: 14.4, fontWeight: '400', lineHeight: 1.53, letterSpacing: 0 },
  { id: 'body-sm', name: 'Body SM (12.6px)', fontFamily: 'Rethink Sans', fontSize: 12.6, fontWeight: '400', lineHeight: 1.43, letterSpacing: 0 },
  { id: 'label-lg', name: 'Label LG (14.4px)', fontFamily: 'Rethink Sans', fontSize: 14.4, fontWeight: '400', lineHeight: 1.39, letterSpacing: 0 },
  { id: 'label-md', name: 'Label MD (12px)', fontFamily: 'Rethink Sans', fontSize: 12, fontWeight: '400', lineHeight: 1.33, letterSpacing: 0 },
  { id: 'label-sm', name: 'Label SM (10.8px)', fontFamily: 'Rethink Sans', fontSize: 10.8, fontWeight: '400', lineHeight: 1.3, letterSpacing: 0 },
  { id: 'mono-sm', name: 'Mono SM (16px Doto)', fontFamily: 'Doto', fontSize: 16, fontWeight: '400', lineHeight: 1, letterSpacing: 0.64 }
];

export const GOOGLE_FONTS_LIST = [
  'Rethink Sans',
  'Doto',
  'Inter',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Space Grotesk'
];

export const COMPONENT_CATEGORIES = [
  { id: 'typography', name: 'Typography' },
  { id: 'layout', name: 'Structure & Layout' },
  { id: 'ui', name: 'UI Elements' },
  { id: 'form', name: 'Form Inputs' },
  { id: 'media', name: 'Media & Visuals' },
];

export const COMPONENT_CATALOG = [
  // Typography
  {
    type: 'heading',
    name: 'Heading',
    category: 'typography',
    icon: 'Heading',
    description: 'Headline with Rethink Sans typography',
    defaultWidth: 600,
    defaultHeight: 64,
    defaultContent: {
      text: 'Build Extraordinary Homepages Faster',
      tag: 'h1'
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 41,
      fontWeight: '400',
      color: THEME_COLORS.onSurface,
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 0,
      backgroundColor: 'transparent',
      borderRadius: 0,
      padding: { top: 4, right: 8, bottom: 4, left: 8 }
    }
  },
  {
    type: 'text',
    name: 'Text Paragraph',
    category: 'typography',
    icon: 'Type',
    description: 'Body copy in secondary gray',
    defaultWidth: 540,
    defaultHeight: 72,
    defaultContent: {
      text: 'Visually assemble production-ready web interfaces with intelligent responsive flex clustering and zero external dependencies.'
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 16.2,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      textAlign: 'center',
      lineHeight: 1.62,
      backgroundColor: 'transparent',
      padding: { top: 4, right: 8, bottom: 4, left: 8 }
    }
  },
  {
    type: 'label',
    name: 'Label',
    category: 'typography',
    icon: 'Tag',
    description: 'Uppercase label in primary blue',
    defaultWidth: 200,
    defaultHeight: 32,
    defaultContent: {
      text: 'NEW RELEASE v2.4'
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 12,
      fontWeight: '400',
      color: THEME_COLORS.primary,
      textAlign: 'center',
      letterSpacing: 1.2,
      backgroundColor: 'transparent',
      padding: { top: 4, right: 6, bottom: 4, left: 6 }
    }
  },
  {
    type: 'list',
    name: 'Feature List',
    category: 'typography',
    icon: 'ListChecks',
    description: 'Bullet, checkmark, or numbered feature list',
    defaultWidth: 380,
    defaultHeight: 180,
    defaultContent: {
      listType: 'check',
      items: [
        'Intelligent responsive flex clustering',
        'Production-ready HTML5 & CSS3 export',
        'Zero external CSS framework dependencies',
        'High-precision pixel snapping & guides'
      ]
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.secondary,
      lineHeight: 1.6,
      textAlign: 'left',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      padding: { top: 8, right: 8, bottom: 8, left: 8 }
    }
  },

  // Structure & Layout
  {
    type: 'container',
    name: 'Container / Section',
    category: 'layout',
    icon: 'BoxSelect',
    description: 'Dropzone grouping container for nested items',
    defaultWidth: 1200,
    defaultHeight: 320,
    isContainer: true,
    defaultContent: {},
    defaultStyles: {
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 16,
      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
      padding: { top: 24, right: 24, bottom: 24, left: 24 }
    }
  },
  {
    type: 'card',
    name: 'Card Box',
    category: 'layout',
    icon: 'CreditCard',
    description: 'Interactive surface card with subtle border',
    defaultWidth: 360,
    defaultHeight: 240,
    isContainer: true,
    defaultContent: {},
    defaultStyles: {
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 16,
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.06)',
      padding: { top: 20, right: 20, bottom: 20, left: 20 }
    }
  },
  {
    type: 'navbar',
    name: 'Navbar Header',
    category: 'layout',
    icon: 'PanelTop',
    description: 'Top navigation bar with logo, links, avatar and actions',
    defaultWidth: 1200,
    defaultHeight: 70,
    defaultContent: {
      brandText: 'LayoutForge',
      brandTextColor: '',
      brandTag: 'PRO',
      showLogoImage: true,
      logoUrl: '',
      logoHeight: 28,
      logoShape: 'rounded',
      links: [
        { label: 'Features', url: '#features' },
        { label: 'Templates', url: '#templates' },
        { label: 'Pricing', url: '#pricing' },
        { label: 'Docs', url: '#docs' }
      ],
      linksAlignment: 'center',
      showSearch: false,
      searchPlaceholder: 'Search components...',
      showCta: true,
      ctaText: 'Get Started',
      ctaUrl: '#',
      ctaVariant: 'primary',
      showAvatar: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      avatarName: 'Alex Morgan',
      avatarShape: 'circle',
      avatarSize: 32,
      showStatusDot: true
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: { top: 12, right: 24, bottom: 12, left: 24 }
    }
  },
  {
    type: 'footer',
    name: 'Footer Block',
    category: 'layout',
    icon: 'PanelBottom',
    description: 'Page footer with columns and copyright',
    defaultWidth: 1200,
    defaultHeight: 140,
    defaultContent: {
      copyright: '© 2026 LayoutForge Technologies Inc. All rights reserved.',
      links: ['Privacy Policy', 'Terms of Service', 'Status', 'Twitter']
    },
    defaultStyles: {
      backgroundColor: THEME_COLORS.muted,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 12,
      padding: { top: 24, right: 24, bottom: 24, left: 24 }
    }
  },
  {
    type: 'divider',
    name: 'Divider Line',
    category: 'layout',
    icon: 'Minus',
    description: 'Horizontal separator line',
    defaultWidth: 800,
    defaultHeight: 16,
    defaultContent: {},
    defaultStyles: {
      backgroundColor: 'transparent',
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderStyle: 'solid',
      padding: { top: 6, right: 0, bottom: 6, left: 0 }
    }
  },

  // UI Elements
  {
    type: 'button',
    name: 'Button',
    category: 'ui',
    icon: 'MousePointerClick',
    description: 'Primary action button in #2563EB',
    defaultWidth: 160,
    defaultHeight: 48,
    defaultContent: {
      text: 'Start Free Trial',
      url: '#'
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      fontWeight: '400',
      color: THEME_COLORS.neutral,
      textAlign: 'center',
      backgroundColor: THEME_COLORS.primary,
      borderColor: THEME_COLORS.primary,
      borderWidth: 1,
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
      padding: { top: 12, right: 20, bottom: 12, left: 20 }
    }
  },
  {
    type: 'badge',
    name: 'Chip / Badge',
    category: 'ui',
    icon: 'Sparkle',
    description: 'Soft accent badge (#EAF1FF with #2563EB)',
    defaultWidth: 140,
    defaultHeight: 32,
    defaultContent: {
      text: '✦ AI Powered'
    },
    defaultStyles: {
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
    }
  },
  {
    type: 'icon',
    name: 'Icon Graphic',
    category: 'ui',
    icon: 'Smile',
    description: 'SVG Vector icon from Lucide',
    defaultWidth: 64,
    defaultHeight: 64,
    defaultContent: {
      iconName: 'Zap'
    },
    defaultStyles: {
      color: THEME_COLORS.primary,
      backgroundColor: THEME_COLORS.accentSoft,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: { top: 16, right: 16, bottom: 16, left: 16 }
    }
  },

  // Form Inputs
  {
    type: 'input',
    name: 'Input Field',
    category: 'form',
    icon: 'FormInput',
    description: 'Single-line text input field',
    defaultWidth: 320,
    defaultHeight: 48,
    defaultContent: {
      label: 'Email address',
      placeholder: 'you@domain.com'
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      color: THEME_COLORS.onSurface,
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: { top: 12, right: 16, bottom: 12, left: 16 }
    }
  },
  {
    type: 'textarea',
    name: 'Textarea Field',
    category: 'form',
    icon: 'AlignLeft',
    description: 'Multi-line textarea input',
    defaultWidth: 360,
    defaultHeight: 110,
    defaultContent: {
      label: 'Project Details',
      placeholder: 'Describe your layout requirements...'
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      color: THEME_COLORS.onSurface,
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: { top: 12, right: 16, bottom: 12, left: 16 }
    }
  },
  {
    type: 'select',
    name: 'Select Dropdown',
    category: 'form',
    icon: 'ChevronDown',
    description: 'Dropdown options selector',
    defaultWidth: 260,
    defaultHeight: 48,
    defaultContent: {
      label: 'Plan tier',
      options: ['Starter Free', 'Pro Freelancer', 'Enterprise Suite']
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      color: THEME_COLORS.onSurface,
      backgroundColor: THEME_COLORS.surface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: { top: 12, right: 16, bottom: 12, left: 16 }
    }
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    category: 'form',
    icon: 'CheckSquare',
    description: 'Toggleable checkbox with label',
    defaultWidth: 240,
    defaultHeight: 36,
    defaultContent: {
      label: 'Subscribe to product newsletter',
      checked: true
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      color: THEME_COLORS.secondary,
      backgroundColor: 'transparent',
      padding: { top: 6, right: 8, bottom: 6, left: 8 }
    }
  },
  {
    type: 'radiogroup',
    name: 'Radio Group',
    category: 'form',
    icon: 'CircleDot',
    description: 'Radio option selector',
    defaultWidth: 260,
    defaultHeight: 80,
    defaultContent: {
      groupName: 'billing',
      options: ['Monthly Billing ($19/mo)', 'Annual Billing (Save 20%)'],
      selectedIndex: 0
    },
    defaultStyles: {
      fontFamily: 'Rethink Sans',
      fontSize: 14.4,
      color: THEME_COLORS.secondary,
      backgroundColor: 'transparent',
      padding: { top: 6, right: 8, bottom: 6, left: 8 }
    }
  },

  // Media
  {
    type: 'image',
    name: 'Image Showcase',
    category: 'media',
    icon: 'Image',
    description: 'Responsive image with cover/contain',
    defaultWidth: 480,
    defaultHeight: 320,
    defaultContent: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern 3D Abstract Architecture'
    },
    defaultStyles: {
      backgroundColor: THEME_COLORS.muted,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  },
  {
    type: 'video',
    name: 'Video Embed',
    category: 'media',
    icon: 'PlayCircle',
    description: 'Responsive YouTube or MP4 video container',
    defaultWidth: 520,
    defaultHeight: 292,
    defaultContent: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    defaultStyles: {
      backgroundColor: THEME_COLORS.onSurface,
      borderColor: THEME_COLORS.border,
      borderWidth: 1,
      borderRadius: 14,
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    }
  }
];

export const ANIMATION_EFFECTS = [
  { id: 'none', label: 'None' },
  { id: 'fade-in', label: 'Fade In' },
  { id: 'slide-up', label: 'Slide Up' },
  { id: 'slide-down', label: 'Slide Down' },
  { id: 'slide-left', label: 'Slide Left' },
  { id: 'slide-right', label: 'Slide Right' },
  { id: 'zoom-in', label: 'Zoom In' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'shake', label: 'Shake' },
  { id: 'flip', label: '3D Flip' },
  { id: 'rotate', label: 'Rotate In' }
];

export const BOX_SHADOW_PRESETS = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'subtle', label: 'Subtle', value: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)' },
  { id: 'medium', label: 'Card Lift', value: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)' },
  { id: 'bold', label: 'Bold Deep', value: '0 12px 24px -4px rgba(0, 0, 0, 0.12)' },
  { id: 'glow-blue', label: 'Blue Glow', value: '0 0 20px rgba(37, 99, 235, 0.3)' }
];

export const createNewElement = (type, x = null, y = 100, parentId = null) => {
  const catalogItem = COMPONENT_CATALOG.find(item => item.type === type) || COMPONENT_CATALOG[0];
  const uniqueId = `el_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const defaultCenteredX = Math.max(20, Math.round((1440 - catalogItem.defaultWidth) / 2));
  const finalX = x !== null && x !== undefined ? Math.round(x) : defaultCenteredX;

  return {
    id: uniqueId,
    type: catalogItem.type,
    name: `${catalogItem.name} ${Math.floor(Math.random() * 900) + 100}`,
    parentId: parentId,
    locked: false,
    hidden: false,
    x: finalX,
    y: Math.round(y),
    width: catalogItem.defaultWidth,
    height: catalogItem.defaultHeight,
    rotation: 0,
    zIndex: 10,
    content: JSON.parse(JSON.stringify(catalogItem.defaultContent || {})),
    styles: JSON.parse(JSON.stringify(catalogItem.defaultStyles || {})),
    animation: {
      effect: 'none',
      trigger: 'load',
      duration: 0.6,
      delay: 0,
      easing: 'ease-out',
      iterationCount: '1'
    },
    responsive: {
      hideOnDesktop: false,
      hideOnTablet: false,
      hideOnMobile: false,
      tabletOverrides: {},
      mobileOverrides: {}
    }
  };
};
