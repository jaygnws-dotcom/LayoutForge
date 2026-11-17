/**
 * LayoutForge AI Layout Engine
 * Generates coordinated, responsive, pixel-perfect visual layouts from natural language prompts.
 * Fully offline & deterministic heuristic intelligence with zero external API dependencies.
 */

import { THEME_COLORS } from '../types/elements';

// Topic archetypes with rich domain terminology and customized assets
const TOPIC_ARCHETYPES = {
  architecture: {
    brand: 'Atelier Verra',
    tag: 'Architectural Practice • Est. 2008',
    badge: '✦ SELECTED ARCHITECTURAL WORKS 2008–2026',
    title: 'Spaces shaped by light, stone, and time.',
    subtitle: 'We compose enduring spatial environments where monolithic volume meets nuanced natural light. Rooted in contextual materiality, civic dignity, and tactile precision.',
    ctaPrimary: 'Start a project',
    ctaSecondary: 'Explore Selected Works',
    links: [
      { label: 'Projects', url: '#projects' },
      { label: 'Studio', url: '#studio' },
      { label: 'Services', url: '#services' },
      { label: 'Journal', url: '#journal' },
      { label: 'Contact', url: '#contact' }
    ],
    features: [
      {
        icon: 'Layout',
        title: 'Villa Mirador — Mallorca',
        desc: 'Cantilevered rammed earth and charred cedar coastal residence. 680 m² (Completed 2024).'
      },
      {
        icon: 'Sparkles',
        title: 'Nordic Light Pavilion — Oslo',
        desc: 'Honed travertine and low-iron acoustic glass contemporary exhibition gallery. 1,240 m² (Completed 2023).'
      },
      {
        icon: 'Layers',
        title: 'Kyoto Stone Sanctuary — Japan',
        desc: 'Black basalt massing and reclaimed hinoki timber mountain retreat. 420 m² (Completed 2025).'
      }
    ],
    checklist: [
      'Contextual materiality: Rammed earth, honed stone, charred cedar',
      'Passive solar orientation & natural thermal mass engineering',
      'Bespoke joinery & custom architectural metalwork',
      'Integrated landscape choreography & native topography'
    ],
    stats: [
      { value: '120+', label: 'Built Works Worldwide' },
      { value: '18 Years', label: 'Dedicated Studio Practice' },
      { value: '14 Honors', label: 'International Design Awards' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    accentColor: '#B4573A',
    accentSoft: '#FBF2EE',
    pageBg: '#F6F3EE',
    textPrimary: '#1A1A18',
    textSecondary: '#6B6861',
    cardBg: '#FFFFFF',
    cardBorder: '#E8E4DC',
    headlineFont: 'Playfair Display, Georgia, serif'
  },

  saas: {
    brand: 'Synthex Cloud',
    tag: 'Cloud Suite v3.0',
    badge: '✦ INTRODUCING SYNTHEX 3.0',
    title: 'The Intelligent Workspace for High-Velocity Teams',
    subtitle: 'Automate complex operational workflows, orchestrate real-time cloud data, and accelerate engineering velocity with autonomous infrastructure.',
    ctaPrimary: 'Start 14-Day Free Trial',
    ctaSecondary: 'Schedule Demo',
    links: [
      { label: 'Platform', url: '#platform' },
      { label: 'Solutions', url: '#solutions' },
      { label: 'Integrations', url: '#integrations' },
      { label: 'Pricing', url: '#pricing' },
      { label: 'Docs', url: '#docs' }
    ],
    features: [
      {
        icon: 'Zap',
        title: 'Instant Workflow Engine',
        desc: 'Execute thousands of distributed workflows per minute with guaranteed millisecond latency and auto-recovery.'
      },
      {
        icon: 'Shield',
        title: 'SOC-2 Type II Certified',
        desc: 'End-to-end envelope encryption, continuous security monitoring, and granular role-based access control.'
      },
      {
        icon: 'BarChart3',
        title: 'Deep Observability',
        desc: 'Interactive telemetry dashboards with automated anomaly detection and proactive bottleneck warnings.'
      }
    ],
    checklist: [
      'Zero-latency real-time state synchronization',
      'Native REST and GraphQL SDK integrations',
      'Automated disaster failover and continuous backups',
      'Granular audit logging and compliance export'
    ],
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#2563EB',
    accentSoft: '#EFF6FF',
    pageBg: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    headlineFont: 'Rethink Sans, sans-serif'
  },

  ai: {
    brand: 'HyperMind AI',
    tag: 'Neural v4',
    badge: '✦ NEXT-GENERATION REASONING ENGINE',
    title: 'Deploy Production Generative AI Models with Total Certainty',
    subtitle: 'Streamline model fine-tuning, latency optimization, and safety guardrails across multi-cloud environments in seconds.',
    ctaPrimary: 'Request API Access',
    ctaSecondary: 'Read Research Paper',
    links: [
      { label: 'Models', url: '#models' },
      { label: 'Benchmarks', url: '#benchmarks' },
      { label: 'Safety', url: '#safety' },
      { label: 'API Docs', url: '#docs' },
      { label: 'Pricing', url: '#pricing' }
    ],
    features: [
      {
        icon: 'Sparkles',
        title: 'Sub-10ms Inference',
        desc: 'Optimized quantized kernels delivering ultra-fast token streaming at a fraction of standard GPU compute costs.'
      },
      {
        icon: 'Cpu',
        title: 'Self-Improving Pipelines',
        desc: 'Continuous reinforcement learning from user feedback loops without catastrophic forgetting.'
      },
      {
        icon: 'Shield',
        title: 'Deterministic Guardrails',
        desc: 'Real-time hallucination prevention, prompt injection mitigation, and automated PII redaction.'
      }
    ],
    checklist: [
      'Multi-modal LLM reasoning with code interpretation',
      'Context windows scaling up to 2M tokens',
      'Self-hosted on-premise air-gapped deployments',
      'Real-time token cost estimation and rate limit controls'
    ],
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#7C3AED',
    accentSoft: '#F5F3FF',
    pageBg: '#0F172A',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    cardBg: '#1E293B',
    cardBorder: '#334155',
    headlineFont: 'Rethink Sans, sans-serif'
  },

  agency: {
    brand: 'AURA Creative',
    tag: 'Studio',
    badge: '✦ AWARD-WINNING DESIGN PRACTICE',
    title: 'We Craft Digital Experiences That Define Category Leaders',
    subtitle: 'Partnering with visionary founders and global enterprises to engineer iconic brand identities, bespoke web experiences, and scalable design systems.',
    ctaPrimary: 'Explore Selected Work',
    ctaSecondary: 'Book Discovery Call',
    links: [
      { label: 'Work', url: '#work' },
      { label: 'Capabilities', url: '#capabilities' },
      { label: 'Philosophy', url: '#philosophy' },
      { label: 'Journal', url: '#journal' },
      { label: 'Contact', url: '#contact' }
    ],
    features: [
      {
        icon: 'Palette',
        title: 'Brand Architecture',
        desc: 'Distinctive visual identities, bespoke typography, and coherent design languages crafted for lasting impact.'
      },
      {
        icon: 'Layout',
        title: 'Digital Flagships',
        desc: 'High-performance interactive websites built with fluid physics, custom 3D web visuals, and effortless micro-interactions.'
      },
      {
        icon: 'Layers',
        title: 'Design Systems',
        desc: 'Living, accessible UI component ecosystems bridging the gap between Figma designs and production code.'
      }
    ],
    checklist: [
      'Bespoke creative direction tailored to brand DNA',
      'Interactive motion design and micro-animation systems',
      'Lighthouse 100/100 performance and WebGL optimization',
      'Comprehensive brand guideline and token packages'
    ],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0F172A',
    accentSoft: '#F1F5F9',
    pageBg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    cardBg: '#F8FAFC',
    cardBorder: '#E2E8F0',
    headlineFont: 'Rethink Sans, sans-serif'
  },

  pricing: {
    brand: 'PulseFlow',
    tag: 'Billing',
    badge: '✦ SIMPLE, TRANSPARENT PRICING',
    title: 'Predictable Pricing Designed to Scale with Your Growth',
    subtitle: 'No hidden overage fees, no hostage data. Cancel or upgrade anytime with a single click.',
    ctaPrimary: 'Get Started Today',
    ctaSecondary: 'Talk to Enterprise Sales',
    links: [
      { label: 'Pricing Plans', url: '#plans' },
      { label: 'Feature Comparison', url: '#compare' },
      { label: 'FAQ', url: '#faq' },
      { label: 'Enterprise', url: '#enterprise' }
    ],
    features: [
      {
        icon: 'CreditCard',
        title: 'Starter',
        desc: 'Essential capabilities for independent builders and early prototypes.'
      },
      {
        icon: 'Sparkles',
        title: 'Professional',
        desc: 'Our most popular plan for fast-growing businesses requiring advanced scale.'
      },
      {
        icon: 'Shield',
        title: 'Enterprise',
        desc: 'Dedicated infrastructure, custom SLAs, and white-glove onboarding.'
      }
    ],
    checklist: [
      '30-day no-questions-asked money-back guarantee',
      'All plans include 99.99% uptime guarantee',
      'Complimentary automated daily database backups',
      'Direct Slack & Discord engineer support channel'
    ],
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#059669',
    accentSoft: '#ECFDF5',
    pageBg: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    headlineFont: 'Rethink Sans, sans-serif'
  },

  contact: {
    brand: 'Nexis HQ',
    tag: 'Support',
    badge: '✦ WE ARE HERE TO HELP',
    title: "Let's Build Something Exceptional Together",
    subtitle: 'Have a project in mind, need technical support, or want to discuss enterprise licensing? Our engineering team responds within 2 hours.',
    ctaPrimary: 'Submit Inquiry',
    ctaSecondary: 'Browse Knowledge Base',
    links: [
      { label: 'Support', url: '#support' },
      { label: 'Offices', url: '#offices' },
      { label: 'Documentation', url: '#docs' },
      { label: 'Status', url: '#status' }
    ],
    features: [
      {
        icon: 'Mail',
        title: 'Direct Inquiries',
        desc: 'team@nexiscloud.io — Monitored 24/7 by on-call leads.'
      },
      {
        icon: 'Phone',
        title: 'Enterprise Hotline',
        desc: '+1 (800) 555-0199 — Priority routing for licensed customers.'
      },
      {
        icon: 'MapPin',
        title: 'Global Hubs',
        desc: 'San Francisco • London • Singapore • Tokyo'
      }
    ],
    checklist: [
      'Guaranteed initial engineer response within 120 minutes',
      'Direct Slack Connect channel for contracted teams',
      'NDA executed before detailed architecture review',
      'Bespoke proof-of-concept delivered within 5 business days'
    ],
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#2563EB',
    accentSoft: '#EFF6FF',
    pageBg: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    headlineFont: 'Rethink Sans, sans-serif'
  },

  ecommerce: {
    brand: 'LUMINA Living',
    tag: 'Collection',
    badge: '✦ NEW AUTUMN/WINTER 2026 EDIT',
    title: 'Architectural Objects Designed for Mindful Living',
    subtitle: 'Hand-cast ceramics, minimalist solid wood furnishings, and precision-engineered ambient lighting created in sustainable Scandinavian workshops.',
    ctaPrimary: 'Shop New Arrivals',
    ctaSecondary: 'View Lookbook',
    links: [
      { label: 'Furniture', url: '#furniture' },
      { label: 'Lighting', url: '#lighting' },
      { label: 'Objects', url: '#objects' },
      { label: 'Studio Story', url: '#story' },
      { label: 'Sustainability', url: '#sustainability' }
    ],
    features: [
      {
        icon: 'Truck',
        title: 'Carbon-Neutral Freight',
        desc: 'Plastic-free recyclable packaging with worldwide DHL Express climate compensation.'
      },
      {
        icon: 'Shield',
        title: '10-Year Craft Warranty',
        desc: 'Built from sustainably harvested European ash, walnut, and recycled architectural aluminum.'
      },
      {
        icon: 'RefreshCw',
        title: 'Complimentary Returns',
        desc: 'Try in your space for 45 days. Return hassle-free if it does not fit your room aesthetic.'
      }
    ],
    checklist: [
      'FSC-certified solid European hardwoods',
      'Hand-blown borosilicate glassware with heat resistance',
      'Precision matte anodized metal finishes',
      'Artisan signature certificate included with every piece'
    ],
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#D97706',
    accentSoft: '#FFFBEB',
    pageBg: '#FAFAF9',
    textPrimary: '#1C1917',
    textSecondary: '#78716C',
    cardBg: '#FFFFFF',
    cardBorder: '#E7E5E4',
    headlineFont: 'Rethink Sans, sans-serif'
  },

  mobile: {
    brand: 'Orbital Health',
    tag: 'iOS & Android',
    badge: '✦ NOW LIVE ON APP STORE',
    title: 'Your Personal Circadian & Metabolic Health Twin',
    subtitle: 'Connect continuous glucose monitors, wearable sleep trackers, and smart scales into a unified biometrics model providing real-time nutrition coaching.',
    ctaPrimary: 'Download for iOS',
    ctaSecondary: 'Get on Google Play',
    links: [
      { label: 'Features', url: '#features' },
      { label: 'Biomarkers', url: '#biomarkers' },
      { label: 'Wearables', url: '#wearables' },
      { label: 'Medical Advisory', url: '#advisory' },
      { label: 'Privacy', url: '#privacy' }
    ],
    features: [
      {
        icon: 'Heart',
        title: 'Continuous Biometrics',
        desc: 'Sync effortlessly with Apple Watch, Oura Ring, Whoop, and Dexcom CGM sensors.'
      },
      {
        icon: 'Activity',
        title: 'Real-Time Guidance',
        desc: 'Get notified of post-meal glucose spikes before energy slumps happen.'
      },
      {
        icon: 'Lock',
        title: 'HIPAA & GDPR Secure',
        desc: 'Your health data is encrypted client-side with keys owned exclusively by you.'
      }
    ],
    checklist: [
      'Instant sync with Apple HealthKit and Google Health Connect',
      'Personalized metabolic score updated every 15 minutes',
      'Weekly automated health summary report for your doctor',
      'End-to-end client-encrypted zero-knowledge storage'
    ],
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#10B981',
    accentSoft: '#ECFDF5',
    pageBg: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    headlineFont: 'Rethink Sans, sans-serif'
  }
};

/**
 * Helper to generate unique element IDs
 */
function uid(type) {
  return `el_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Detect topic, extracted brand, hex colors, typography, and mood from user prompt
 */
function analyzePrompt(promptText = '') {
  const p = promptText.toLowerCase();

  // 1. Extract brand name if explicitly requested
  let extractedBrand = null;
  const brandMatch = promptText.match(/(?:called|named|studio|firm|brand|for)\s+["'“]([^"'”\n,()]+)["'”]/i) ||
                     promptText.match(/["'“]([A-Z][a-zA-Z0-9\s]{2,28})["'”]/) ||
                     promptText.match(/(?:called|named)\s+([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?)/i);
  if (brandMatch && brandMatch[1]) {
    extractedBrand = brandMatch[1].trim();
  }

  // 2. Extract explicit hex codes from prompt if present
  let extractedBg = null;
  let extractedText = null;
  let extractedAccent = null;

  // Background color (e.g. #F6F3EE)
  const bgMatch = promptText.match(/(?:background|bg|surface|off-white)[^#\n]*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\b/i);
  if (bgMatch) extractedBg = bgMatch[1].toUpperCase();

  // Text color (e.g. #1A1A18)
  const textMatch = promptText.match(/(?:text|font|near-black)[^#\n]*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\b/i);
  if (textMatch) extractedText = textMatch[1].toUpperCase();

  // Accent color (e.g. #B4573A)
  const accentMatch = promptText.match(/(?:accent|terracotta|brand|highlight|primary)[^#\n]*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\b/i);
  if (accentMatch) extractedAccent = accentMatch[1].toUpperCase();

  // 3. Typography preferences
  const isSerif = /\b(?:serif|cormorant|playfair|garamond)\b/i.test(promptText);

  // 4. Detect Mood / Color Scheme safely
  const isExplicitLightOnly = /\blight\s*mode\s*(?:only)?\b/i.test(promptText) || /\bwarm off-white\b/i.test(promptText);
  let isDark = false;
  if (!isExplicitLightOnly) {
    isDark = /\b(?:dark|night|cyber|black)\b/i.test(promptText) && !/\b(?:no|avoid|without)\s+dark\b/i.test(promptText);
  }

  // 5. Positive Keyword Helper to avoid negated words (e.g. "strictly avoid ... AI")
  const hasPositiveKeyword = (regex) => {
    let match;
    const globalRegex = new RegExp(regex.source, 'gi');
    while ((match = globalRegex.exec(promptText)) !== null) {
      const start = Math.max(0, match.index - 40);
      const preceding = promptText.substring(start, match.index).toLowerCase();
      if (!/\b(?:no|avoid|without|never|not|strictly avoid|stop)\b/i.test(preceding)) {
        return true;
      }
    }
    return false;
  };

  // 6. Detect Topic without false positives
  let topic = 'saas';
  if (hasPositiveKeyword(/\b(?:architecture|architect|atelier|building|interior|urban planning|landscape|construction|spatial)\b/i)) {
    topic = 'architecture';
  } else if (hasPositiveKeyword(/\b(?:ai\b|machine learning|neural|gpt|llm|deep learning)\b/i)) {
    topic = 'ai';
  } else if (hasPositiveKeyword(/\b(?:agency|portfolio|creative|designer|freelance)\b/i)) {
    topic = 'agency';
  } else if (hasPositiveKeyword(/\b(?:price|pricing|subscription|plans|tier)\b/i)) {
    topic = 'pricing';
  } else if (hasPositiveKeyword(/\b(?:contact|form|inquiry|support|reach out)\b/i)) {
    topic = 'contact';
  } else if (hasPositiveKeyword(/\b(?:shop|store|ecommerce|e-commerce|product|cart|apparel)\b/i)) {
    topic = 'ecommerce';
  } else if (hasPositiveKeyword(/\b(?:app|mobile|ios|android|biometrics|fitness)\b/i)) {
    topic = 'mobile';
  }

  // Detect specific structural components requested
  const isLongPage = /\blong\b/i.test(p) || /\bsingle-page\b/i.test(p) || /\bsections\b/i.test(p);
  const wantsNavbar = !p.includes('no navbar') && !p.includes('without navbar');
  const wantsHero = !p.includes('no hero');
  const wantsFeatures = p.includes('feature') || p.includes('card') || p.includes('service') || p.includes('benefit') || p.includes('project') || !p.includes('only');
  const wantsList = p.includes('list') || p.includes('check') || p.includes('bullet') || p.includes('feature list') || p.includes('services') || topic === 'pricing' || topic === 'saas' || topic === 'architecture';
  const wantsPricing = (p.includes('price') || p.includes('pricing') || p.includes('plan') || topic === 'pricing') && !isLongPage;
  const wantsContact = p.includes('contact') || p.includes('form') || p.includes('inquiry') || topic === 'contact' || topic === 'architecture' || isLongPage;
  const wantsFooter = !p.includes('no footer') && !p.includes('without footer');

  // Architecture-specific section flags
  const hasStats = p.includes('stats') || p.includes('numbers') || p.includes('awards') || p.includes('120+') || p.includes('18 years') || topic === 'architecture';
  const hasPhilosophy = p.includes('philosophy') || p.includes('intro') || p.includes('manifesto') || topic === 'architecture';
  const hasServicesList = p.includes('services') || p.includes('disciplines') || topic === 'architecture';

  return {
    topic,
    extractedBrand,
    extractedBg,
    extractedText,
    extractedAccent,
    isSerif,
    isDark,
    isLongPage,
    wantsNavbar,
    wantsHero,
    wantsFeatures,
    wantsList,
    wantsPricing,
    wantsContact,
    wantsFooter,
    hasStats,
    hasPhilosophy,
    hasServicesList
  };
}

/**
 * Palette Presets
 */
export const PALETTE_PRESETS = [
  { id: 'auto', name: 'Auto (Prompt-Derived)', primary: '#2563EB', isDark: false },
  { id: 'terracotta-warm', name: 'Terracotta & Stone (#F6F3EE)', primary: '#B4573A', isDark: false, bg: '#F6F3EE', card: '#FFFFFF', border: '#E8E4DC' },
  { id: 'dark-cyber', name: 'Obsidian Cyber (Dark)', primary: '#38BDF8', isDark: true, bg: '#0B0F19', card: '#151E32', border: '#243049' },
  { id: 'silicon-indigo', name: 'Silicon Indigo (Light)', primary: '#4F46E5', isDark: false, bg: '#F8FAFC', card: '#FFFFFF', border: '#E2E8F0' },
  { id: 'emerald-tech', name: 'Emerald Precision', primary: '#059669', isDark: false, bg: '#F0FDF4', card: '#FFFFFF', border: '#DCFCE7' },
  { id: 'modern-neutral', name: 'Vercel Monochrome', primary: '#0F172A', isDark: false, bg: '#FFFFFF', card: '#F8FAFC', border: '#E2E8F0' },
  { id: 'sunset-warm', name: 'Sunset Studio', primary: '#EA580C', isDark: false, bg: '#FFF7ED', card: '#FFFFFF', border: '#FFEDD5' }
];

/**
 * Prompt Polish / Enhancer helper
 */
export function enhancePrompt(rawPrompt = '', archetypeKey = 'saas') {
  const p = rawPrompt.trim();
  const archetypesMap = {
    architecture: 'Build a long, single-page landing website for an architecture studio called "Atelier Verra". Warm off-white background (#F6F3EE), stone surfaces, near-black text (#1A1A18), and muted terracotta accent (#B4573A). Serif typography, minimal navbar, hero with ken-burns image and stats (120+ projects, 18 years, 14 awards), studio philosophy, featured project cards, services list, and contact inquiry form.',
    saas: 'Build a high-velocity B2B SaaS platform landing page with a modern top navbar, hero section featuring product badge and dual CTA buttons, 3 architecture feature cards with Lucide icons, comprehensive capability checklist, and modern footer.',
    ai: 'Create a next-generation AI model platform website in dark cyber styling with navigation header, hero section with neural reasoning badge, high-performance inference cards, benchmark comparison checklist, and API access CTA.',
    agency: 'Design an award-winning digital creative agency showcase with editorial typography, curated work portfolio grid, creative capabilities checklist, and contact inquiry footer.',
    pricing: 'Assemble a high-converting pricing page with navbar, 3-tier subscription matrix for Starter, Pro, and Enterprise, feature check lists, and annual billing discount.',
    contact: 'Create an enterprise customer inbound hub with top navigation, office presence overview, full interactive contact form with inputs, category selector, textarea, and submission button.',
    ecommerce: 'Assemble a contemporary luxury lifestyle brand storefront with navbar, featured design collection hero, craftsmanship guarantee checklist, and support footer.',
    mobile: 'Design a mobile health and biometrics application landing page with app download buttons, interactive device showcase, real-time telemetry feature cards, and wearable sync checklist.'
  };

  if (!p) return archetypesMap[archetypeKey] || archetypesMap.architecture;

  if (p.length < 40) {
    return `Create a production-grade layout for: "${p}". Include a sleek top navbar, bold hero section with value proposition badge and dual action buttons, 3 feature cards with vector icons, a comprehensive specifications checklist, and a responsive footer.`;
  }

  return p;
}

/**
 * Main Layout Generator
 */
export function generateLayoutFromPrompt(promptText, options = {}) {
  const analysis = analyzePrompt(promptText);
  const data = TOPIC_ARCHETYPES[analysis.topic] || TOPIC_ARCHETYPES.saas;

  // Extract or resolve brand name
  const brandName = analysis.extractedBrand || data.brand;

  // Determine section inclusions (options override analysis)
  const wantsNavbar = options.sections?.navbar !== undefined ? options.sections.navbar : analysis.wantsNavbar;
  const wantsHero = options.sections?.hero !== undefined ? options.sections.hero : analysis.wantsHero;
  const wantsFeatures = options.sections?.features !== undefined ? options.sections.features : analysis.wantsFeatures;
  const wantsList = options.sections?.list !== undefined ? options.sections.list : analysis.wantsList;
  const wantsPricing = options.sections?.pricing !== undefined ? options.sections.pricing : analysis.wantsPricing;
  const wantsContact = options.sections?.contact !== undefined ? options.sections.contact : analysis.wantsContact;
  const wantsFooter = options.sections?.footer !== undefined ? options.sections.footer : analysis.wantsFooter;

  // Apply custom theme or palette overrides
  const selectedPalette = PALETTE_PRESETS.find(p => p.id === options.palette);
  const themeMood = options.themeMood || (selectedPalette ? (selectedPalette.isDark ? 'dark' : 'light') : (analysis.isDark ? 'dark' : 'light'));
  const isDarkMode = themeMood === 'dark' || (themeMood === 'auto' && analysis.isDark) || (selectedPalette?.isDark);

  // Palette definition
  let pageBg = isDarkMode ? '#0F172A' : (data.pageBg || '#F8FAFC');
  let cardBg = isDarkMode ? '#1E293B' : (data.cardBg || '#FFFFFF');
  let cardBorder = isDarkMode ? '#334155' : (data.cardBorder || '#E2E8F0');
  let textPrimary = isDarkMode ? '#F8FAFC' : (data.textPrimary || '#0F172A');
  let textSecondary = isDarkMode ? '#94A3B8' : (data.textSecondary || '#64748B');
  let primaryColor = isDarkMode && data.accentColor === '#0F172A' ? '#38BDF8' : data.accentColor;
  let accentSoft = isDarkMode ? 'rgba(56, 189, 248, 0.15)' : (data.accentSoft || '#EFF6FF');

  // If prompt explicitly provided hex codes, honor them with priority
  if (analysis.extractedBg) pageBg = analysis.extractedBg;
  if (analysis.extractedText) textPrimary = analysis.extractedText;
  if (analysis.extractedAccent) {
    primaryColor = analysis.extractedAccent;
    accentSoft = `${analysis.extractedAccent}1A`;
  }

  // Selected palette override
  if (selectedPalette && selectedPalette.id !== 'auto') {
    if (selectedPalette.bg) pageBg = selectedPalette.bg;
    if (selectedPalette.card) cardBg = selectedPalette.card;
    if (selectedPalette.border) cardBorder = selectedPalette.border;
    primaryColor = selectedPalette.primary;
  }

  // Typography choices
  const headlineFont = (analysis.isSerif || data.headlineFont?.includes('serif'))
    ? 'Playfair Display, Georgia, serif'
    : (data.headlineFont || 'Rethink Sans, sans-serif');

  const elements = [];
  let currentY = 30;

  // 1. NAVBAR
  if (wantsNavbar) {
    elements.push({
      id: uid('navbar'),
      type: 'navbar',
      name: `${brandName} Navigation`,
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 1200,
      height: 70,
      rotation: 0,
      zIndex: 25,
      content: {
        brandText: brandName,
        brandTag: data.tag,
        showLogoImage: true,
        logoUrl: '',
        logoHeight: 28,
        logoShape: 'rounded',
        links: data.links,
        linksAlignment: 'center',
        showSearch: false,
        searchPlaceholder: 'Search commissions...',
        showCta: true,
        ctaText: data.ctaPrimary,
        ctaUrl: '#',
        ctaVariant: 'primary',
        showAvatar: false,
        avatarUrl: '',
        avatarName: '',
        avatarShape: 'circle',
        avatarSize: 32,
        showStatusDot: false
      },
      styles: {
        fontFamily: headlineFont,
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 14,
        boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.03)',
        padding: { top: 12, right: 24, bottom: 12, left: 24 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.6, delay: 0.05, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 105;
  }

  // 2. HERO SECTION
  if (wantsHero) {
    // Release Badge Pill
    elements.push({
      id: uid('badge'),
      type: 'badge',
      name: 'Hero Release Tag',
      parentId: null,
      locked: false,
      hidden: false,
      x: 520,
      y: currentY,
      width: 400,
      height: 32,
      rotation: 0,
      zIndex: 10,
      content: { text: data.badge },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 12,
        fontWeight: '600',
        color: primaryColor,
        textAlign: 'center',
        letterSpacing: 1.5,
        backgroundColor: accentSoft,
        borderColor: primaryColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 9999,
        padding: { top: 4, right: 14, bottom: 4, left: 14 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.1, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 46;

    // Main Heading H1
    elements.push({
      id: uid('heading'),
      type: 'heading',
      name: 'Hero Main Headline',
      parentId: null,
      locked: false,
      hidden: false,
      x: 170,
      y: currentY,
      width: 1100,
      height: 115,
      rotation: 0,
      zIndex: 10,
      content: { text: data.title, tag: 'h1' },
      styles: {
        fontFamily: headlineFont,
        fontSize: 48,
        fontWeight: '600',
        color: textPrimary,
        textAlign: 'center',
        lineHeight: 1.15,
        letterSpacing: -0.5,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 8, bottom: 4, left: 8 }
      },
      animation: { effect: 'slide-up', trigger: 'load', duration: 0.6, delay: 0.15, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 130;

    // Subtitle Paragraph
    elements.push({
      id: uid('text'),
      type: 'text',
      name: 'Hero Subtitle',
      parentId: null,
      locked: false,
      hidden: false,
      x: 270,
      y: currentY,
      width: 900,
      height: 64,
      rotation: 0,
      zIndex: 10,
      content: { text: data.subtitle },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 16.5,
        fontWeight: '400',
        color: textSecondary,
        textAlign: 'center',
        lineHeight: 1.65,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 8, bottom: 4, left: 8 }
      },
      animation: { effect: 'slide-up', trigger: 'load', duration: 0.6, delay: 0.22, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 80;

    // Hero Action Buttons
    elements.push({
      id: uid('button'),
      type: 'button',
      name: 'Primary CTA Button',
      parentId: null,
      locked: false,
      hidden: false,
      x: 520,
      y: currentY,
      width: 200,
      height: 48,
      rotation: 0,
      zIndex: 12,
      content: { text: data.ctaPrimary, url: '#' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14.5,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        boxShadow: `0 8px 20px ${primaryColor}30`,
        padding: { top: 12, right: 22, bottom: 12, left: 22 }
      },
      animation: { effect: 'zoom-in', trigger: 'load', duration: 0.5, delay: 0.3, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('button'),
      type: 'button',
      name: 'Secondary Action Button',
      parentId: null,
      locked: false,
      hidden: false,
      x: 740,
      y: currentY,
      width: 190,
      height: 48,
      rotation: 0,
      zIndex: 12,
      content: { text: data.ctaSecondary, url: '#' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14.5,
        fontWeight: '500',
        color: textPrimary,
        textAlign: 'center',
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        padding: { top: 12, right: 20, bottom: 12, left: 20 }
      },
      animation: { effect: 'zoom-in', trigger: 'load', duration: 0.5, delay: 0.35, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 76;

    // Hero Showcase Image
    elements.push({
      id: uid('image'),
      type: 'image',
      name: 'Hero Visual Showcase',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 1200,
      height: 480,
      rotation: 0,
      zIndex: 10,
      content: {
        src: data.heroImage,
        alt: `${brandName} Architectural Showcase`
      },
      styles: {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 16,
        boxShadow: isDarkMode ? '0 20px 50px rgba(0,0,0,0.6)' : '0 20px 40px -10px rgba(0,0,0,0.08)',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      animation: { effect: 'slide-up', trigger: 'load', duration: 0.7, delay: 0.4, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 510;

    // Stats Row (If stats requested or architecture topic)
    if (analysis.hasStats && data.stats) {
      data.stats.forEach((stat, idx) => {
        const statX = 120 + idx * 410;
        elements.push({
          id: uid('card'),
          type: 'card',
          name: `Stat Box ${stat.value}`,
          parentId: null,
          locked: false,
          hidden: false,
          x: statX,
          y: currentY,
          width: 380,
          height: 90,
          rotation: 0,
          zIndex: 10,
          content: {},
          styles: {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderWidth: 1,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            padding: { top: 16, right: 20, bottom: 16, left: 20 }
          },
          animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.45 + idx * 0.1, easing: 'ease-out', iterationCount: '1' },
          responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
        });

        elements.push({
          id: uid('heading'),
          type: 'heading',
          name: `Stat Value ${idx + 1}`,
          parentId: null,
          locked: false,
          hidden: false,
          x: statX + 20,
          y: currentY + 14,
          width: 340,
          height: 36,
          rotation: 0,
          zIndex: 11,
          content: { text: stat.value, tag: 'h3' },
          styles: {
            fontFamily: headlineFont,
            fontSize: 26,
            fontWeight: '700',
            color: primaryColor,
            textAlign: 'left',
            backgroundColor: 'transparent',
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.5 + idx * 0.1, easing: 'ease-out', iterationCount: '1' },
          responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
        });

        elements.push({
          id: uid('text'),
          type: 'text',
          name: `Stat Label ${idx + 1}`,
          parentId: null,
          locked: false,
          hidden: false,
          x: statX + 20,
          y: currentY + 52,
          width: 340,
          height: 24,
          rotation: 0,
          zIndex: 11,
          content: { text: stat.label },
          styles: {
            fontFamily: 'Rethink Sans',
            fontSize: 13,
            fontWeight: '500',
            color: textSecondary,
            textAlign: 'left',
            backgroundColor: 'transparent',
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.55 + idx * 0.1, easing: 'ease-out', iterationCount: '1' },
          responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
        });
      });

      currentY += 120;
    }
  }

  // 3. DIVIDER
  elements.push({
    id: uid('divider'),
    type: 'divider',
    name: 'Section Divider',
    parentId: null,
    locked: false,
    hidden: false,
    x: 120,
    y: currentY,
    width: 1200,
    height: 16,
    rotation: 0,
    zIndex: 5,
    content: {},
    styles: {
      backgroundColor: 'transparent',
      borderColor: cardBorder,
      borderWidth: 1,
      borderStyle: 'solid',
      padding: { top: 6, right: 0, bottom: 6, left: 0 }
    },
    animation: { effect: 'none', trigger: 'load', duration: 0.6, delay: 0, easing: 'ease-out', iterationCount: '1' },
    responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
  });

  currentY += 40;

  // 4. PHILOSOPHY / INTRO (If architecture or philosophy requested)
  if (analysis.hasPhilosophy && analysis.topic === 'architecture') {
    elements.push({
      id: uid('label'),
      type: 'label',
      name: 'Philosophy Tag',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 280,
      height: 28,
      rotation: 0,
      zIndex: 10,
      content: { text: 'STUDIO PHILOSOPHY & ETHOS' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 12,
        fontWeight: '600',
        color: primaryColor,
        textAlign: 'left',
        letterSpacing: 1.5,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 0, bottom: 4, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.1, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 34;

    elements.push({
      id: uid('heading'),
      type: 'heading',
      name: 'Philosophy Quote',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 680,
      height: 110,
      rotation: 0,
      zIndex: 10,
      content: {
        text: '“Architecture is not the enclosure of space, but the silent dialogue between raw mass and natural light.”',
        tag: 'h2'
      },
      styles: {
        fontFamily: headlineFont,
        fontSize: 28,
        fontWeight: '600',
        color: textPrimary,
        textAlign: 'left',
        lineHeight: 1.3,
        backgroundColor: 'transparent',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.15, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('image'),
      type: 'image',
      name: 'Philosophy Detail Image',
      parentId: null,
      locked: false,
      hidden: false,
      x: 840,
      y: currentY - 34,
      width: 480,
      height: 240,
      rotation: 0,
      zIndex: 10,
      content: {
        src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        alt: 'Tactile architectural materiality and shadows'
      },
      styles: {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderRadius: 14,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      animation: { effect: 'slide-left', trigger: 'load', duration: 0.6, delay: 0.25, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('text'),
      type: 'text',
      name: 'Philosophy Paragraph',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY + 120,
      width: 680,
      height: 80,
      rotation: 0,
      zIndex: 10,
      content: {
        text: 'Founded in 2008, our practice approaches every commission through the lens of geological permanence and quiet dignity. We work with unadorned materials—reclaimed limestone, rammed earth, charred cedar, and low-iron glass—allowing structures to patinate with grace across decades.'
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 15,
        fontWeight: '400',
        color: textSecondary,
        textAlign: 'left',
        lineHeight: 1.65,
        backgroundColor: 'transparent',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.2, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 230;

    // Divider
    elements.push({
      id: uid('divider'),
      type: 'divider',
      name: 'Philosophy Divider',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 1200,
      height: 16,
      rotation: 0,
      zIndex: 5,
      content: {},
      styles: {
        backgroundColor: 'transparent',
        borderColor: cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        padding: { top: 6, right: 0, bottom: 6, left: 0 }
      },
      animation: { effect: 'none', trigger: 'load', duration: 0.6, delay: 0, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 40;
  }

  // 5. FEATURES / FEATURED PROJECTS GRID
  if (wantsFeatures) {
    // Section Header
    elements.push({
      id: uid('label'),
      type: 'label',
      name: 'Features Section Tag',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 320,
      height: 28,
      rotation: 0,
      zIndex: 10,
      content: { text: analysis.topic === 'architecture' ? 'CURATED COMMISSIONS (01 / 06)' : 'CAPABILITIES & ARCHITECTURE' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 12,
        fontWeight: '600',
        color: primaryColor,
        textAlign: 'left',
        letterSpacing: 1.5,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 0, bottom: 4, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.1, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 32;

    elements.push({
      id: uid('heading'),
      type: 'heading',
      name: 'Features Heading',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 700,
      height: 48,
      rotation: 0,
      zIndex: 10,
      content: {
        text: analysis.topic === 'architecture' ? 'Selected Architectural Works' : 'Engineered for Mission-Critical Performance',
        tag: 'h2'
      },
      styles: {
        fontFamily: headlineFont,
        fontSize: 32,
        fontWeight: '600',
        color: textPrimary,
        textAlign: 'left',
        lineHeight: 1.25,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 0, bottom: 4, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.15, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 68;

    // 3 Cards
    const cardWidth = 380;
    const cardGap = 30;
    const cardStartX = 120;

    data.features.forEach((feat, index) => {
      const cardX = cardStartX + index * (cardWidth + cardGap);

      // Card Container
      elements.push({
        id: uid('card'),
        type: 'card',
        name: `Feature Card ${index + 1}`,
        parentId: null,
        locked: false,
        hidden: false,
        x: cardX,
        y: currentY,
        width: cardWidth,
        height: 250,
        rotation: 0,
        zIndex: 10,
        content: {},
        styles: {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 16,
          boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.35)' : '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
          padding: { top: 24, right: 24, bottom: 24, left: 24 }
        },
        animation: { effect: 'slide-up', trigger: 'load', duration: 0.6, delay: 0.2 + index * 0.12, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      // Icon Graphic inside Card
      elements.push({
        id: uid('icon'),
        type: 'icon',
        name: `Card ${index + 1} Icon`,
        parentId: null,
        locked: false,
        hidden: false,
        x: cardX + 24,
        y: currentY + 24,
        width: 52,
        height: 52,
        rotation: 0,
        zIndex: 11,
        content: { iconName: feat.icon },
        styles: {
          color: primaryColor,
          backgroundColor: accentSoft,
          borderColor: cardBorder,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          padding: { top: 14, right: 14, bottom: 14, left: 14 }
        },
        animation: { effect: 'zoom-in', trigger: 'load', duration: 0.4, delay: 0.25 + index * 0.12, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      // Title inside Card
      elements.push({
        id: uid('heading'),
        type: 'heading',
        name: `Card ${index + 1} Title`,
        parentId: null,
        locked: false,
        hidden: false,
        x: cardX + 24,
        y: currentY + 92,
        width: cardWidth - 48,
        height: 34,
        rotation: 0,
        zIndex: 11,
        content: { text: feat.title, tag: 'h3' },
        styles: {
          fontFamily: headlineFont,
          fontSize: 19,
          fontWeight: '600',
          color: textPrimary,
          textAlign: 'left',
          lineHeight: 1.3,
          backgroundColor: 'transparent',
          padding: { top: 2, right: 0, bottom: 2, left: 0 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.3 + index * 0.12, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      // Description inside Card
      elements.push({
        id: uid('text'),
        type: 'text',
        name: `Card ${index + 1} Description`,
        parentId: null,
        locked: false,
        hidden: false,
        x: cardX + 24,
        y: currentY + 132,
        width: cardWidth - 48,
        height: 85,
        rotation: 0,
        zIndex: 11,
        content: { text: feat.desc },
        styles: {
          fontFamily: 'Rethink Sans',
          fontSize: 14,
          fontWeight: '400',
          color: textSecondary,
          textAlign: 'left',
          lineHeight: 1.6,
          backgroundColor: 'transparent',
          padding: { top: 2, right: 0, bottom: 2, left: 0 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.35 + index * 0.12, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });
    });

    currentY += 280;
  }

  // 6. SERVICES / CHECKLIST SECTION
  if (wantsList) {
    elements.push({
      id: uid('container'),
      type: 'container',
      name: 'Services & Specifications',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 1200,
      height: 310,
      rotation: 0,
      zIndex: 8,
      content: {},
      styles: {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 20,
        boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 6px 24px -2px rgba(0,0,0,0.04)',
        padding: { top: 32, right: 36, bottom: 32, left: 36 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.6, delay: 0.2, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    // Left Column
    elements.push({
      id: uid('label'),
      type: 'label',
      name: 'List Badge',
      parentId: null,
      locked: false,
      hidden: false,
      x: 160,
      y: currentY + 36,
      width: 250,
      height: 26,
      rotation: 0,
      zIndex: 10,
      content: { text: analysis.topic === 'architecture' ? 'PRACTICE CAPABILITIES' : 'COMPREHENSIVE SPECIFICATIONS' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 12,
        fontWeight: '600',
        color: primaryColor,
        textAlign: 'left',
        letterSpacing: 1.2,
        backgroundColor: 'transparent',
        padding: { top: 2, right: 0, bottom: 2, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.25, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('heading'),
      type: 'heading',
      name: 'List Headline',
      parentId: null,
      locked: false,
      hidden: false,
      x: 160,
      y: currentY + 68,
      width: 480,
      height: 76,
      rotation: 0,
      zIndex: 10,
      content: {
        text: analysis.topic === 'architecture' ? 'Integrated spatial disciplines from concept to stone' : 'Every detail calibrated for enterprise scale',
        tag: 'h2'
      },
      styles: {
        fontFamily: headlineFont,
        fontSize: 28,
        fontWeight: '600',
        color: textPrimary,
        textAlign: 'left',
        lineHeight: 1.25,
        backgroundColor: 'transparent',
        padding: { top: 2, right: 0, bottom: 2, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.3, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('text'),
      type: 'text',
      name: 'List Subtitle',
      parentId: null,
      locked: false,
      hidden: false,
      x: 160,
      y: currentY + 152,
      width: 460,
      height: 60,
      rotation: 0,
      zIndex: 10,
      content: {
        text: analysis.topic === 'architecture'
          ? 'From private residential sanctuaries to civic cultural pavilions, our cross-disciplinary studio oversees architectural engineering, interior joinery, and landscape topography.'
          : 'Built on open standards and microservices architecture. Plug directly into your existing CI/CD automation without vendor lock-in.'
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14.5,
        fontWeight: '400',
        color: textSecondary,
        textAlign: 'left',
        lineHeight: 1.6,
        backgroundColor: 'transparent',
        padding: { top: 2, right: 0, bottom: 2, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.35, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    // Right Column: Feature List Component
    elements.push({
      id: uid('list'),
      type: 'list',
      name: 'Key Benefits Checklist',
      parentId: null,
      locked: false,
      hidden: false,
      x: 680,
      y: currentY + 36,
      width: 580,
      height: 220,
      rotation: 0,
      zIndex: 10,
      content: {
        listType: 'check',
        items: data.checklist
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14.5,
        fontWeight: '500',
        color: textPrimary,
        lineHeight: 1.65,
        textAlign: 'left',
        backgroundColor: 'transparent',
        padding: { top: 8, right: 8, bottom: 8, left: 8 }
      },
      animation: { effect: 'slide-left', trigger: 'load', duration: 0.6, delay: 0.4, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 345;
  }

  // 7. PRICING SECTION (If specifically requested or pricing topic)
  if (wantsPricing) {
    elements.push({
      id: uid('heading'),
      type: 'heading',
      name: 'Pricing Section Header',
      parentId: null,
      locked: false,
      hidden: false,
      x: 320,
      y: currentY,
      width: 800,
      height: 52,
      rotation: 0,
      zIndex: 10,
      content: { text: 'Choose the Right Tier for Your Team', tag: 'h2' },
      styles: {
        fontFamily: headlineFont,
        fontSize: 34,
        fontWeight: '700',
        color: textPrimary,
        textAlign: 'center',
        lineHeight: 1.25,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 8, bottom: 4, left: 8 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.1, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 70;

    const pricingTiers = [
      { name: 'Starter', price: '$29/mo', desc: 'Ideal for early-stage founders & solo developers.', cta: 'Start with Starter', isFeatured: false },
      { name: 'Pro Growth', price: '$89/mo', desc: 'Designed for scaling production apps with SLA.', cta: 'Upgrade to Pro', isFeatured: true },
      { name: 'Enterprise', price: '$299/mo', desc: 'Dedicated infrastructure, custom SLAs & 24/7 hotline.', cta: 'Contact Enterprise', isFeatured: false }
    ];

    pricingTiers.forEach((tier, index) => {
      const pX = 120 + index * 410;

      elements.push({
        id: uid('card'),
        type: 'card',
        name: `Pricing Tier ${tier.name}`,
        parentId: null,
        locked: false,
        hidden: false,
        x: pX,
        y: currentY,
        width: 380,
        height: 380,
        rotation: 0,
        zIndex: 10,
        content: {},
        styles: {
          backgroundColor: cardBg,
          borderColor: tier.isFeatured ? primaryColor : cardBorder,
          borderWidth: tier.isFeatured ? 2 : 1,
          borderStyle: 'solid',
          borderRadius: 18,
          boxShadow: tier.isFeatured
            ? `0 12px 30px ${primaryColor}25`
            : isDarkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)',
          padding: { top: 28, right: 28, bottom: 28, left: 28 }
        },
        animation: { effect: 'slide-up', trigger: 'load', duration: 0.6, delay: 0.2 + index * 0.1, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      elements.push({
        id: uid('heading'),
        type: 'heading',
        name: `${tier.name} Heading`,
        parentId: null,
        locked: false,
        hidden: false,
        x: pX + 28,
        y: currentY + 28,
        width: 320,
        height: 30,
        rotation: 0,
        zIndex: 11,
        content: { text: tier.name, tag: 'h3' },
        styles: {
          fontFamily: headlineFont,
          fontSize: 22,
          fontWeight: '700',
          color: textPrimary,
          textAlign: 'left',
          backgroundColor: 'transparent',
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.25, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      elements.push({
        id: uid('heading'),
        type: 'heading',
        name: `${tier.name} Price`,
        parentId: null,
        locked: false,
        hidden: false,
        x: pX + 28,
        y: currentY + 65,
        width: 320,
        height: 48,
        rotation: 0,
        zIndex: 11,
        content: { text: tier.price, tag: 'h2' },
        styles: {
          fontFamily: 'Rethink Sans',
          fontSize: 36,
          fontWeight: '800',
          color: primaryColor,
          textAlign: 'left',
          backgroundColor: 'transparent',
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.3, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      elements.push({
        id: uid('text'),
        type: 'text',
        name: `${tier.name} Desc`,
        parentId: null,
        locked: false,
        hidden: false,
        x: pX + 28,
        y: currentY + 118,
        width: 320,
        height: 50,
        rotation: 0,
        zIndex: 11,
        content: { text: tier.desc },
        styles: {
          fontFamily: 'Rethink Sans',
          fontSize: 14,
          fontWeight: '400',
          color: textSecondary,
          textAlign: 'left',
          lineHeight: 1.5,
          backgroundColor: 'transparent',
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.35, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      elements.push({
        id: uid('list'),
        type: 'list',
        name: `${tier.name} Features`,
        parentId: null,
        locked: false,
        hidden: false,
        x: pX + 28,
        y: currentY + 172,
        width: 320,
        height: 120,
        rotation: 0,
        zIndex: 11,
        content: {
          listType: 'check',
          items: [
            `${index === 0 ? '5' : index === 1 ? '50' : 'Unlimited'} Active Workspaces`,
            `${index === 0 ? '10 GB' : index === 1 ? '500 GB' : '10 TB'} High-Speed Storage`,
            index > 0 ? 'Priority 24/7 SLA Response' : 'Standard Community Support'
          ]
        },
        styles: {
          fontFamily: 'Rethink Sans',
          fontSize: 13,
          fontWeight: '400',
          color: textSecondary,
          lineHeight: 1.5,
          backgroundColor: 'transparent',
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.4, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });

      elements.push({
        id: uid('button'),
        type: 'button',
        name: `${tier.name} Button`,
        parentId: null,
        locked: false,
        hidden: false,
        x: pX + 28,
        y: currentY + 308,
        width: 324,
        height: 44,
        rotation: 0,
        zIndex: 12,
        content: { text: tier.cta, url: '#' },
        styles: {
          fontFamily: 'Rethink Sans',
          fontSize: 14.5,
          fontWeight: '600',
          color: tier.isFeatured ? '#FFFFFF' : textPrimary,
          textAlign: 'center',
          backgroundColor: tier.isFeatured ? primaryColor : (isDarkMode ? '#334155' : '#F1F5F9'),
          borderColor: tier.isFeatured ? primaryColor : cardBorder,
          borderWidth: 1,
          borderRadius: 8,
          boxShadow: tier.isFeatured ? `0 4px 12px ${primaryColor}40` : 'none',
          padding: { top: 10, right: 16, bottom: 10, left: 16 }
        },
        animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.45, easing: 'ease-out', iterationCount: '1' },
        responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
      });
    });

    currentY += 415;
  }

  // 8. CONTACT / INQUIRY SECTION
  if (wantsContact) {
    elements.push({
      id: uid('container'),
      type: 'container',
      name: 'Contact Form Section',
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 1200,
      height: 420,
      rotation: 0,
      zIndex: 8,
      content: {},
      styles: {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 20,
        boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 6px 24px -2px rgba(0,0,0,0.04)',
        padding: { top: 36, right: 40, bottom: 36, left: 40 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.6, delay: 0.2, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    // Contact Headline
    elements.push({
      id: uid('heading'),
      type: 'heading',
      name: 'Contact Header',
      parentId: null,
      locked: false,
      hidden: false,
      x: 170,
      y: currentY + 40,
      width: 440,
      height: 50,
      rotation: 0,
      zIndex: 10,
      content: {
        text: analysis.topic === 'architecture' ? "Let's build something that lasts." : 'Send us a direct message',
        tag: 'h2'
      },
      styles: {
        fontFamily: headlineFont,
        fontSize: 30,
        fontWeight: '600',
        color: textPrimary,
        textAlign: 'left',
        lineHeight: 1.25,
        backgroundColor: 'transparent',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.25, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('text'),
      type: 'text',
      name: 'Contact Subtitle',
      parentId: null,
      locked: false,
      hidden: false,
      x: 170,
      y: currentY + 100,
      width: 440,
      height: 90,
      rotation: 0,
      zIndex: 10,
      content: {
        text: analysis.topic === 'architecture'
          ? 'Studio Presence:\n74 Rue de Turenne, 75003 Paris\n14 Bleecker St, New York\ninquiries@atelierverra.com'
          : 'We typically review technical architectures and partnership proposals within 2 hours during normal business hours.'
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14.5,
        fontWeight: '400',
        color: textSecondary,
        textAlign: 'left',
        lineHeight: 1.6,
        backgroundColor: 'transparent',
        padding: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.3, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    // Form inputs
    const formX = 660;

    elements.push({
      id: uid('input'),
      type: 'input',
      name: 'Full Name Input',
      parentId: null,
      locked: false,
      hidden: false,
      x: formX,
      y: currentY + 36,
      width: 280,
      height: 48,
      rotation: 0,
      zIndex: 10,
      content: { label: 'Client / Representative Name', placeholder: 'Julian Vane' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14,
        color: textPrimary,
        backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
        borderColor: cardBorder,
        borderWidth: 1,
        borderRadius: 8,
        padding: { top: 12, right: 16, bottom: 12, left: 16 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.35, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('input'),
      type: 'input',
      name: 'Work Email Input',
      parentId: null,
      locked: false,
      hidden: false,
      x: formX + 300,
      y: currentY + 36,
      width: 300,
      height: 48,
      rotation: 0,
      zIndex: 10,
      content: { label: 'Email Address', placeholder: 'julian@estate.com' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14,
        color: textPrimary,
        backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
        borderColor: cardBorder,
        borderWidth: 1,
        borderRadius: 8,
        padding: { top: 12, right: 16, bottom: 12, left: 16 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.35, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('select'),
      type: 'select',
      name: 'Project Scope Selector',
      parentId: null,
      locked: false,
      hidden: false,
      x: formX,
      y: currentY + 104,
      width: 600,
      height: 48,
      rotation: 0,
      zIndex: 10,
      content: {
        label: 'Commission Typology',
        options: analysis.topic === 'architecture'
          ? ['Private Residence / Estate', 'Cultural / Exhibition Pavilion', 'Adaptive Reuse & Restoration', 'Civic Masterplan']
          : ['Technical Integration', 'Enterprise License', 'Custom Development', 'Partnership']
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14,
        color: textPrimary,
        backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
        borderColor: cardBorder,
        borderWidth: 1,
        borderRadius: 8,
        padding: { top: 12, right: 16, bottom: 12, left: 16 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.4, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('textarea'),
      type: 'textarea',
      name: 'Message Textarea',
      parentId: null,
      locked: false,
      hidden: false,
      x: formX,
      y: currentY + 172,
      width: 600,
      height: 110,
      rotation: 0,
      zIndex: 10,
      content: {
        label: 'Project Details & Site Location',
        placeholder: 'Describe location, approximate site footprint, timeline, and architectural ambitions...'
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14,
        color: textPrimary,
        backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
        borderColor: cardBorder,
        borderWidth: 1,
        borderRadius: 8,
        padding: { top: 12, right: 16, bottom: 12, left: 16 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.45, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('checkbox'),
      type: 'checkbox',
      name: 'Consent Checkbox',
      parentId: null,
      locked: false,
      hidden: false,
      x: formX,
      y: currentY + 300,
      width: 400,
      height: 36,
      rotation: 0,
      zIndex: 10,
      content: {
        label: 'I agree to the privacy policy and data processing',
        checked: true
      },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 13.5,
        color: textSecondary,
        backgroundColor: 'transparent',
        padding: { top: 4, right: 6, bottom: 4, left: 6 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.4, delay: 0.5, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    elements.push({
      id: uid('button'),
      type: 'button',
      name: 'Submit Form Button',
      parentId: null,
      locked: false,
      hidden: false,
      x: formX + 380,
      y: currentY + 296,
      width: 220,
      height: 44,
      rotation: 0,
      zIndex: 12,
      content: { text: analysis.topic === 'architecture' ? 'Submit Inquiry ➔' : 'Send Message ➔', url: '#' },
      styles: {
        fontFamily: 'Rethink Sans',
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        boxShadow: `0 4px 12px ${primaryColor}35`,
        padding: { top: 10, right: 18, bottom: 10, left: 18 }
      },
      animation: { effect: 'zoom-in', trigger: 'load', duration: 0.4, delay: 0.55, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 455;
  }

  // 9. FOOTER
  if (wantsFooter) {
    elements.push({
      id: uid('footer'),
      type: 'footer',
      name: `${brandName} Footer`,
      parentId: null,
      locked: false,
      hidden: false,
      x: 120,
      y: currentY,
      width: 1200,
      height: 140,
      rotation: 0,
      zIndex: 10,
      content: {
        copyright: `© 2026 ${brandName}. All rights reserved.`,
        links: data.links.map(l => l.label)
      },
      styles: {
        backgroundColor: isDarkMode ? '#0B0F19' : cardBg,
        borderColor: cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 14,
        padding: { top: 24, right: 28, bottom: 24, left: 28 }
      },
      animation: { effect: 'fade-in', trigger: 'load', duration: 0.5, delay: 0.2, easing: 'ease-out', iterationCount: '1' },
      responsive: { hideOnDesktop: false, hideOnTablet: false, hideOnMobile: false }
    });

    currentY += 160;
  }

  const calculatedMinHeight = Math.max(960, Math.ceil((currentY + 60) / 100) * 100);

  return {
    projectName: `${brandName} Architecture`,
    pageSettings: {
      backgroundColor: pageBg,
      backgroundGradient: null,
      backgroundImage: null,
      defaultFont: headlineFont,
      pageWidth: 1440,
      minHeight: calculatedMinHeight
    },
    elements
  };
}

/**
 * Suggested template presets for user convenience
 */
export const AI_PROMPT_PRESETS = [
  {
    title: '🏛️ Editorial Architecture Studio',
    category: 'Architecture / Spatial',
    prompt: 'Build a long, single-page landing website for an architecture studio called "Atelier Verra". Warm off-white background (#F6F3EE), stone surfaces, near-black text (#1A1A18), and muted terracotta accent (#B4573A). Editorial serif typography (Playfair Display), minimal navbar, hero with architectural showcase and stats (120+ projects, 18 years, 14 awards), studio philosophy, featured project commissions, services list, and contact inquiry form.'
  },
  {
    title: '🚀 Modern AI SaaS Platform',
    category: 'SaaS / AI',
    prompt: 'Create a sleek dark-mode SaaS landing page for an AI Analytics startup with a modern navbar, hero section with badge and dual CTA buttons, interactive showcase image, 3 feature cards with icons, and a comprehensive specifications checklist.'
  },
  {
    title: '💼 Creative Design Studio',
    category: 'Agency / Portfolio',
    prompt: 'Build a minimal, elegant creative design agency website with high-contrast typography, top navigation, hero section, 3 services cards, capability checklist, and modern footer.'
  },
  {
    title: '💳 SaaS Pricing & Subscription Grid',
    category: 'Pricing / Sales',
    prompt: 'Generate a high-converting pricing page with top navbar, pricing plans comparison matrix for Starter, Pro, and Enterprise tiers, feature check lists, and money-back guarantee.'
  },
  {
    title: '📩 Inbound Lead Capture & Contact Hub',
    category: 'Lead Gen / Forms',
    prompt: 'Design a clean customer contact and enterprise inquiry page featuring a hero headline, office details, full interactive form with name, email, scope dropdown, message textarea, and submission button.'
  },
  {
    title: '📱 Mobile Health & Fitness App',
    category: 'Mobile / Consumer',
    prompt: 'Create a vibrant mobile app landing page for a personal biometrics & health tracker with app download buttons, hero showcase, core health features, and wearable sync checklist.'
  },
  {
    title: '🛍️ Contemporary E-Commerce Showcase',
    category: 'E-Commerce / Retail',
    prompt: 'Assemble a modern product landing page for an architectural furniture brand with top navigation, featured collection hero, value badges, craft guarantee checklist, and support footer.'
  }
];
