import { buildResponsiveLayout, calculateFluidTypography, BASE_DESKTOP_WIDTH } from './responsive';

/**
 * Maps element types to semantic class names.
 */
function getSemanticClassName(element) {
  const cleanName = (element.name || element.type)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `lf-${cleanName || element.type}`;
}

/**
 * CSS Keyframes definitions for all supported animation effects.
 */
const KEYFRAME_DEFINITIONS = `
@keyframes lf-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes lf-slide-up {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes lf-slide-down {
  from { opacity: 0; transform: translateY(-32px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes lf-slide-left {
  from { opacity: 0; transform: translateX(32px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes lf-slide-right {
  from { opacity: 0; transform: translateX(-32px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes lf-zoom-in {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes lf-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes lf-bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-16px); }
  60% { transform: translateY(-8px); }
}

@keyframes lf-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@keyframes lf-flip {
  from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
  to { transform: perspective(400px) rotateY(0deg); opacity: 1; }
}

@keyframes lf-rotate {
  from { transform: rotate(-180deg) scale(0.7); opacity: 0; }
  to { transform: rotate(0deg) scale(1); opacity: 1; }
}
`;

/**
 * Minimal scroll-triggered animation IntersectionObserver script (<30 lines).
 */
const SCROLL_OBSERVER_SCRIPT = `
<script>
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('lf-animated-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-scroll-anim]').forEach(function(el) {
    observer.observe(el);
  });
})();
</script>
`;

/**
 * Generates semantic HTML snippet for an element (including children if container).
 */
