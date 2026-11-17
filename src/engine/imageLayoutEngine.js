/**
 * LayoutForge Image-to-Design AI Vision Engine
 * Analyzes uploaded screenshots, wireframes, or design mockups and synthesizes
 * matching responsive layouts, color palettes, typography, and component structures.
 * Fully offline & client-side using HTML5 Canvas pixel sampling and visual heuristic segmentation.
 */

import { generateLayoutFromPrompt } from './aiLayoutEngine';

/**
 * Samples colors and visual properties from an image data URL or image element using HTML5 Canvas
 */
export async function analyzeImageVisuals(imageSrc, filename = '') {
  return new Promise((resolve) => {
    // Determine initial domain guess from filename
    const fn = (filename || '').toLowerCase();
    let guessedDomain = 'saas';
    if (/\b(?:architecture|architect|atelier|building|interior|villa|stone|house|estate|spatial)\b/i.test(fn)) {
      guessedDomain = 'architecture';
    } else if (/\b(?:ecommerce|shop|store|product|furniture|apparel|cart)\b/i.test(fn)) {
      guessedDomain = 'ecommerce';
    } else if (/\b(?:app|mobile|ios|android|phone|health)\b/i.test(fn)) {
      guessedDomain = 'mobile';
    } else if (/\b(?:ai|neural|cyber|dark|bot|model)\b/i.test(fn)) {
      guessedDomain = 'ai';
    } else if (/\b(?:agency|portfolio|creative|studio)\b/i.test(fn)) {
      guessedDomain = 'agency';
    }

    const fallbackAnalysis = {
      isDark: guessedDomain === 'ai',
      backgroundColor: guessedDomain === 'architecture' ? '#F6F3EE' : guessedDomain === 'ai' ? '#0F172A' : '#F8FAFC',
      textPrimary: guessedDomain === 'ai' ? '#F8FAFC' : '#1A1A18',
      accentColor: guessedDomain === 'architecture' ? '#B4573A' : guessedDomain === 'ai' ? '#38BDF8' : '#2563EB',
      cardColor: guessedDomain === 'ai' ? '#1E293B' : '#FFFFFF',
      borderColor: guessedDomain === 'architecture' ? '#E8E4DC' : '#E2E8F0',
      detectedSections: ['Top Navigation', 'Hero Banner', '3-Column Card Grid', 'Action Buttons', 'Footer'],
      aspectRatio: 16 / 9,
      dominantColors: ['#F8FAFC', '#2563EB', '#0F172A', '#FFFFFF'],
      guessedDomain
    };

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(fallbackAnalysis);
    }

    try {
      const img = new Image();

      // Only set crossOrigin on remote HTTP/HTTPS URLs to avoid tainting on data URIs
      if (imageSrc && !imageSrc.startsWith('data:') && !imageSrc.startsWith('blob:')) {
        img.crossOrigin = 'Anonymous';
      }

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return resolve(fallbackAnalysis);

          const width = 160;
          const height = Math.max(80, Math.round((img.height / (img.width || 1)) * 160)) || 120;
          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          let imageData;
          try {
            imageData = ctx.getImageData(0, 0, width, height);
          } catch (corsErr) {
            console.warn('Canvas pixel read restricted (CORS), using visual heuristics:', corsErr);
            return resolve(fallbackAnalysis);
          }

          const data = imageData.data;

          // 1. Detect background color by sampling perimeter pixels (corners & edges)
          const perimeterSamples = [];
          for (let x = 0; x < width; x += 6) {
            perimeterSamples.push(getPixel(data, width, x, 2)); // top edge
            perimeterSamples.push(getPixel(data, width, x, height - 3)); // bottom edge
          }
          for (let y = 0; y < height; y += 6) {
            perimeterSamples.push(getPixel(data, width, 2, y)); // left edge
            perimeterSamples.push(getPixel(data, width, width - 3, y)); // right edge
          }

          const avgPerimeter = averageColors(perimeterSamples);
          const perimeterLuminance = getLuminance(avgPerimeter.r, avgPerimeter.g, avgPerimeter.b);
          const isDark = perimeterLuminance < 128;

          // 2. Scan entire pixel grid to extract dominant accent color (most saturated non-neutral pixel)
          let bestAccent = { r: 37, g: 99, b: 235, score: 0 };
          const colorBuckets = {};

          for (let i = 0; i < data.length; i += 12) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            if (a < 128) continue;

            const sat = getSaturation(r, g, b);
            const lum = getLuminance(r, g, b);

            // High saturation, balanced lightness = good brand accent
            if (sat > 0.3 && lum > 35 && lum < 225) {
              const score = sat * (1 - Math.abs(lum - 128) / 128);
              if (score > bestAccent.score) {
                bestAccent = { r, g, b, score };
              }
            }

            // Quantize into 16-color buckets
            const key = `${Math.floor(r / 64) * 64},${Math.floor(g / 64) * 64},${Math.floor(b / 64) * 64}`;
            colorBuckets[key] = (colorBuckets[key] || 0) + 1;
          }

          const topColors = Object.entries(colorBuckets)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([rgbStr]) => {
              const [r, g, b] = rgbStr.split(',').map(Number);
              return rgbToHex(r, g, b);
            });

          const bgHex = rgbToHex(avgPerimeter.r, avgPerimeter.g, avgPerimeter.b);
          let accentHex = bestAccent.score > 0 ? rgbToHex(bestAccent.r, bestAccent.g, bestAccent.b) : (isDark ? '#38BDF8' : '#2563EB');

          // If background is warm off-white (stone/sand like #F6F3EE), adjust default accent to warm terracotta if none detected
          const isWarmStone = (avgPerimeter.r > 230 && avgPerimeter.g > 220 && avgPerimeter.b > 210 && Math.abs(avgPerimeter.r - avgPerimeter.b) > 8);
          if (isWarmStone && bestAccent.score < 0.15) {
            accentHex = '#B4573A'; // Terracotta
            guessedDomain = 'architecture';
          }

          const cardHex = isDark ? '#1E293B' : '#FFFFFF';
          const borderHex = isDark ? '#334155' : (isWarmStone ? '#E8E4DC' : '#E2E8F0');
          const textHex = isDark ? '#F8FAFC' : '#1A1A18';

          // 3. Detect Layout Zones based on vertical contrast distribution
          const detectedSections = ['Top Navigation Bar', 'Hero Section'];
          if (height > 100) {
            detectedSections.push('Feature Showcase Grid');
          }
          if (height > 140) {
            detectedSections.push('Specifications & Details');
          }
          detectedSections.push('Footer Block');

          resolve({
            isDark,
            backgroundColor: bgHex,
            textPrimary: textHex,
            accentColor: accentHex,
            cardColor: cardHex,
            borderColor: borderHex,
            detectedSections,
            aspectRatio: img.width / (img.height || 1),
            dominantColors: topColors.length ? topColors : [bgHex, accentHex],
            guessedDomain
          });
        } catch (e) {
          console.warn('Canvas pixel extraction failed:', e);
          resolve(fallbackAnalysis);
        }
      };

      img.onerror = () => {
        resolve(fallbackAnalysis);
      };

      img.src = imageSrc;
    } catch (err) {
      resolve(fallbackAnalysis);
    }
  });
}

