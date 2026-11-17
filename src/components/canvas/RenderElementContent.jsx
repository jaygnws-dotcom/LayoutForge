import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { THEME_COLORS } from '../../types/elements';

export default function RenderElementContent({ element, isEditing, onContentChange, onStopEditing }) {
  const { type, content = {}, styles = {} } = element;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isNarrow = typeof element.width === 'number' && element.width < 620;

  switch (type) {
    case 'heading': {
      const Tag = content.tag || 'h2';
      return (
        <Tag
          className="w-full h-full flex items-center outline-none select-none"
          style={{
            justifyContent: styles.textAlign === 'center' ? 'center' : styles.textAlign === 'right' ? 'flex-end' : 'flex-start',
            textAlign: styles.textAlign || 'left'
          }}
        >
          {isEditing ? (
            <input
              type="text"
              value={content.text || ''}
              onChange={(e) => onContentChange({ text: e.target.value })}
              onBlur={onStopEditing}
              onKeyDown={(e) => e.key === 'Enter' && onStopEditing && onStopEditing()}
              className="bg-transparent border-b border-primary text-inherit font-inherit outline-none w-full"
              style={{ textAlign: styles.textAlign || 'left' }}
              autoFocus
            />
          ) : (
            <span>{content.text || 'Heading Text'}</span>
          )}
        </Tag>
      );
    }

    case 'text':
      return isEditing ? (
        <textarea
          value={content.text || ''}
          onChange={(e) => onContentChange({ text: e.target.value })}
          onBlur={onStopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onStopEditing && onStopEditing();
            }
          }}
          className="bg-transparent border border-primary rounded p-1 text-inherit font-inherit outline-none w-full h-full resize-none"
          style={{ textAlign: styles.textAlign || 'left' }}
          autoFocus
        />
      ) : (
        <p
          className="w-full h-full m-0 whitespace-pre-wrap select-none"
          style={{ textAlign: styles.textAlign || 'left' }}
        >
          {content.text || 'Paragraph text here...'}
        </p>
      );

    case 'label':
      return (
        <span
          className="w-full h-full flex items-center font-medium tracking-wider uppercase select-none"
          style={{
            justifyContent: styles.textAlign === 'center' ? 'center' : styles.textAlign === 'right' ? 'flex-end' : 'flex-start',
            textAlign: styles.textAlign || 'left'
          }}
        >
          {isEditing ? (
            <input
              type="text"
              value={content.text || ''}
              onChange={(e) => onContentChange({ text: e.target.value })}
              onBlur={onStopEditing}
              onKeyDown={(e) => e.key === 'Enter' && onStopEditing && onStopEditing()}
              className="bg-transparent border-b border-primary text-inherit font-inherit outline-none w-full"
              style={{ textAlign: styles.textAlign || 'left' }}
              autoFocus
            />
          ) : (
            content.text || 'LABEL'
          )}
        </span>
      );

    case 'button':
      return (
        <button
          className="w-full h-full flex items-center font-medium cursor-pointer transition-transform active:scale-95 outline-none shadow-sm"
          style={{
            pointerEvents: 'none',
            justifyContent: styles.textAlign === 'left' ? 'flex-start' : styles.textAlign === 'right' ? 'flex-end' : 'center',
            textAlign: styles.textAlign || 'center'
          }}
        >
          {isEditing ? (
            <input
              type="text"
              value={content.text || ''}
              onChange={(e) => onContentChange({ text: e.target.value })}
              onBlur={onStopEditing}
              onKeyDown={(e) => e.key === 'Enter' && onStopEditing && onStopEditing()}
              className="bg-transparent border-b border-white text-inherit font-inherit outline-none w-full"
              style={{ textAlign: styles.textAlign || 'center' }}
              autoFocus
            />
          ) : (
            <span>{content.text || 'Button'}</span>
          )}
        </button>
      );

    case 'badge':
      return (
        <div
          className="w-full h-full flex items-center font-medium text-xs rounded-full"
          style={{
            justifyContent: styles.textAlign === 'left' ? 'flex-start' : styles.textAlign === 'right' ? 'flex-end' : 'center',
            textAlign: styles.textAlign || 'center'
          }}
        >
          {isEditing ? (
            <input
              type="text"
              value={content.text || ''}
              onChange={(e) => onContentChange({ text: e.target.value })}
              onBlur={onStopEditing}
              onKeyDown={(e) => e.key === 'Enter' && onStopEditing && onStopEditing()}
              className="bg-transparent border-b border-primary text-inherit font-inherit outline-none w-full"
              style={{ textAlign: styles.textAlign || 'center' }}
              autoFocus
            />
          ) : (
            <span>{content.text || 'Chip Badge'}</span>
          )}
        </div>
      );

    case 'list': {
      const items = content.items || [
        'Intelligent responsive flex clustering',
        'Production-ready HTML5 & CSS3 export',
        'Zero external CSS framework dependencies',
        'High-precision pixel snapping & guides'
      ];
      const listType = content.listType || 'check';
      const itemFontFamily = styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : 'inherit';
      const itemFontSize = styles.fontSize ? `${styles.fontSize}px` : '14px';
      const itemFontWeight = styles.fontWeight || '400';
      const itemColor = styles.color || THEME_COLORS.secondary;

      return (
        <div
          className="w-full h-full flex flex-col justify-center space-y-2 select-none"
          style={{
            fontFamily: itemFontFamily,
            fontSize: itemFontSize,
            fontWeight: itemFontWeight,
            color: itemColor,
            lineHeight: styles.lineHeight || 1.6,
            textAlign: styles.textAlign || 'left'
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              {listType === 'check' && (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                  <LucideIcons.Check className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
              {listType === 'bullet' && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 ml-1.5 mr-1" />
              )}
              {listType === 'numbered' && (
                <div className="w-5 h-5 rounded-md bg-accentSoft text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
              )}
              <span className="flex-1 truncate">{item}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'card':
    case 'container':
      return (
        <div className="w-full h-full relative pointer-events-none">
          <div className="absolute top-2 right-2 text-[9px] font-mono tracking-widest uppercase opacity-40 text-secondary">
            {type === 'card' ? 'CARD' : 'CONTAINER'}
          </div>
        </div>
      );

    case 'navbar': {
      const rawLinks = content.links || ['Features', 'Templates', 'Pricing', 'Docs'];
      const links = rawLinks.map((l, idx) =>
        typeof l === 'string'
          ? { label: l, url: '#' }
          : { label: l.label || `Link ${idx + 1}`, url: l.url || '#' }
      );
      const showLogoImage = content.showLogoImage ?? true;
      const showAvatar = content.showAvatar ?? true;
      const showCta = content.showCta ?? true;
      const showSearch = content.showSearch ?? false;

      // Typography & Text Styles Resolution
      const fontFamily = styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : 'inherit';
      const baseFontSize = styles.fontSize ? Number(styles.fontSize) : 14;
      const baseFontWeight = styles.fontWeight || '500';
      const textColor = styles.color || undefined;
      const letterSpacing = styles.letterSpacing !== undefined ? `${styles.letterSpacing}px` : undefined;
      const lineHeight = styles.lineHeight || undefined;

      // Links alignment: respects styles.textAlign or content.linksAlignment
      const linksAlignment = styles.textAlign || content.linksAlignment || 'center';

      return (
        <div
          className="w-full h-full flex items-center justify-between gap-3 px-2 select-none"
          style={{
            fontFamily,
            color: textColor || THEME_COLORS.onSurface,
            letterSpacing,
            lineHeight
          }}
        >
          {/* Brand & Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
            {showLogoImage && (
              content.logoUrl ? (
                <img
                  src={content.logoUrl}
                  alt={content.brandText || 'Logo'}
                  className={`object-contain flex-shrink-0 ${
                    content.logoShape === 'circle'
                      ? 'rounded-full'
                      : content.logoShape === 'square'
                      ? 'rounded-none'
                      : 'rounded-md'
                  }`}
                  style={{
                    height: `${content.logoHeight || 28}px`,
                    width: 'auto',
                    maxHeight: '100%'
                  }}
                />
              ) : (
                <div
                  className="flex items-center justify-center bg-primary text-white rounded-lg shadow-xs flex-shrink-0"
                  style={{
                    width: `${content.logoHeight || 28}px`,
                    height: `${content.logoHeight || 28}px`
                  }}
                >
                  <LucideIcons.Sparkles className="w-3.5 h-3.5" />
                </div>
              )
            )}

            {content.brandText !== '' && (
              <span
                className="truncate select-none tracking-tight"
                style={{
                  fontFamily,
                  fontSize: `${Math.round(baseFontSize * 1.25)}px`,
                  fontWeight: styles.fontWeight ? Math.min(900, Number(styles.fontWeight) + 200) : '700',
                  color: content.brandTextColor || textColor || THEME_COLORS.onSurface,
                  letterSpacing: letterSpacing || '-0.02em',
                  lineHeight
                }}
              >
                {content.brandText ?? 'LayoutForge'}
              </span>
            )}

            {content.brandTag && (
              <span
                className="font-semibold uppercase px-1.5 py-0.5 rounded-full bg-accentSoft text-primary border border-primary/20 flex-shrink-0"
                style={{
                  fontFamily,
                  fontSize: `${Math.max(9, Math.round(baseFontSize * 0.72))}px`,
                  letterSpacing: '0.05em'
                }}
              >
                {content.brandTag}
              </span>
            )}
          </div>

          {/* Center Area: Search Bar & Nav Links (Desktop) */}
          {!isNarrow && (
            <div
              className={`flex items-center gap-5 flex-1 min-w-0 ${
                linksAlignment === 'left'
                  ? 'justify-start ml-3'
                  : linksAlignment === 'right'
                  ? 'justify-end mr-3'
                  : 'justify-center'
              }`}
            >
              {showSearch && (
                <div className="relative flex items-center min-w-[120px] max-w-[200px] w-full flex-shrink-0">
                  <LucideIcons.Search className="w-3 h-3 text-secondary absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={content.searchPlaceholder || 'Search...'}
                    readOnly
                    style={{
                      fontFamily,
                      fontSize: `${Math.max(10, Math.round(baseFontSize * 0.85))}px`,
                      letterSpacing
                    }}
                    className="w-full bg-muted border border-border rounded-full pl-7 pr-2.5 py-1 text-onSurface placeholder:text-secondary outline-none pointer-events-none"
                  />
                </div>
              )}

              <div
                className="flex items-center gap-5 overflow-hidden"
                style={{
                  fontFamily,
                  fontSize: `${baseFontSize}px`,
                  fontWeight: baseFontWeight,
                  letterSpacing,
                  lineHeight
                }}
              >
                {links.map((link, idx) => (
                  <span
                    key={idx}
                    className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      color: textColor || THEME_COLORS.secondary
                    }}
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Right Area: CTA Button & Avatar / User Image / Mobile Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showCta && (!isNarrow || (element.width && element.width >= 340)) && (
              <button
                style={{
                  fontFamily,
                  fontSize: `${Math.max(10, Math.round(baseFontSize * (isNarrow ? 0.8 : 0.9)))}px`,
                  fontWeight: baseFontWeight,
                  letterSpacing
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shadow-xs ${
                  content.ctaVariant === 'outline'
                    ? 'border border-primary text-primary hover:bg-accentSoft'
                    : content.ctaVariant === 'subtle'
                    ? 'bg-muted text-onSurface border border-border hover:bg-border'
                    : 'bg-primary text-white hover:bg-blue-700'
                }`}
              >
                {content.ctaText || 'Get Started'}
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            {isNarrow && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileNavOpen(!isMobileNavOpen);
                }}
                className="p-1.5 rounded-lg hover:bg-muted text-onSurface border border-border/60 transition-colors shadow-2xs"
                title="Toggle Mobile Menu"
              >
                {isMobileNavOpen ? <LucideIcons.X className="w-4 h-4" /> : <LucideIcons.Menu className="w-4 h-4" />}
              </button>
            )}

            {!isNarrow && showAvatar && (
              <div className="relative flex items-center flex-shrink-0">
                {content.avatarUrl ? (
                  <img
                    src={content.avatarUrl}
                    alt={content.avatarName || 'User Avatar'}
                    className={`object-cover border border-border shadow-xs ${
                      content.avatarShape === 'rounded'
                        ? 'rounded-lg'
                        : content.avatarShape === 'square'
                        ? 'rounded-none'
                        : 'rounded-full'
                    }`}
                    style={{
                      width: `${content.avatarSize || 32}px`,
                      height: `${content.avatarSize || 32}px`
                    }}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center font-bold text-white bg-gradient-to-tr from-primary to-blue-400 border border-white shadow-xs ${
                      content.avatarShape === 'rounded'
                        ? 'rounded-lg'
                        : content.avatarShape === 'square'
                        ? 'rounded-none'
                        : 'rounded-full'
                    }`}
                    style={{
                      width: `${content.avatarSize || 32}px`,
                      height: `${content.avatarSize || 32}px`,
                      fontSize: `${Math.max(10, (content.avatarSize || 32) * 0.38)}px`,
                      fontFamily
                    }}
                  >
                    {content.avatarName
                      ? content.avatarName
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : <LucideIcons.User className="w-3.5 h-3.5" />}
                  </div>
                )}
                {content.showStatusDot !== false && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-surface rounded-full shadow-xs" />
                )}
              </div>
            )}
          </div>

          {/* Mobile Collapsible Drawer Menu */}
          {isNarrow && isMobileNavOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-surface border border-border rounded-b-xl shadow-2xl p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95"
              style={{
                fontFamily,
                color: textColor || THEME_COLORS.onSurface,
                backgroundColor: styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : '#FFFFFF'
              }}
            >
              {showSearch && (
                <div className="relative flex items-center w-full mb-1">
                  <LucideIcons.Search className="w-3.5 h-3.5 text-secondary absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={content.searchPlaceholder || 'Search...'}
                    readOnly
                    className="w-full bg-muted border border-border rounded-lg pl-8 pr-2.5 py-1 text-xs text-onSurface outline-none pointer-events-none"
                  />
                </div>
              )}
              {links.map((link, idx) => (
                <span key={idx} className="text-xs font-medium py-1 px-2 hover:bg-muted rounded-md transition-colors">
                  {link.label}
                </span>
              ))}
              {showCta && (
                <button
                  className="w-full mt-1 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white shadow-xs"
                >
                  {content.ctaText || 'Get Started'}
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    case 'footer': {
      const footerFontFamily = styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : 'inherit';
      const footerTextColor = styles.color || undefined;
      const isFooterNarrow = typeof element.width === 'number' && element.width < 550;

      return (
        <div
          className="w-full h-full flex flex-col justify-between p-2 select-none"
          style={{
            fontFamily: footerFontFamily,
            color: footerTextColor
          }}
        >
          <div className={`flex ${isFooterNarrow ? 'flex-col items-start gap-2.5 pb-2.5' : 'items-center justify-between pb-3'} text-xs border-b border-border`}>
            <span
              className="font-semibold"
              style={{ color: footerTextColor || THEME_COLORS.onSurface }}
            >
              {content.brandText || 'LayoutForge Project'}
            </span>
            <div className={`flex ${isFooterNarrow ? 'flex-wrap gap-x-4 gap-y-1.5' : 'gap-4'}`}>
              {(content.links || ['Privacy', 'Terms', 'Support']).map((link, idx) => (
                <span
                  key={idx}
                  className="hover:text-primary cursor-pointer transition-colors"
                  style={{ color: footerTextColor || THEME_COLORS.secondary }}
                >
                  {typeof link === 'string' ? link : (link.label || `Link ${idx + 1}`)}
                </span>
              ))}
            </div>
          </div>
          <div
            className="text-[11px] pt-1.5"
            style={{ color: footerTextColor || THEME_COLORS.secondary }}
          >
            {content.copyright || '© 2026 All rights reserved.'}
          </div>
        </div>
      );
    }

    case 'divider':
      return (
        <div className="w-full h-full flex items-center">
          <div
            className="w-full"
            style={{
              borderTopWidth: `${styles.borderWidth || 1}px`,
              borderTopStyle: styles.borderStyle || 'solid',
              borderTopColor: styles.borderColor || THEME_COLORS.border
            }}
          />
        </div>
      );

    case 'input':
      return (
        <div
          className="w-full h-full flex flex-col justify-center"
          style={{
            fontFamily: styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : undefined
          }}
        >
          {content.label && (
            <label
              className="text-[11px] font-medium mb-1"
              style={{ color: styles.color || THEME_COLORS.secondary }}
            >
              {content.label}
            </label>
          )}
          <input
            type="text"
            readOnly
            placeholder={content.placeholder || 'Enter text...'}
            style={{
              fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
              color: styles.color || THEME_COLORS.onSurface
            }}
            className="w-full bg-surface border border-border rounded px-3 py-1.5 text-xs pointer-events-none"
          />
        </div>
      );

    case 'textarea':
      return (
        <div
          className="w-full h-full flex flex-col"
          style={{
            fontFamily: styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : undefined
          }}
        >
          {content.label && (
            <label
              className="text-[11px] font-medium mb-1"
              style={{ color: styles.color || THEME_COLORS.secondary }}
            >
              {content.label}
            </label>
          )}
          <textarea
            readOnly
            placeholder={content.placeholder || 'Enter detailed notes...'}
            style={{
              fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
              color: styles.color || THEME_COLORS.onSurface
            }}
            className="w-full flex-1 bg-surface border border-border rounded p-2 text-xs pointer-events-none resize-none"
          />
        </div>
      );

    case 'select':
      return (
        <div
          className="w-full h-full flex flex-col justify-center"
          style={{
            fontFamily: styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : undefined
          }}
        >
          {content.label && (
            <label
              className="text-[11px] font-medium mb-1"
              style={{ color: styles.color || THEME_COLORS.secondary }}
            >
              {content.label}
            </label>
          )}
          <div
            className="flex items-center justify-between w-full bg-surface border border-border rounded px-3 py-1.5 text-xs"
            style={{
              fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
              color: styles.color || THEME_COLORS.onSurface
            }}
          >
            <span>{content.options?.[0] || 'Select an option'}</span>
            <LucideIcons.ChevronDown className="w-3.5 h-3.5 text-secondary" />
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div
          className="w-full h-full flex items-center gap-2 select-none cursor-pointer"
          onClick={() => onContentChange({ checked: !content.checked })}
          style={{
            fontFamily: styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : undefined
          }}
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center shadow-xs transition-colors ${
              content.checked !== false
                ? 'bg-primary border-primary text-white'
                : 'bg-surface border-border text-transparent'
            }`}
          >
            <LucideIcons.Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span
            className="text-xs"
            style={{
              fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
              fontWeight: styles.fontWeight,
              color: styles.color || THEME_COLORS.onSurface
            }}
          >
            {content.label || 'Checkbox option'}
          </span>
        </div>
      );

    case 'radiogroup':
      return (
        <div
          className="w-full h-full flex flex-col justify-center gap-1.5 select-none"
          style={{
            fontFamily: styles.fontFamily ? `"${styles.fontFamily}", sans-serif` : undefined
          }}
        >
          {(content.options || ['Option A', 'Option B']).map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs cursor-pointer"
              onClick={() => onContentChange({ selectedIndex: idx })}
              style={{
                fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
                fontWeight: styles.fontWeight,
                color: styles.color || THEME_COLORS.onSurface
              }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  idx === (content.selectedIndex || 0)
                    ? 'border-primary bg-primary'
                    : 'border-border bg-surface'
                }`}
              >
                {idx === (content.selectedIndex || 0) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      );

    case 'image':
      return (
        <div className="w-full h-full overflow-hidden rounded-inherit relative group">
          {content.src ? (
            <img
              src={content.src}
              alt={content.alt || 'Layout image'}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted border border-dashed border-border text-secondary">
              <LucideIcons.Image className="w-8 h-8 mb-1 opacity-50" />
              <span className="text-xs">No Image Source</span>
            </div>
          )}
        </div>
      );

    case 'video':
      return (
        <div className="w-full h-full overflow-hidden rounded-inherit bg-black relative flex items-center justify-center">
          {content.videoUrl && content.videoUrl.includes('youtube.com') ? (
            <iframe
              src={content.videoUrl}
              title="Video Embed"
              className="w-full h-full pointer-events-none"
            />
          ) : (
            <div className="flex flex-col items-center text-white">
              <LucideIcons.PlayCircle className="w-12 h-12 text-primary mb-2" />
              <span className="text-xs font-medium">Video Embed Container</span>
            </div>
          )}
        </div>
      );

    case 'icon': {
      const IconComp = LucideIcons[content.iconName] || LucideIcons.Zap;
      return (
        <div className="w-full h-full flex items-center justify-center">
          <IconComp className="w-7 h-7 text-primary" />
        </div>
      );
    }

    default:
      return <div className="text-xs text-secondary">{type}</div>;
  }
}