function renderElementHTML(el, nestedChildrenMap, assetPathPrefix = '') {
  const className = getSemanticClassName(el);
  const anim = el.animation || {};
  const hasScrollAnim = anim.effect && anim.effect !== 'none' && anim.trigger === 'scroll';
  const animAttr = hasScrollAnim ? ' data-scroll-anim' : '';

  const visibilityClasses = [
    el.responsive?.hideOnDesktop ? 'lf-hide-desktop' : '',
    el.responsive?.hideOnTablet ? 'lf-hide-tablet' : '',
    el.responsive?.hideOnMobile ? 'lf-hide-mobile' : ''
  ].filter(Boolean).join(' ');

  const fullClass = [className, visibilityClasses].filter(Boolean).join(' ');

  const children = nestedChildrenMap[el.id] || [];
  const childrenHTML = children.map(child => renderElementHTML(child, nestedChildrenMap, assetPathPrefix)).join('\n      ');

  switch (el.type) {
    case 'heading': {
      const Tag = el.content?.tag || 'h2';
      return `<${Tag} class="${fullClass}"${animAttr}>${el.content?.text || 'Heading'}</${Tag}>`;
    }
    case 'text':
      return `<p class="${fullClass}"${animAttr}>${el.content?.text || ''}</p>`;
    case 'label':
      return `<span class="${fullClass}"${animAttr}>${el.content?.text || ''}</span>`;
    case 'button':
      return `<a href="${el.content?.url || '#'}" class="${fullClass}"${animAttr}>${el.content?.text || 'Button'}</a>`;
    case 'badge':
      return `<div class="${fullClass}"${animAttr}>${el.content?.text || 'Badge'}</div>`;
    case 'list': {
      const items = el.content?.items || ['Feature item 1', 'Feature item 2', 'Feature item 3'];
      const listType = el.content?.listType || 'check';

      if (listType === 'numbered') {
        const lis = items.map((it, idx) => `
        <li class="lf-list-item">
          <span class="lf-list-num">${idx + 1}</span>
          <span class="lf-list-text">${it}</span>
        </li>`).join('');
        return `<ol class="${fullClass} lf-list-ol"${animAttr}>${lis}\n      </ol>`;
      }

      const isCheck = listType === 'check';
      const lis = items.map(it => `
      <li class="lf-list-item">
        ${isCheck
          ? `<span class="lf-list-check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`
          : `<span class="lf-list-bullet"></span>`
        }
        <span class="lf-list-text">${it}</span>
      </li>`).join('');

      return `<ul class="${fullClass} lf-list-ul"${animAttr}>${lis}\n      </ul>`;
    }
    case 'container':
    case 'card': {
      const Tag = el.type === 'container' ? 'section' : 'div';
      return `<${Tag} class="${fullClass}"${animAttr}>
        ${childrenHTML}
      </${Tag}>`;
    }
    case 'navbar': {
      const rawLinks = el.content?.links || ['Home', 'Features', 'Pricing'];
      const links = rawLinks
        .map(l => {
          const text = typeof l === 'string' ? l : (l.label || 'Link');
          const href = typeof l === 'string' ? '#' : (l.url || '#');
          return `<a href="${href}" class="lf-nav-link">${text}</a>`;
        })
        .join('\n          ');

      const showLogoImage = el.content?.showLogoImage ?? true;
      const logoHtml = showLogoImage && el.content?.logoUrl
        ? `<img src="${el.content.logoUrl}" alt="${el.content?.brandText || 'Logo'}" class="lf-nav-logo lf-shape-${el.content?.logoShape || 'rounded'}" style="height:${el.content?.logoHeight || 28}px;" />`
        : '';
      const brandStyle = el.content?.brandTextColor ? ` style="color:${el.content.brandTextColor};"` : '';
      const brandHtml = el.content?.brandText !== ''
        ? `<span class="lf-brand-text"${brandStyle}>${el.content?.brandText || 'Brand'}</span>`
        : '';
      const badgeHtml = el.content?.brandTag
        ? `<span class="lf-nav-badge">${el.content.brandTag}</span>`
        : '';

      const searchHtml = el.content?.showSearch
        ? `<div class="lf-nav-search"><svg class="lf-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><input type="text" placeholder="${el.content?.searchPlaceholder || 'Search...'}" class="lf-nav-search-input" /></div>`
        : '';

      const alignClass = el.content?.linksAlignment ? ` lf-align-${el.content.linksAlignment}` : '';

      const ctaHtml = el.content?.showCta !== false
        ? `<a href="${el.content?.ctaUrl || '#'}" class="lf-nav-cta lf-cta-${el.content?.ctaVariant || 'primary'}">${el.content?.ctaText || 'Get Started'}</a>`
        : '';

      const showAvatar = el.content?.showAvatar ?? true;
      const avatarHtml = showAvatar
        ? (el.content?.avatarUrl
            ? `<div class="lf-nav-avatar-box"><img src="${el.content.avatarUrl}" alt="${el.content?.avatarName || 'User'}" class="lf-nav-avatar lf-shape-${el.content?.avatarShape || 'circle'}" style="width:${el.content?.avatarSize || 32}px;height:${el.content?.avatarSize || 32}px;" />${el.content?.showStatusDot !== false ? '<span class="lf-status-dot"></span>' : ''}</div>`
            : `<div class="lf-nav-avatar-box"><div class="lf-nav-avatar-fallback lf-shape-${el.content?.avatarShape || 'circle'}" style="width:${el.content?.avatarSize || 32}px;height:${el.content?.avatarSize || 32}px;">${el.content?.avatarName ? el.content.avatarName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'}</div>${el.content?.showStatusDot !== false ? '<span class="lf-status-dot"></span>' : ''}</div>`
          )
        : '';

      return `<header class="${fullClass}"${animAttr}>
      <nav class="lf-nav-inner">
        <div class="lf-brand">
          ${logoHtml}
          ${brandHtml}
          ${badgeHtml}
        </div>
        ${searchHtml}
        <div class="lf-nav-links${alignClass}">
          ${links}
        </div>
        <div class="lf-nav-actions">
          ${ctaHtml}
          ${avatarHtml}
          <button class="lf-nav-toggle" aria-label="Toggle navigation menu" onclick="this.closest('.lf-nav-inner').querySelector('.lf-nav-links').classList.toggle('lf-open')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </nav>
    </header>`;
    }
    case 'footer': {
      const rawLinks = el.content?.links || ['Privacy', 'Terms', 'Contact'];
      const links = rawLinks
        .map(l => {
          const text = typeof l === 'string' ? l : (l.label || 'Link');
          const href = typeof l === 'string' ? '#' : (l.url || '#');
          return `<a href="${href}" class="lf-footer-link">${text}</a>`;
        }).join('\n        ');
      const brand = el.content?.brandText || 'LayoutForge';
      return `<footer class="${fullClass}"${animAttr}>
      <div class="lf-footer-top">
        <span class="lf-footer-brand">${brand}</span>
        <div class="lf-footer-links">
          ${links}
        </div>
      </div>
      <p class="lf-copyright">${el.content?.copyright || '© 2026 LayoutForge'}</p>
    </footer>`;
    }
    case 'divider':
      return `<hr class="${fullClass}"${animAttr} />`;
    case 'input':
      return `<div class="${fullClass}-group"${animAttr}>
      ${el.content?.label ? `<label class="lf-form-label">${el.content.label}</label>` : ''}
      <input type="text" placeholder="${el.content?.placeholder || ''}" class="${fullClass}" />
    </div>`;
    case 'textarea':
      return `<div class="${fullClass}-group"${animAttr}>
      ${el.content?.label ? `<label class="lf-form-label">${el.content.label}</label>` : ''}
      <textarea placeholder="${el.content?.placeholder || ''}" class="${fullClass}"></textarea>
    </div>`;
    case 'select': {
      const options = (el.content?.options || ['Option 1', 'Option 2'])
        .map(opt => `<option value="${opt}">${opt}</option>`).join('\n        ');
      return `<div class="${fullClass}-group"${animAttr}>
      ${el.content?.label ? `<label class="lf-form-label">${el.content.label}</label>` : ''}
      <select class="${fullClass}">
        ${options}
      </select>
    </div>`;
    }
    case 'checkbox':
      return `<label class="${fullClass}-label"${animAttr}>
      <input type="checkbox" ${el.content?.checked ? 'checked' : ''} class="${fullClass}" />
      <span>${el.content?.label || 'Checkbox'}</span>
    </label>`;
    case 'radiogroup': {
      const options = (el.content?.options || ['Option A', 'Option B']).map((opt, i) => `
      <label class="lf-radio-option">
        <input type="radio" name="${el.content?.groupName || 'radio-group'}" ${i === 0 ? 'checked' : ''} />
        <span>${opt}</span>
      </label>`).join('');
      return `<div class="${fullClass}"${animAttr}>
        ${options}
      </div>`;
    }
    case 'image': {
      let imgSrc = el.content?.src || 'https://via.placeholder.com/800x500';
      if (assetPathPrefix && imgSrc.startsWith('data:image')) {
        imgSrc = `${assetPathPrefix}image-${el.id}.png`;
      }
      return `<img src="${imgSrc}" alt="${el.content?.alt || 'Image'}" class="${fullClass}"${animAttr} />`;
    }
    case 'video':
      return `<div class="${fullClass}"${animAttr}>
      <iframe src="${el.content?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" frameborder="0" allowfullscreen></iframe>
    </div>`;
    case 'icon':
      return `<div class="${fullClass}"${animAttr}>
      <span class="lf-icon-placeholder">⚡</span>
    </div>`;
    default:
      return `<div class="${fullClass}"${animAttr}>${el.name || ''}</div>`;
  }
}

