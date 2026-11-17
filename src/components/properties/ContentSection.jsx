import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Upload, Plus, Trash2, Link as LinkIcon, MoveUp, MoveDown, ListChecks } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import NavbarContentEditor from './NavbarContentEditor';

const COMMON_ICONS = [
  'Zap', 'Sparkles', 'Check', 'Shield', 'Star', 'Heart', 'Smile', 'ArrowRight',
  'ChevronRight', 'Globe', 'Play', 'Code', 'Layers', 'Box', 'Cloud', 'Lock'
];

export default function ContentSection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const { type, content = {} } = element;

  const updateContent = (fields) => {
    updateElementWithHistory(element.id, {
      content: { ...content, ...fields }
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateContent({ src: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Element Content
      </div>

      {['heading', 'text', 'label', 'button', 'badge'].includes(type) && (
        <div className="space-y-2">
          {type === 'heading' && (
            <div>
              <label className="text-[10px] text-secondary block mb-1">Heading Level</label>
              <select
                value={content.tag || 'h1'}
                onChange={(e) => updateContent({ tag: e.target.value })}
                className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
              >
                <option value="h1">H1 - Main Title</option>
                <option value="h2">H2 - Section Title</option>
                <option value="h3">H3 - Subsection Title</option>
                <option value="h4">H4 - Card Title</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] text-secondary block mb-1">Text Content</label>
            {type === 'text' ? (
              <textarea
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                rows={3}
                className="w-full bg-muted border border-border rounded p-2 text-xs text-onSurface outline-none resize-none focus:border-primary"
              />
            ) : (
              <input
                type="text"
                value={content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
              />
            )}
          </div>

          {type === 'button' && (
            <div>
              <label className="text-[10px] text-secondary block mb-1">Link URL</label>
              <div className="flex items-center bg-muted border border-border rounded px-2 py-1">
                <LinkIcon className="w-3 h-3 text-secondary mr-1.5" />
                <input
                  type="text"
                  value={content.url || ''}
                  placeholder="https://example.com"
                  onChange={(e) => updateContent({ url: e.target.value })}
                  className="bg-transparent w-full text-onSurface outline-none text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {type === 'image' && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-secondary block mb-1">Image URL</label>
            <input
              type="text"
              value={content.src || ''}
              placeholder="https://..."
              onChange={(e) => updateContent({ src: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] text-secondary block mb-1">Upload Local Image</label>
            <label className="flex items-center justify-center gap-2 w-full py-2 bg-muted hover:bg-accentSoft border border-dashed border-border hover:border-primary rounded-lg cursor-pointer text-xs text-primary transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Image (Extracted in ZIP)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="text-[10px] text-secondary block mb-1">Alt Text</label>
            <input
              type="text"
              value={content.alt || ''}
              placeholder="Descriptive image alt..."
              onChange={(e) => updateContent({ alt: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {type === 'video' && (
        <div>
          <label className="text-[10px] text-secondary block mb-1">Embed URL (YouTube/MP4)</label>
          <input
            type="text"
            value={content.videoUrl || ''}
            placeholder="https://www.youtube.com/embed/..."
            onChange={(e) => updateContent({ videoUrl: e.target.value })}
            className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
          />
        </div>
      )}

      {type === 'icon' && (
        <div>
          <label className="text-[10px] text-secondary block mb-1">Icon Selection</label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted border border-border rounded-lg max-h-36 overflow-y-auto">
            {COMMON_ICONS.map((iconKey) => {
              const IconComp = LucideIcons[iconKey] || LucideIcons.Zap;
              const isSelected = content.iconName === iconKey;
              return (
                <button
                  key={iconKey}
                  onClick={() => updateContent({ iconName: iconKey })}
                  className={`p-2 rounded flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary text-white shadow-xs' : 'hover:bg-surface text-secondary hover:text-onSurface'
                  }`}
                  title={iconKey}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {['input', 'textarea'].includes(type) && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-secondary block mb-1">Field Label</label>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => updateContent({ label: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[10px] text-secondary block mb-1">Placeholder</label>
            <input
              type="text"
              value={content.placeholder || ''}
              onChange={(e) => updateContent({ placeholder: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {['select', 'radiogroup'].includes(type) && (
        <div className="space-y-2">
          <label className="text-[10px] text-secondary block mb-1">Choices / Options</label>
          <div className="space-y-1">
            {(content.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...content.options];
                    newOpts[idx] = e.target.value;
                    updateContent({ options: newOpts });
                  }}
                  className="flex-1 bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
                />
                <button
                  onClick={() => {
                    const newOpts = content.options.filter((_, i) => i !== idx);
                    updateContent({ options: newOpts });
                  }}
                  className="p-1 hover:text-error text-secondary"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOpts = [...(content.options || []), `Option ${(content.options?.length || 0) + 1}`];
                updateContent({ options: newOpts });
              }}
              className="flex items-center gap-1 text-[11px] text-primary hover:text-blue-700 py-1 font-medium"
            >
              <Plus className="w-3 h-3" /> Add Choice
            </button>
          </div>
        </div>
      )}

      {type === 'list' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-secondary block mb-1">List Marker Style</label>
            <div className="flex border border-border rounded bg-muted p-0.5">
              {[
                { id: 'check', label: 'Checkmark' },
                { id: 'bullet', label: 'Bullet' },
                { id: 'numbered', label: 'Numbered' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => updateContent({ listType: m.id })}
                  className={`flex-1 py-1 text-[10px] rounded transition-colors ${
                    (content.listType || 'check') === m.id
                      ? 'bg-primary text-white font-medium shadow-xs'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-secondary font-medium uppercase tracking-wider">
                List Items ({(content.items || []).length})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentItems = content.items || ['New item'];
                  updateContent({ items: [...currentItems, `List item ${currentItems.length + 1}`] });
                }}
                className="flex items-center gap-1 text-[10px] text-primary hover:text-blue-700 font-medium"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
              {(content.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="w-4 text-[10px] text-secondary font-mono text-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[idx] = e.target.value;
                      updateContent({ items: newItems });
                    }}
                    className="flex-1 bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      const temp = newItems[idx];
                      newItems[idx] = newItems[idx - 1];
                      newItems[idx - 1] = temp;
                      updateContent({ items: newItems });
                    }}
                    className="p-1 text-secondary hover:text-onSurface disabled:opacity-30 rounded hover:bg-muted"
                    title="Move up"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === (content.items || []).length - 1}
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      const temp = newItems[idx];
                      newItems[idx] = newItems[idx + 1];
                      newItems[idx + 1] = temp;
                      updateContent({ items: newItems });
                    }}
                    className="p-1 text-secondary hover:text-onSurface disabled:opacity-30 rounded hover:bg-muted"
                    title="Move down"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = (content.items || []).filter((_, i) => i !== idx);
                      updateContent({ items: newItems });
                    }}
                    className="p-1 hover:text-error text-secondary rounded hover:bg-red-50"
                    title="Delete item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'checkbox' && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-secondary block mb-1">Checkbox Label</label>
            <input
              type="text"
              value={content.label || ''}
              placeholder="Checkbox label..."
              onChange={(e) => updateContent({ label: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-secondary">Default Checked</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={content.checked ?? true}
                onChange={(e) => updateContent({ checked: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-7 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      )}

      {type === 'navbar' && (
        <NavbarContentEditor element={element} updateContent={updateContent} />
      )}

      {type === 'footer' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-secondary block mb-1">Brand / Footer Title</label>
            <input
              type="text"
              value={content.brandText || 'LayoutForge'}
              onChange={(e) => updateContent({ brandText: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[10px] text-secondary block mb-1">Copyright Notice</label>
            <input
              type="text"
              value={content.copyright || ''}
              onChange={(e) => updateContent({ copyright: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-secondary">Footer Links</label>
              <button
                type="button"
                onClick={() => {
                  const newLinks = [...(content.links || ['Privacy', 'Terms', 'Support']), `Link ${(content.links?.length || 0) + 1}`];
                  updateContent({ links: newLinks });
                }}
                className="flex items-center gap-1 text-[10px] text-primary hover:text-blue-700"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>
            <div className="space-y-1">
              {(content.links || ['Privacy', 'Terms', 'Support']).map((link, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={typeof link === 'string' ? link : (link.label || `Link ${idx + 1}`)}
                    onChange={(e) => {
                      const newLinks = [...(content.links || [])];
                      newLinks[idx] = e.target.value;
                      updateContent({ links: newLinks });
                    }}
                    className="flex-1 bg-muted border border-border rounded px-2 py-0.5 text-xs text-onSurface outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = (content.links || []).filter((_, i) => i !== idx);
                      updateContent({ links: newLinks });
                    }}
                    className="p-1 hover:text-error text-secondary"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'divider' && (
        <div className="text-xs text-secondary bg-muted/40 p-2.5 rounded-lg border border-border">
          <span className="font-medium text-onSurface block mb-1">Horizontal Divider Line</span>
          <span>Use the <strong>Border & Shadows</strong> section below to customize line color, thickness, and style.</span>
        </div>
      )}

      {['container', 'card'].includes(type) && (
        <div className="text-xs text-secondary bg-muted/40 p-2.5 rounded-lg border border-border">
          <span className="font-medium text-onSurface block mb-1">
            {type === 'container' ? 'Container Dropzone' : 'Card Surface Box'}
          </span>
          <span>Grouping container for nested elements. Customize dimensions, background, border, and shadows below.</span>
        </div>
      )}
    </div>
  );
}
