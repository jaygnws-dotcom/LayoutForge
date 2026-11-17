export interface VibeTheme {
  id: string;
  name: string;
  tagline: string;
  category: 'minimal' | 'modern' | 'editorial' | 'dark' | 'bold' | 'glass';
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    secondaryText: string;
    border: string;
    accent: string;
    accentSoft: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  styles: {
    borderRadius: number;
    buttonRadius: number;
    boxShadow: string;
    borderWidth: number;
  };
}

export const STITCH_VIBES: VibeTheme[] = [
  // 1. Atelier Studio
  {
    id: 'atelier_studio',
    name: 'Atelier Studio',
    tagline: 'Warm architectural stone, near-black editorial typography & terracotta accent',
    category: 'editorial',
    colors: {
      primary: '#B4573A', // Terracotta
      background: '#F6F3EE', // Warm Off-White / Sand
      surface: '#FFFFFF',
      text: '#1A1A18', // Near black
      secondaryText: '#66635D',
      border: '#E6E1D8',
      accent: '#B4573A',
      accentSoft: 'rgba(180, 87, 58, 0.12)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 10,
      buttonRadius: 8,
      boxShadow: '0 4px 20px -2px rgba(26, 26, 24, 0.06)',
      borderWidth: 1
    }
  },

  // 2. Linear Obsidian
  {
    id: 'linear_dark',
    name: 'Linear Obsidian',
    tagline: 'High-performance dark mode with electric indigo & subtle slate gradients',
    category: 'dark',
    colors: {
      primary: '#6366F1', // Indigo
      background: '#0B0C10',
      surface: '#151821',
      text: '#F8FAFC',
      secondaryText: '#94A3B8',
      border: '#272C3D',
      accent: '#818CF8',
      accentSoft: 'rgba(99, 102, 241, 0.15)'
    },
    typography: {
      headingFont: 'Rethink Sans',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 14,
      buttonRadius: 10,
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      borderWidth: 1
    }
  },

  // 3. Nordic Botanical
  {
    id: 'nordic_botanical',
    name: 'Nordic Botanical',
    tagline: 'Organic serenity with deep olive, soft sage mist & warm sand surfaces',
    category: 'minimal',
    colors: {
      primary: '#2D3E31', // Deep Olive
      background: '#F3F5F3',
      surface: '#FFFFFF',
      text: '#1B261D',
      secondaryText: '#59695C',
      border: '#DCE2DC',
      accent: '#8A9A86',
      accentSoft: 'rgba(45, 62, 49, 0.1)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 16,
      buttonRadius: 12,
      boxShadow: '0 4px 18px rgba(45, 62, 49, 0.05)',
      borderWidth: 1
    }
  },

  // 4. Vercel Modern
  {
    id: 'vercel_clean',
    name: 'Vercel Modern',
    tagline: 'Crisp monochrome engineering aesthetic with electric blue accents',
    category: 'modern',
    colors: {
      primary: '#000000',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#09090B',
      secondaryText: '#71717A',
      border: '#E4E4E7',
      accent: '#0070F3',
      accentSoft: 'rgba(0, 112, 243, 0.1)'
    },
    typography: {
      headingFont: 'Rethink Sans',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 10,
      buttonRadius: 8,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      borderWidth: 1
    }
  },

  // 5. Neo Brutalist
  {
    id: 'neo_brutalist',
    name: 'Neo Brutalist',
    tagline: 'High contrast black outlines, amber canvas & punchy high-energy cards',
    category: 'bold',
    colors: {
      primary: '#000000',
      background: '#FFFDF5',
      surface: '#FFFFFF',
      text: '#000000',
      secondaryText: '#374151',
      border: '#000000',
      accent: '#FF5722',
      accentSoft: '#FEF3C7'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 4,
      buttonRadius: 4,
      boxShadow: '4px 4px 0px #000000',
      borderWidth: 2
    }
  },

  // 6. Minimal Gazette
  {
    id: 'editorial_burgundy',
    name: 'Minimal Gazette',
    tagline: 'Classic editorial publication with royal burgundy, alabaster paper & serif headings',
    category: 'editorial',
    colors: {
      primary: '#7F1D1D', // Deep burgundy
      background: '#FAF9F6',
      surface: '#FFFFFF',
      text: '#1C1917',
      secondaryText: '#57534E',
      border: '#E7E5E4',
      accent: '#D97706',
      accentSoft: 'rgba(127, 29, 29, 0.08)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 6,
      buttonRadius: 6,
      boxShadow: '0 2px 12px rgba(28, 25, 23, 0.04)',
      borderWidth: 1
    }
  },

  // 7. Cyberpunk Neon (NEW)
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon',
    tagline: 'Electric cyan and neon pink glows on a deep space void navy canvas',
    category: 'dark',
    colors: {
      primary: '#06B6D4', // Cyan
      background: '#050811',
      surface: '#0D1322',
      text: '#F1F5F9',
      secondaryText: '#94A3B8',
      border: '#1E293B',
      accent: '#EC4899', // Hot Pink
      accentSoft: 'rgba(236, 72, 153, 0.15)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 12,
      buttonRadius: 8,
      boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15)',
      borderWidth: 1
    }
  },

  // 8. Kyoto Zen (NEW)
  {
    id: 'kyoto_zen',
    name: 'Kyoto Zen & Basalt',
    tagline: 'Wabi-sabi tranquility with washi paper surfaces, sumi ink & aged bamboo wood',
    category: 'minimal',
    colors: {
      primary: '#2C3E2D', // Deep Bamboo
      background: '#F7F6F2', // Washi rice paper
      surface: '#FFFFFF',
      text: '#1E1F1E', // Sumi ink
      secondaryText: '#696E67',
      border: '#E3E1D8',
      accent: '#C2A676', // Bamboo Gold
      accentSoft: 'rgba(194, 166, 118, 0.15)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 6,
      buttonRadius: 6,
      boxShadow: '0 2px 14px rgba(44, 62, 45, 0.04)',
      borderWidth: 1
    }
  },

  // 9. Swiss Bauhaus (NEW)
  {
    id: 'swiss_bauhaus',
    name: 'Swiss Bauhaus Grid',
    tagline: 'International typographic discipline with crimson accents & objective precision',
    category: 'bold',
    colors: {
      primary: '#E11D48', // Bauhaus Crimson
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      secondaryText: '#475569',
      border: '#CBD5E1',
      accent: '#2563EB', // Cobalt
      accentSoft: 'rgba(225, 29, 72, 0.1)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 2,
      buttonRadius: 2,
      boxShadow: '2px 2px 0px #CBD5E1',
      borderWidth: 1.5
    }
  },

  // 10. Sunset Mirage (NEW)
  {
    id: 'sunset_mirage',
    name: 'Sunset Mirage',
    tagline: 'Californian desert modernism with terracotta coral, sunlit peach & amber stone',
    category: 'editorial',
    colors: {
      primary: '#EA580C', // Coral Terracotta
      background: '#FFF7ED', // Sunlit Peach
      surface: '#FFFFFF',
      text: '#431407', // Deep Earth
      secondaryText: '#78350F',
      border: '#FED7AA',
      accent: '#D97706',
      accentSoft: 'rgba(234, 88, 12, 0.12)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 16,
      buttonRadius: 10,
      boxShadow: '0 6px 24px rgba(234, 88, 12, 0.08)',
      borderWidth: 1
    }
  },

  // 11. Midnight Velvet & Champagne (NEW)
  {
    id: 'midnight_champagne',
    name: 'Midnight Champagne',
    tagline: 'Ultra-luxury couture elegance with smoked onyx, champagne gold & fine serif titles',
    category: 'dark',
    colors: {
      primary: '#D4AF37', // Champagne Gold
      background: '#0C0A09', // Midnight Onyx
      surface: '#1C1917',
      text: '#FAFAF9',
      secondaryText: '#A8A29E',
      border: '#292524',
      accent: '#EAB308',
      accentSoft: 'rgba(212, 175, 55, 0.15)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 8,
      buttonRadius: 6,
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
      borderWidth: 1
    }
  },

  // 12. Fintech Cobalt & Ice (NEW)
  {
    id: 'fintech_cobalt',
    name: 'Fintech Cobalt & Ice',
    tagline: 'Institutional capital trust with arctic ice blue tints & deep cobalt accents',
    category: 'modern',
    colors: {
      primary: '#0284C7', // Cobalt
      background: '#F0F9FF', // Ice Blue
      surface: '#FFFFFF',
      text: '#0C4A6E',
      secondaryText: '#0369A1',
      border: '#BAE6FD',
      accent: '#0D9488',
      accentSoft: 'rgba(2, 132, 199, 0.12)'
    },
    typography: {
      headingFont: 'Rethink Sans',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 12,
      buttonRadius: 8,
      boxShadow: '0 4px 16px rgba(2, 132, 199, 0.06)',
      borderWidth: 1
    }
  },

  // 13. Solarized Ochre & Earth (NEW)
  {
    id: 'solarized_ochre',
    name: 'Tuscan Ochre & Clay',
    tagline: 'Tactile artisan ceramics, sun-baked Tuscan ochre & warm terracotta clay',
    category: 'editorial',
    colors: {
      primary: '#B45309', // Raw Ochre
      background: '#FEFCE8', // Cream Clay
      surface: '#FFFFFF',
      text: '#292524',
      secondaryText: '#78716C',
      border: '#FEF08A',
      accent: '#9A3412', // Burnt Sienna
      accentSoft: 'rgba(180, 83, 9, 0.12)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 14,
      buttonRadius: 10,
      boxShadow: '0 4px 18px rgba(180, 83, 9, 0.06)',
      borderWidth: 1
    }
  },

  // 14. Matrix Emerald Terminal (NEW)
  {
    id: 'matrix_emerald',
    name: 'Matrix Emerald Terminal',
    tagline: 'Phosphor green telemetry, dark terminal console & high-density developer clarity',
    category: 'dark',
    colors: {
      primary: '#10B981', // Emerald
      background: '#030712', // Void Black
      surface: '#0F172A',
      text: '#F9FAFB',
      secondaryText: '#6EE7B7',
      border: '#064E3B',
      accent: '#34D399',
      accentSoft: 'rgba(16, 185, 129, 0.15)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 6,
      buttonRadius: 4,
      boxShadow: '0 6px 24px rgba(16, 185, 129, 0.12)',
      borderWidth: 1
    }
  },

  // 15. Lavender Mist & Iris (NEW)
  {
    id: 'lavender_wellness',
    name: 'Lavender Mist & Iris',
    tagline: 'Restorative mindfulness with lavender dawn haze & organic pill curves',
    category: 'minimal',
    colors: {
      primary: '#7C3AED', // Royal Iris
      background: '#FAF5FF', // Lavender Dawn
      surface: '#FFFFFF',
      text: '#3B0764',
      secondaryText: '#6B21A8',
      border: '#E9D5FF',
      accent: '#A855F7',
      accentSoft: 'rgba(124, 58, 237, 0.1)'
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 20,
      buttonRadius: 14,
      boxShadow: '0 6px 20px rgba(124, 58, 237, 0.06)',
      borderWidth: 1
    }
  },

  // 16. Pop Memphis & Electric Sunset (NEW)
  {
    id: 'pop_memphis',
    name: 'Pop Memphis & Violet',
    tagline: 'Playful high-energy creativity with bubblegum accents, violet pops & joyful geometry',
    category: 'bold',
    colors: {
      primary: '#8B5CF6', // Electric Purple
      background: '#FDF4FF', // Bubblegum haze
      surface: '#FFFFFF',
      text: '#18181B',
      secondaryText: '#52525B',
      border: '#F0ABFC',
      accent: '#F43F5E', // Watermelon
      accentSoft: 'rgba(244, 63, 94, 0.12)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 18,
      buttonRadius: 12,
      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.12)',
      borderWidth: 1.5
    }
  },

  // 17. Glass Effect Design (Glassmorphism & Frosted Acrylic)
  {
    id: 'glass_effect',
    name: 'Glass Effect Design',
    tagline: 'Translucent acrylic glass effect with frosted blur, refractive borders & prism cyan glow',
    category: 'modern',
    colors: {
      primary: '#38BDF8', // Prism Cyan
      background: '#0B0F19', // Deep Oceanic Obsidian
      surface: 'rgba(255, 255, 255, 0.08)', // Translucent Frosted Glass
      text: '#F8FAFC',
      secondaryText: '#94A3B8',
      border: 'rgba(255, 255, 255, 0.2)', // Refractive Glass Border
      accent: '#818CF8', // Electric Iris
      accentSoft: 'rgba(56, 189, 248, 0.16)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 20,
      buttonRadius: 9999, // Pill Glass Button
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
      borderWidth: 1
    }
  },

  // 18. Cosmic Aurora Gradient (Gradient Colors Design)
  {
    id: 'cosmic_gradient',
    name: 'Cosmic Aurora Gradient',
    tagline: 'High-chroma vibrant spectrum with neon fuchsia, electric violet & radiant gradient glow',
    category: 'bold',
    colors: {
      primary: '#EC4899', // Neon Fuchsia
      background: '#0D0B18', // Cosmic Midnight Indigo
      surface: '#18142C', // Deep Violet Surface
      text: '#FFFFFF',
      secondaryText: '#C084FC', // Soft Lavender
      border: '#6B21A8', // Neon Purple Border
      accent: '#06B6D4', // Vibrant Cyan Accent
      accentSoft: 'rgba(236, 72, 153, 0.2)'
    },
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Rethink Sans'
    },
    styles: {
      borderRadius: 24,
      buttonRadius: 14,
      boxShadow: '0 12px 35px -8px rgba(236, 72, 153, 0.35), 0 0 24px rgba(107, 33, 168, 0.25)',
      borderWidth: 1.5
    }
  }
];
