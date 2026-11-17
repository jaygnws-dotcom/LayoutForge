import React, { useRef, useState } from 'react';
import {
  Upload, Plus, Trash2, Link as LinkIcon, MoveUp, MoveDown,
  User, Sparkles, Sliders, Image as ImageIcon, Search, Check,
  X, ExternalLink, ShieldCheck
} from 'lucide-react';

export default function NavbarContentEditor({ element, updateContent }) {
  const { content = {} } = element;
  const [activeTab, setActiveTab] = useState('brand');
  const logoFileInputRef = useRef(null);
  const avatarFileInputRef = useRef(null);

  // Normalize links (support array of strings or array of objects)
  const rawLinks = content.links || [
    { label: 'Features', url: '#features' },
    { label: 'Templates', url: '#templates' },
    { label: 'Pricing', url: '#pricing' },
    { label: 'Docs', url: '#docs' }
  ];

  const links = rawLinks.map((l, idx) =>
    typeof l === 'string'
      ? { label: l, url: '#' }
      : { label: l.label || `Link ${idx + 1}`, url: l.url || '#' }
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateContent({ logoUrl: event.target.result, showLogoImage: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateContent({ avatarUrl: event.target.result, showAvatar: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateLink = (index, key, val) => {
    const updated = links.map((link, i) => (i === index ? { ...link, [key]: val } : link));
    updateContent({ links: updated });
  };

  const handleAddLink = () => {
    const newLink = { label: `Link ${links.length + 1}`, url: '#' };
    updateContent({ links: [...links, newLink] });
  };

  const handleRemoveLink = (index) => {
    const updated = links.filter((_, i) => i !== index);
    updateContent({ links: updated });
  };

  const handleMoveLink = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    updateContent({ links: updated });
  };

  const showLogoImage = content.showLogoImage ?? true;
  const showAvatar = content.showAvatar ?? true;
  const showCta = content.showCta ?? true;
  const showSearch = content.showSearch ?? false;

  return (
    <div className="space-y-3">
      {/* Mini Tab Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-muted rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          className={`py-1.5 px-1 rounded text-[11px] font-medium flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeTab === 'brand'
              ? 'bg-surface text-primary shadow-xs font-semibold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="Logo & Branding"
        >
          <Sparkles className="w-3 h-3" />
          <span className="truncate">Logo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`py-1.5 px-1 rounded text-[11px] font-medium flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeTab === 'links'
              ? 'bg-surface text-primary shadow-xs font-semibold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="Navigation Menu Links"
        >
          <LinkIcon className="w-3 h-3" />
          <span className="truncate">Links ({links.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('avatar')}
          className={`py-1.5 px-1 rounded text-[11px] font-medium flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeTab === 'avatar'
              ? 'bg-surface text-primary shadow-xs font-semibold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="User Avatar / Image"
        >
          <User className="w-3 h-3" />
          <span className="truncate">Avatar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('actions')}
          className={`py-1.5 px-1 rounded text-[11px] font-medium flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeTab === 'actions'
              ? 'bg-surface text-primary shadow-xs font-semibold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="CTA Button & Search Bar"
        >
          <Sliders className="w-3 h-3" />
          <span className="truncate">Extras</span>
        </button>
      </div>

      {/* TAB 1: LOGO & BRAND */}
      {activeTab === 'brand' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div>
            <label className="text-[10px] text-secondary font-medium block mb-1">
              Brand Title / Name
            </label>
            <input
              type="text"
              value={content.brandText ?? 'LayoutForge'}
              placeholder="e.g. Acme Corp"
              onChange={(e) => updateContent({ brandText: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-secondary font-medium">
                Title Text Color
              </label>
              {content.brandTextColor && (
                <button
                  type="button"
                  onClick={() => updateContent({ brandTextColor: '' })}
                  className="text-[10px] text-primary hover:underline font-medium"
                  title="Reset to inherit navbar text color"
                >
                  Reset / Inherit
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-1 bg-muted border border-border rounded px-2 py-1">
                <input
                  type="color"
                  value={content.brandTextColor || (element.styles?.color || '#0F172A')}
                  onChange={(e) => updateContent({ brandTextColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={content.brandTextColor ?? ''}
                  placeholder={element.styles?.color || 'Inherit (#0F172A)'}
                  onChange={(e) => updateContent({ brandTextColor: e.target.value })}
                  className="flex-1 bg-transparent text-[11px] font-mono text-onSurface outline-none uppercase placeholder:normal-case placeholder:text-secondary/60"
                />
              </div>
            </div>

            {/* Quick Color Swatches */}
            <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-border/40">
              <span className="text-[9px] text-secondary font-medium mr-0.5">Quick:</span>
              {[
                { label: 'Dark Slate', color: '#0F172A' },
                { label: 'Primary Blue', color: '#2563EB' },
                { label: 'Indigo', color: '#4F46E5' },
                { label: 'Purple', color: '#7C3AED' },
                { label: 'Emerald', color: '#059669' },
                { label: 'Rose', color: '#E11D48' },
                { label: 'Amber', color: '#D97706' },
                { label: 'Pure White', color: '#FFFFFF' }
              ].map((swatch) => (
                <button
                  key={swatch.color}
                  type="button"
                  onClick={() => updateContent({ brandTextColor: swatch.color })}
                  className={`w-4 h-4 rounded-full border border-black/15 transition-transform hover:scale-115 shadow-2xs ${
                    content.brandTextColor?.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-primary ring-offset-1 scale-110' : ''
                  }`}
                  style={{ backgroundColor: swatch.color }}
                  title={`${swatch.label} (${swatch.color})`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-secondary font-medium block mb-1">
              Brand Badge / Tag (Optional)
            </label>
            <input
              type="text"
              value={content.brandTag ?? ''}
              placeholder="e.g. PRO, BETA, v2.0"
              onChange={(e) => updateContent({ brandTag: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] text-secondary font-medium flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3 text-primary" />
                <span>Logo Image / Icon</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLogoImage}
                  onChange={(e) => updateContent({ showLogoImage: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {showLogoImage && (
              <div className="space-y-2.5 bg-muted/40 p-2.5 rounded-lg border border-border">
                {/* Logo Image Preview & Upload Buttons */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded border border-border bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                    {content.logoUrl ? (
                      <img
                        src={content.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : (
                      <Sparkles className="w-5 h-5 text-primary opacity-60" />
                    )}
                  </div>

                  <div className="flex-1 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-surface hover:bg-accentSoft border border-border hover:border-primary text-primary text-[11px] font-medium rounded transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Logo</span>
                    </button>
                    {content.logoUrl && (
                      <button
                        type="button"
                        onClick={() => updateContent({ logoUrl: '' })}
                        className="px-2 py-1.5 text-secondary hover:text-error hover:bg-red-50 border border-border rounded transition-colors"
                        title="Remove logo image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-secondary block mb-1">Logo Image URL</label>
                  <input
                    type="text"
                    value={content.logoUrl ?? ''}
                    placeholder="https://... or upload above"
                    onChange={(e) => updateContent({ logoUrl: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-secondary block mb-1">
                      Logo Height ({content.logoHeight || 28}px)
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="52"
                      value={content.logoHeight || 28}
                      onChange={(e) => updateContent({ logoHeight: parseInt(e.target.value, 10) })}
                      className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-secondary block mb-1">Logo Shape</label>
                    <div className="flex border border-border rounded bg-surface p-0.5">
                      {['rounded', 'circle', 'square'].map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => updateContent({ logoShape: shape })}
                          className={`flex-1 py-0.5 text-[10px] capitalize rounded ${
                            (content.logoShape || 'rounded') === shape
                              ? 'bg-primary text-white font-medium'
                              : 'text-secondary hover:text-onSurface'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MENU LINKS */}
      {activeTab === 'links' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
              Navigation Links ({links.length})
            </span>
            <button
              type="button"
              onClick={handleAddLink}
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-blue-700 bg-accentSoft hover:bg-blue-100 px-2 py-1 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Link</span>
            </button>
          </div>

          {/* Links Alignment */}
          <div className="flex items-center justify-between bg-muted/60 p-2 rounded border border-border">
            <span className="text-[10px] text-secondary font-medium">Menu Alignment</span>
            <div className="flex border border-border rounded bg-surface p-0.5">
              {[
                { id: 'left', label: 'Left' },
                { id: 'center', label: 'Center' },
                { id: 'right', label: 'Right' }
              ].map((align) => (
                <button
                  key={align.id}
                  type="button"
                  onClick={() => updateContent({ linksAlignment: align.id })}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                    (content.linksAlignment || 'center') === align.id
                      ? 'bg-primary text-white font-medium'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  {align.label}
                </button>
              ))}
            </div>
          </div>

          {/* Link Items List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {links.map((link, idx) => (
              <div
                key={idx}
                className="p-2 bg-muted/40 border border-border rounded-lg space-y-1.5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 text-[10px] text-secondary font-mono text-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={link.label}
                    placeholder="Link Label"
                    onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                    className="flex-1 bg-surface border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary font-medium"
                  />
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink(idx, -1)}
                      className="p-1 text-secondary hover:text-onSurface disabled:opacity-30 rounded hover:bg-surface"
                      title="Move up"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === links.length - 1}
                      onClick={() => handleMoveLink(idx, 1)}
                      className="p-1 text-secondary hover:text-onSurface disabled:opacity-30 rounded hover:bg-surface"
                      title="Move down"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-1 text-secondary hover:text-error rounded hover:bg-red-50 ml-0.5"
                      title="Remove link"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-5">
                  <LinkIcon className="w-3 h-3 text-secondary flex-shrink-0" />
                  <input
                    type="text"
                    value={link.url}
                    placeholder="#section or https://..."
                    onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                    className="w-full bg-surface border border-border rounded px-2 py-0.5 text-[11px] text-secondary outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}

            {links.length === 0 && (
              <div className="text-center py-4 text-xs text-secondary bg-muted/20 border border-dashed border-border rounded-lg">
                No menu links. Click "+ Add Link" to add one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AVATAR & USER PROFILE */}
      {activeTab === 'avatar' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-secondary font-medium flex items-center gap-1.5">
              <User className="w-3 h-3 text-primary" />
              <span>User Avatar / Custom Image</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAvatar}
                onChange={(e) => updateContent({ showAvatar: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {showAvatar && (
            <div className="space-y-2.5 bg-muted/40 p-2.5 rounded-lg border border-border">
              {/* Avatar Preview & Upload */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`border border-border bg-surface flex items-center justify-center overflow-hidden flex-shrink-0 relative ${
                    content.avatarShape === 'rounded'
                      ? 'rounded-lg'
                      : content.avatarShape === 'square'
                      ? 'rounded-none'
                      : 'rounded-full'
                  }`}
                  style={{ width: 44, height: 44 }}
                >
                  {content.avatarUrl ? (
                    <img
                      src={content.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs">
                      {content.avatarName
                        ? content.avatarName
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                        : 'JD'}
                    </div>
                  )}
                  {content.showStatusDot !== false && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
                  )}
                </div>

                <div className="flex-1 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-surface hover:bg-accentSoft border border-border hover:border-primary text-primary text-[11px] font-medium rounded transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                  {content.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => updateContent({ avatarUrl: '' })}
                      className="px-2 py-1.5 text-secondary hover:text-error hover:bg-red-50 border border-border rounded transition-colors"
                      title="Clear image URL"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-secondary block mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={content.avatarUrl ?? ''}
                  placeholder="https://... or upload above"
                  onChange={(e) => updateContent({ avatarUrl: e.target.value })}
                  className="w-full bg-surface border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] text-secondary block mb-1">
                  User Name (Fallback Initials)
                </label>
                <input
                  type="text"
                  value={content.avatarName ?? 'Alex Morgan'}
                  placeholder="e.g. Jane Doe"
                  onChange={(e) => updateContent({ avatarName: e.target.value })}
                  className="w-full bg-surface border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Shape</label>
                  <div className="flex border border-border rounded bg-surface p-0.5">
                    {['circle', 'rounded', 'square'].map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => updateContent({ avatarShape: shape })}
                        className={`flex-1 py-0.5 text-[10px] capitalize rounded ${
                          (content.avatarShape || 'circle') === shape
                            ? 'bg-primary text-white font-medium'
                            : 'text-secondary hover:text-onSurface'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-secondary block mb-1">Size</label>
                  <div className="flex border border-border rounded bg-surface p-0.5">
                    {[
                      { size: 28, label: 'SM' },
                      { size: 34, label: 'MD' },
                      { size: 42, label: 'LG' }
                    ].map((opt) => (
                      <button
                        key={opt.size}
                        type="button"
                        onClick={() => updateContent({ avatarSize: opt.size })}
                        className={`flex-1 py-0.5 text-[10px] rounded ${
                          (content.avatarSize || 32) === opt.size ||
                          (![28, 34, 42].includes(content.avatarSize) && opt.size === 34)
                            ? 'bg-primary text-white font-medium'
                            : 'text-secondary hover:text-onSurface'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-secondary">Online Green Dot Badge</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.showStatusDot !== false}
                    onChange={(e) => updateContent({ showStatusDot: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CTA & EXTRAS */}
      {activeTab === 'actions' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {/* CTA Action Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-secondary font-medium flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-primary" />
                <span>Call-to-Action (CTA) Button</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCta}
                  onChange={(e) => updateContent({ showCta: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {showCta && (
              <div className="space-y-2 bg-muted/40 p-2.5 rounded-lg border border-border">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.ctaText ?? 'Get Started'}
                    placeholder="e.g. Sign Up / Contact"
                    onChange={(e) => updateContent({ ctaText: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-2.5 py-1.5 text-xs text-onSurface outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-secondary block mb-1">Button Link URL</label>
                  <input
                    type="text"
                    value={content.ctaUrl ?? '#'}
                    placeholder="#signup or https://..."
                    onChange={(e) => updateContent({ ctaUrl: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-2.5 py-1 text-xs text-onSurface outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-secondary block mb-1">Button Style</label>
                  <div className="flex border border-border rounded bg-surface p-0.5">
                    {[
                      { id: 'primary', label: 'Solid' },
                      { id: 'outline', label: 'Outline' },
                      { id: 'subtle', label: 'Subtle' }
                    ].map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => updateContent({ ctaVariant: variant.id })}
                        className={`flex-1 py-0.5 text-[10px] rounded ${
                          (content.ctaVariant || 'primary') === variant.id
                            ? 'bg-primary text-white font-medium'
                            : 'text-secondary hover:text-onSurface'
                        }`}
                      >
                        {variant.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Bar */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-secondary font-medium flex items-center gap-1.5">
                <Search className="w-3 h-3 text-primary" />
                <span>Quick Search Bar</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSearch}
                  onChange={(e) => updateContent({ showSearch: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {showSearch && (
              <div className="bg-muted/40 p-2.5 rounded-lg border border-border">
                <label className="text-[10px] text-secondary block mb-1">Placeholder Text</label>
                <input
                  type="text"
                  value={content.searchPlaceholder ?? 'Search components...'}
                  placeholder="e.g. Search documentation..."
                  onChange={(e) => updateContent({ searchPlaceholder: e.target.value })}
                  className="w-full bg-surface border border-border rounded px-2.5 py-1 text-xs text-onSurface outline-none focus:border-primary"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