/**
 * Generates element specific CSS rules.
 */
function generateElementCSS(el) {
  const className = getSemanticClassName(el);
  const s = el.styles || {};
  const anim = el.animation || {};

  const declarations = [];

  // Typography
  if (s.fontFamily) declarations.push(`font-family: "${s.fontFamily}", sans-serif;`);
  if (s.fontSize) declarations.push(`font-size: ${calculateFluidTypography(s.fontSize)};`);
  if (s.fontWeight) declarations.push(`font-weight: ${s.fontWeight};`);
  if (s.color) declarations.push(`color: ${s.color};`);
  if (s.textAlign) declarations.push(`text-align: ${s.textAlign};`);
  if (s.lineHeight) declarations.push(`line-height: ${s.lineHeight};`);
  if (s.letterSpacing) declarations.push(`letter-spacing: ${s.letterSpacing}px;`);

  // Background
  if (s.backgroundGradient) {
    declarations.push(`background: ${s.backgroundGradient};`);
  } else if (s.backgroundColor) {
    declarations.push(`background-color: ${s.backgroundColor};`);
  }
  if (s.backgroundImage) {
    declarations.push(`background-image: url('${s.backgroundImage}');`);
    declarations.push(`background-size: ${s.backgroundSize || 'cover'};`);
    declarations.push(`background-position: center;`);
  }
  if (s.opacity !== undefined && s.opacity !== 1) {
    declarations.push(`opacity: ${s.opacity};`);
  }

  // Border & Radius & Shadows
  if (s.borderWidth !== undefined) {
    if (s.borderWidth > 0) {
      declarations.push(`border: ${s.borderWidth}px ${s.borderStyle || 'solid'} ${s.borderColor || 'transparent'};`);
    } else {
      declarations.push(`border: none;`);
    }
  } else if (el.type === 'divider') {
    declarations.push(`border: none; border-top: 1px solid ${s.borderColor || '#E6E6E6'}; width: 100%;`);
  }
  if (s.borderRadius !== undefined) {
    declarations.push(`border-radius: ${s.borderRadius}px;`);
  }
  if (s.boxShadow && s.boxShadow !== 'none') {
    declarations.push(`box-shadow: ${s.boxShadow};`);
  } else if (s.boxShadow === 'none') {
    declarations.push(`box-shadow: none;`);
  }
  if (s.backdropFilter) {
    declarations.push(`backdrop-filter: ${s.backdropFilter};`);
    declarations.push(`-webkit-backdrop-filter: ${s.backdropFilter};`);
  }

  // Spacing
  if (s.padding) {
    declarations.push(`padding: ${s.padding.top || 0}px ${s.padding.right || 0}px ${s.padding.bottom || 0}px ${s.padding.left || 0}px;`);
  }
  if (s.margin) {
    declarations.push(`margin: ${s.margin.top || 0}px ${s.margin.right || 0}px ${s.margin.bottom || 0}px ${s.margin.left || 0}px;`);
  }

  // Specific components layout tweaks
  if (el.type === 'button') {
    declarations.push(`display: inline-flex; align-items: center; justify-content: center; text-decoration: none; cursor: pointer; transition: transform 0.2s, filter 0.2s;`);
  } else if (el.type === 'label') {
    declarations.push(`display: block; width: 100%;`);
  } else if (el.type === 'image') {
    declarations.push(`max-width: 100%; height: auto; display: block; object-fit: cover;`);
  } else if (el.type === 'video') {
    declarations.push(`position: relative; aspect-ratio: 16 / 9; width: 100%; overflow: hidden; border-radius: 12px;`);
  }

  // Animations
  if (anim.effect && anim.effect !== 'none') {
    const keyframe = `lf-${anim.effect}`;
    const duration = `${anim.duration || 0.6}s`;
    const easing = anim.easing || 'ease-out';
    const delay = `${anim.delay || 0}s`;
    const iteration = anim.iterationCount || '1';

    if (anim.trigger === 'load') {
      declarations.push(`animation: ${keyframe} ${duration} ${easing} ${delay} ${iteration} both;`);
    } else if (anim.trigger === 'hover') {
      declarations.push(`transition: transform 0.3s ease;`);
    }
  }

  let cssRule = `.${className} {\n  ${declarations.join('\n  ')}\n}`;

  if (anim.effect && anim.effect !== 'none' && anim.trigger === 'hover') {
    cssRule += `\n.${className}:hover {\n  animation: lf-${anim.effect} ${anim.duration || 0.6}s ${anim.easing || 'ease-out'} both;\n}`;
  }

  if (anim.effect && anim.effect !== 'none' && anim.trigger === 'scroll') {
    cssRule += `\n.${className} {\n  opacity: 0;\n}\n.${className}.lf-animated-in {\n  animation: lf-${anim.effect} ${anim.duration || 0.6}s ${anim.easing || 'ease-out'} ${anim.delay || 0}s both;\n}`;
  }

  return cssRule;
}