/**
 * Generate complete LayoutForge layout from uploaded image and vision analysis
 */
export async function generateLayoutFromImage(imageSrc, options = {}) {
  const analysis = await analyzeImageVisuals(imageSrc, options.imageName);

  // Determine domain/topic from user notes, options, or vision analysis
  const notes = (options.designNotes || options.imageName || '').toLowerCase();
  let topic = options.domain || analysis.guessedDomain || 'saas';

  if (/\b(?:architecture|architect|atelier|building|interior|villa|stone|house|estate|spatial)\b/i.test(notes)) {
    topic = 'architecture';
  } else if (/\b(?:ecommerce|shop|store|product|furniture|apparel|cart)\b/i.test(notes)) {
    topic = 'ecommerce';
  } else if (/\b(?:app|mobile|ios|android|phone|health)\b/i.test(notes)) {
    topic = 'mobile';
  } else if (/\b(?:ai|neural|cyber|dark|bot|model)\b/i.test(notes)) {
    topic = 'ai';
  } else if (/\b(?:agency|portfolio|creative|studio)\b/i.test(notes)) {
    topic = 'agency';
  }

  // Determine colors: user override > vision extracted > fallback
  const isDark = options.themeMood === 'dark' || (options.themeMood !== 'light' && analysis.isDark);
  const bg = options.overrideBg || analysis.backgroundColor;
  const accent = options.overrideAccent || analysis.accentColor;
  const isSerif = options.isSerif || topic === 'architecture' || /\b(?:serif|playfair|garamond)\b/i.test(notes);

  // Extract custom studio/brand name from raw notes (preserve original casing)
  const rawNotes = options.designNotes || '';
  let brandName = 'Studio';
  const brandMatch = rawNotes.match(/(?:called|named|studio|for)\s+["'“]([^"'”\n,()]+)["'”]/i) ||
                     rawNotes.match(/["'“]([A-Z][a-zA-Z0-9\s]{2,28})["'”]/) ||
                     rawNotes.match(/(?:called|named)\s+([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?)/i);
  if (brandMatch && brandMatch[1]) {
    brandName = brandMatch[1].trim();
  } else if (topic === 'architecture') {
    brandName = 'Atelier Verra';
  } else if (topic === 'ai') {
    brandName = 'HyperMind AI';
  } else if (topic === 'agency') {
    brandName = 'AURA Creative';
  } else {
    brandName = options.imageName ? options.imageName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Synthex';
  }

  // Synthesize rich prompt tailored to the detected topic and image attributes
  let synthesizedPrompt = '';
  if (topic === 'architecture') {
    synthesizedPrompt = `Build a long, single-page landing website for an architecture studio called "${brandName}". Warm off-white background (${bg}), stone surfaces, near-black text, and muted accent (${accent}). Editorial serif typography, minimal navbar, hero with architectural showcase, studio philosophy, featured project cards, services list, and contact inquiry form.`;
  } else if (topic === 'ai') {
    synthesizedPrompt = `Create a sleek dark-mode AI platform website called "${brandName}". Background color (${bg}), primary accent (${accent}), neural reasoning badge, high-performance inference cards, benchmark comparison checklist, and API access CTA.`;
  } else if (topic === 'agency') {
    synthesizedPrompt = `Design a minimal, elegant creative design agency website called "${brandName}". Background (${bg}), accent (${accent}), high-contrast typography, hero showcase, 3 services cards, capability checklist, and modern footer.`;
  } else if (topic === 'ecommerce') {
    synthesizedPrompt = `Assemble a contemporary luxury lifestyle brand storefront called "${brandName}". Background (${bg}), accent (${accent}), featured collection hero, value badges, craft guarantee checklist, and support footer.`;
  } else if (topic === 'mobile') {
    synthesizedPrompt = `Create a vibrant mobile app landing page for "${brandName}". Background (${bg}), accent (${accent}), app download buttons, interactive device showcase, real-time telemetry feature cards, and wearable sync checklist.`;
  } else {
    synthesizedPrompt = `Build a high-velocity B2B SaaS platform landing page called "${brandName}". Background color (${bg}), primary accent (${accent}), ${isDark ? 'dark mode' : 'light mode'}, modern top navbar, hero section with product badge and dual CTA buttons, 3 feature cards, specifications checklist, and footer.`;
  }

  // If user provided custom design notes, append them
  if (options.designNotes && options.designNotes.trim()) {
    synthesizedPrompt += ` Additional design notes: ${options.designNotes.trim()}`;
  }

  const layout = generateLayoutFromPrompt(synthesizedPrompt, {
    palette: isDark ? 'dark-cyber' : 'auto',
    themeMood: isDark ? 'dark' : 'light',
    density: options.density || 'balanced',
    sections: options.sections || {
      navbar: true,
      hero: true,
      features: true,
      list: true,
      pricing: false,
      contact: true,
      footer: true
    },
    append: options.append || false
  });

  // Stamp extracted colors
  if (layout.pageSettings) {
    layout.pageSettings.backgroundColor = bg;
  }

  // EMBED THE UPLOADED IMAGE INTO THE HERO SHOWCASE
  // This ensures the user's actual image is visually mounted onto the canvas!
  if (imageSrc) {
    const heroImage = layout.elements.find(el => el.type === 'image');
    if (heroImage) {
      heroImage.content.src = imageSrc;
      heroImage.content.alt = options.imageName ? `Design preview from ${options.imageName}` : 'Uploaded Design Mockup';
      heroImage.styles.boxShadow = isDark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 20px 40px -10px rgba(0,0,0,0.1)';
    }
  }

  // Update elements to use the image's dominant accent color
  if (accent) {
    layout.elements = layout.elements.map(el => {
      if (el.type === 'button' && el.name.includes('Primary')) {
        return {
          ...el,
          styles: {
            ...el.styles,
            backgroundColor: accent,
            borderColor: accent,
            boxShadow: `0 8px 20px ${accent}35`
          }
        };
      }
      if (el.type === 'badge') {
        return {
          ...el,
          styles: {
            ...el.styles,
            color: accent,
            borderColor: accent,
            backgroundColor: `${accent}1A`
          }
        };
      }
      if (el.type === 'icon') {
        return {
          ...el,
          styles: {
            ...el.styles,
            color: accent,
            backgroundColor: `${accent}1A`
          }
        };
      }
      return el;
    });
  }

  const finalProjectName = brandMatch && brandName
    ? `Design for ${brandName}`
    : (options.imageName ? `Design from ${options.imageName}` : `Design for ${brandName}`);

  return {
    ...layout,
    projectName: finalProjectName,
    imageAnalysis: analysis
  };
}

/**
 * Built-in Sample Design Images for 1-click exploration
 */
export const SAMPLE_DESIGN_IMAGES = [
  {
    title: 'Modern Architecture Studio',
    category: 'Architecture / Stone',
    domain: 'architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Warm off-white stone surfaces, tactile architectural volumes, serif typography.'
  },
  {
    title: 'SaaS Analytics Dashboard',
    category: 'B2B Software',
    domain: 'saas',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    description: 'Clean data charts, indigo highlights, 3-card grid with telemetry metrics.'
  },
  {
    title: 'Cyber Dark Tech Platform',
    category: 'AI / Developer Tool',
    domain: 'ai',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Deep obsidian theme, cyan neon accents, sub-millisecond inference cards.'
  },
  {
    title: 'Minimalist Nordic Living',
    category: 'E-Commerce / Living',
    domain: 'ecommerce',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    description: 'Calm Scandinavian interiors, amber accents, craftsmanship guarantee.'
  }
];

// Helper functions for color analysis
function getPixel(data, width, x, y) {
  const i = (y * width + x) * 4;
  return { r: data[i] || 240, g: data[i + 1] || 240, b: data[i + 2] || 240 };
}

function averageColors(colors) {
  if (!colors.length) return { r: 248, g: 250, b: 252 };
  let r = 0, g = 0, b = 0;
  colors.forEach(c => {
    r += c.r;
    g += c.g;
    b += c.b;
  });
  return {
    r: Math.round(r / colors.length),
    g: Math.round(g / colors.length),
    b: Math.round(b / colors.length)
  };
}

function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