/**
 * Generates the full HTML, CSS, and combined document.
 */
export function generateProjectCode(elements, pageSettings = {}, assetPathPrefix = '') {
  const layout = buildResponsiveLayout(elements, pageSettings);
  const defaultFont = pageSettings.defaultFont || 'Rethink Sans';

  const hasScrollObserver = elements.some(e => e.animation?.trigger === 'scroll' && e.animation?.effect !== 'none');

  const rowsHTML = layout.rows.map((row) => {
    const rowClass = `lf-row lf-row-${row.rowIndex}`;
    const itemsHTML = row.elements.map(el => {
      const widthPct = el.widthPercent;
      return `<div class="lf-col" style="--col-width: ${widthPct}%;">
        ${renderElementHTML(el, layout.nestedChildrenMap, assetPathPrefix)}
      </div>`;
    }).join('\n      ');

    return `<div class="${rowClass}" style="margin-top: ${row.marginTop}px;">
      ${itemsHTML}
    </div>`;
  }).join('\n\n    ');

  const elementRules = elements.map(el => generateElementCSS(el)).join('\n\n');

  const cssContent = `/* ===================================================
   Generated by LayoutForge Studio (Light Mode)
   Clean Semantic Responsive CSS (Zero Dependencies)
   =================================================== */

:root {
  --lf-primary: #2563EB;
  --lf-secondary: #4D4D4D;
  --lf-tertiary: #E6E6E6;
  --lf-surface: #FFFFFF;
  --lf-on-surface: #000000;
  --lf-error: #D92D20;
  --lf-border: #E6E6E6;
  --lf-muted: #F5F5F5;
  --lf-accent-soft: #EAF1FF;
  --lf-font-family: "${defaultFont}", system-ui, -apple-system, sans-serif;
  --lf-bg-color: ${pageSettings.backgroundColor || '#FFFFFF'};
  --lf-max-width: ${pageSettings.pageWidth || 1440}px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--lf-font-family);
  background: ${pageSettings.backgroundGradient || 'var(--lf-bg-color)'};
  color: var(--lf-on-surface);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.lf-container {
  max-width: var(--lf-max-width);
  margin: 0 auto;
  padding: 24px 20px;
}

/* Flexbox Row System */
.lf-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.lf-col {
  flex: 0 0 calc(var(--col-width, 100%) - 24px);
  max-width: 100%;
  min-width: 0;
}

/* List Component Styles */
.lf-list-ul, .lf-list-ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lf-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lf-list-check {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background-color: #D1FAE5;
  color: #059669;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lf-list-bullet {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: var(--lf-primary);
  display: inline-block;
  margin-left: 6px;
  margin-right: 4px;
  flex-shrink: 0;
}

.lf-list-num {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background-color: var(--lf-accent-soft, #EAF1FF);
  color: var(--lf-primary);
  font-weight: 700;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lf-list-text {
  flex: 1;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
}

/* Navbar default responsive rules */
.lf-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.lf-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.5px;
  color: var(--lf-on-surface);
  flex-shrink: 0;
  text-decoration: none;
}

.lf-nav-logo {
  object-fit: contain;
}
.lf-nav-logo.lf-shape-rounded { border-radius: 8px; }
.lf-nav-logo.lf-shape-circle { border-radius: 9999px; }
.lf-nav-logo.lf-shape-square { border-radius: 0; }

.lf-nav-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--lf-accent-soft, #EAF1FF);
  color: var(--lf-primary);
  padding: 2px 7px;
  border-radius: 9999px;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.lf-nav-search {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 130px;
  max-width: 220px;
  flex: 1;
}

.lf-search-icon {
  position: absolute;
  left: 9px;
  color: var(--lf-secondary);
  pointer-events: none;
}

.lf-nav-search-input {
  width: 100%;
  background: var(--lf-muted);
  border: 1px solid var(--lf-border);
  border-radius: 9999px;
  padding: 5px 10px 5px 28px;
  font-size: 11.5px;
  color: var(--lf-on-surface);
  outline: none;
}

.lf-nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.lf-nav-links.lf-align-left { margin-right: auto; margin-left: 12px; }
.lf-nav-links.lf-align-right { margin-left: auto; margin-right: 12px; }
.lf-nav-links.lf-align-center { margin: 0 auto; }

.lf-nav-link, .lf-footer-link {
  color: inherit;
  opacity: 0.85;
  text-decoration: none;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
  transition: opacity 0.2s, color 0.2s;
  white-space: nowrap;
}

.lf-nav-link:hover, .lf-footer-link:hover {
  color: var(--lf-primary);
  opacity: 1;
}

.lf-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.lf-nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background-color 0.2s;
}
.lf-nav-toggle:hover {
  background: var(--lf-muted);
}

.lf-nav-cta {
  background: var(--lf-primary);
  color: #ffffff;
  padding: 7px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.2s, background-color 0.2s;
  white-space: nowrap;
}

.lf-nav-cta:hover {
  opacity: 0.9;
}

.lf-nav-cta.lf-cta-outline {
  background: transparent;
  color: var(--lf-primary);
  border: 1px solid var(--lf-primary);
}

.lf-nav-cta.lf-cta-subtle {
  background: var(--lf-muted);
  color: var(--lf-on-surface);
  border: 1px solid var(--lf-border);
}

.lf-nav-avatar-box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.lf-nav-avatar {
  object-fit: cover;
  border: 1px solid var(--lf-border);
}
.lf-nav-avatar.lf-shape-circle { border-radius: 9999px; }
.lf-nav-avatar.lf-shape-rounded { border-radius: 8px; }
.lf-nav-avatar.lf-shape-square { border-radius: 0; }

.lf-nav-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563EB, #60A5FA);
  color: #ffffff;
  font-weight: 700;
  font-size: 11px;
  border: 1px solid #ffffff;
}
.lf-nav-avatar-fallback.lf-shape-circle { border-radius: 9999px; }
.lf-nav-avatar-fallback.lf-shape-rounded { border-radius: 8px; }
.lf-nav-avatar-fallback.lf-shape-square { border-radius: 0; }

.lf-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #10B981;
  border: 2px solid #ffffff;
  border-radius: 9999px;
}

/* Footer layout */
.lf-footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--lf-border);
}

.lf-footer-links {
  display: flex;
  gap: 20px;
}

.lf-copyright {
  font-size: 12px;
  color: var(--lf-secondary);
}

/* Form inputs styling */
.lf-form-label {
  display: block;
  font-size: 12.6px;
  font-weight: 500;
  color: var(--lf-secondary);
  margin-bottom: 6px;
}

/* ===================================================
   Element Specific Generated Styles
   =================================================== */
${elementRules}

/* ===================================================
   CSS Animation Keyframes
   =================================================== */
${KEYFRAME_DEFINITIONS}

/* ===================================================
   Responsive Breakpoints & Media Queries
   =================================================== */

/* Tablet (640px to 1023px) */
@media (max-width: 1023px) and (min-width: 640px) {
  .lf-col {
    flex: 1 1 calc(50% - 16px);
    max-width: calc(50% - 8px);
  }

  .lf-nav-toggle {
    display: inline-flex;
  }

  .lf-nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--lf-border);
    margin-top: 8px;
  }

  .lf-nav-links.lf-open {
    display: flex !important;
  }

  .lf-nav-inner {
    flex-wrap: wrap;
  }

  .lf-hide-tablet {
    display: none !important;
  }
}

/* Mobile (< 640px) */
@media (max-width: 639px) {
  .lf-container {
    padding: 16px 12px;
  }

  .lf-row {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .lf-col {
    flex: 1 1 100% !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Responsive Cards & Containers */
  [class*="lf-card"], [class*="lf-container"], .lf-card {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }

  /* Responsive Navbar */
  .lf-nav-toggle {
    display: inline-flex;
  }

  .lf-nav-inner {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .lf-nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 0 6px 0;
    border-top: 1px solid var(--lf-border);
    margin-top: 10px;
  }

  .lf-nav-links.lf-open {
    display: flex !important;
  }

  .lf-nav-search {
    display: none;
  }

  /* Responsive Footer */
  .lf-footer-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .lf-footer-links {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .lf-copyright {
    margin-top: 14px;
  }

  .lf-hide-mobile {
    display: none !important;
  }
}

/* Desktop Only Override */
@media (min-width: 1024px) {
  .lf-hide-desktop {
    display: none !important;
  }
}
`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LayoutForge Generated Page</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&family=Doto:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="lf-container">
    ${rowsHTML}
  </main>

  ${hasScrollObserver ? SCROLL_OBSERVER_SCRIPT : ''}
</body>
</html>`;

  const singleFileHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LayoutForge Single-File Page</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&family=Doto:wght@400;600&display=swap" rel="stylesheet">
  <style>
${cssContent}
  </style>
</head>
<body>
  <main class="lf-container">
    ${rowsHTML}
  </main>

  ${hasScrollObserver ? SCROLL_OBSERVER_SCRIPT : ''}
</body>
</html>`;

  return {
    html: htmlContent,
    css: cssContent,
    singleFile: singleFileHTML,
    hasScrollObserver
  };
}
