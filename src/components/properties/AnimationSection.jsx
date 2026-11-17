import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { ANIMATION_EFFECTS } from '../../types/elements';
import { Play, Sparkles, Sliders, ArrowUpRight } from 'lucide-react';

export default function AnimationSection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const animation = element.animation || {
    effect: 'none',
    trigger: 'load',
    duration: 0.6,
    delay: 0,
    easing: 'ease-out',
    iterationCount: '1'
  };

  const hoverStyles = element.hoverStyles || {
    scale: 1.0,
    yShift: 0,
    boxShadow: '',
    backgroundColor: '',
    borderColor: ''
  };

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('entrance'); // 'entrance' | 'hover'

  const updateAnim = (fields) => {
    updateElementWithHistory(element.id, {
      animation: { ...animation, ...fields }
    });
  };

  const updateHover = (fields) => {
    updateElementWithHistory(element.id, {
      hoverStyles: { ...hoverStyles, ...fields }
    });
  };

  const handlePlayPreview = () => {
    setIsPlayingPreview(false);
    window.dispatchEvent(new CustomEvent('lf-preview-animation', { detail: { elementId: element.id } }));
    setTimeout(() => {
      setIsPlayingPreview(true);
      setTimeout(() => setIsPlayingPreview(false), ((animation.duration || 0.6) + (animation.delay || 0)) * 1000 + 200);
    }, 40);
  };

  return (
    <div className="p-3 border-b border-border space-y-3 bg-surface">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
          Motion & Micro-Interactions
        </span>
        {activeTab === 'entrance' && (
          <button
            onClick={handlePlayPreview}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-accentSoft hover:bg-primary text-primary hover:text-white text-[11px] font-medium border border-primary/30 transition-colors cursor-pointer"
            title="Play animation preview"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Play</span>
          </button>
        )}
      </div>

      {/* Tabs: Entrance vs Hover */}
      <div className="flex bg-muted p-0.5 rounded-lg border border-border text-xs">
        <button
          onClick={() => setActiveTab('entrance')}
          className={`flex-1 py-1 rounded font-medium text-center transition-colors ${
            activeTab === 'entrance' ? 'bg-surface text-primary font-bold shadow-xs' : 'text-secondary hover:text-onSurface'
          }`}
        >
          Entrance Reveal
        </button>
        <button
          onClick={() => setActiveTab('hover')}
          className={`flex-1 py-1 rounded font-medium text-center transition-colors ${
            activeTab === 'hover' ? 'bg-surface text-primary font-bold shadow-xs' : 'text-secondary hover:text-onSurface'
          }`}
        >
          :hover Micro-State
        </button>
      </div>

      {activeTab === 'entrance' ? (
        <>
          {animation.effect !== 'none' && (
            <div className="h-12 bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden">
              <div
                className={`px-3 py-1 rounded-md bg-primary text-white text-xs font-semibold shadow-xs ${
                  isPlayingPreview ? `anim-${animation.effect}` : ''
                }`}
                style={{
                  animationDuration: `${animation.duration || 0.6}s`,
                  animationTimingFunction: animation.easing || 'ease-out',
                  animationIterationCount: animation.iterationCount || '1'
                }}
              >
                {element.name || 'Sample Preview'}
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] text-secondary block mb-1">Effect Preset</label>
            <select
              value={animation.effect || 'none'}
              onChange={(e) => {
                const newEffect = e.target.value;
                updateAnim({ effect: newEffect });
                if (newEffect !== 'none') {
                  window.dispatchEvent(new CustomEvent('lf-preview-animation', { detail: { elementId: element.id } }));
                  setIsPlayingPreview(false);
                  setTimeout(() => {
                    setIsPlayingPreview(true);
                    setTimeout(() => setIsPlayingPreview(false), (animation.duration || 0.6) * 1000 + 200);
                  }, 40);
                }
              }}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            >
              {ANIMATION_EFFECTS.map((eff) => (
                <option key={eff.id} value={eff.id}>{eff.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-secondary block mb-1">Trigger Event</label>
              <select
                value={animation.trigger || 'load'}
                onChange={(e) => updateAnim({ trigger: e.target.value })}
                className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
              >
                <option value="load">On Page Load</option>
                <option value="scroll">On Scroll into View</option>
                <option value="hover">On Hover</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-secondary block mb-1">Iterations</label>
              <select
                value={animation.iterationCount || '1'}
                onChange={(e) => updateAnim({ iterationCount: e.target.value })}
                className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
              >
                <option value="1">1 Time</option>
                <option value="2">2 Times</option>
                <option value="3">3 Times</option>
                <option value="infinite">Infinite Loop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-secondary block mb-1">Duration (s)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={animation.duration || 0.6}
                onChange={(e) => updateAnim({ duration: parseFloat(e.target.value) || 0.6 })}
                className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[10px] text-secondary block mb-1">Delay (s)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={animation.delay || 0}
                onChange={(e) => updateAnim({ delay: parseFloat(e.target.value) || 0 })}
                className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
              />
            </div>
          </div>
        </>
      ) : (
        /* Hover Micro-State Controls */
        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-secondary">Hover Scale</label>
              <span className="text-[10px] font-mono text-primary">{hoverStyles.scale || 1.0}x</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'None', val: 1.0 },
                { label: 'Subtle (1.02x)', val: 1.02 },
                { label: 'Lift (1.04x)', val: 1.04 },
                { label: 'Pop (1.08x)', val: 1.08 }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateHover({ scale: opt.val })}
                  className={`py-1 text-[10px] rounded border transition-colors ${
                    (hoverStyles.scale || 1.0) === opt.val
                      ? 'bg-primary text-white border-primary font-bold'
                      : 'bg-muted text-secondary border-border hover:text-onSurface'
                  }`}
                >
                  {opt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-secondary">Hover Vertical Lift</label>
              <span className="text-[10px] font-mono text-primary">{hoverStyles.yShift || 0}px</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: '0px', val: 0 },
                { label: '-2px', val: -2 },
                { label: '-4px', val: -4 },
                { label: '-8px', val: -8 }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => updateHover({ yShift: opt.val })}
                  className={`py-1 text-[10px] rounded border transition-colors ${
                    (hoverStyles.yShift || 0) === opt.val
                      ? 'bg-primary text-white border-primary font-bold'
                      : 'bg-muted text-secondary border-border hover:text-onSurface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-secondary block mb-1">Hover Shadow Elevation</label>
            <select
              value={hoverStyles.boxShadow || ''}
              onChange={(e) => updateHover({ boxShadow: e.target.value })}
              className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-onSurface outline-none focus:border-primary"
            >
              <option value="">Keep Normal Shadow</option>
              <option value="0 6px 16px -2px rgba(0, 0, 0, 0.08)">Soft Lift (6px)</option>
              <option value="0 12px 28px -4px rgba(0, 0, 0, 0.12)">Floating (12px)</option>
              <option value="0 20px 38px -6px rgba(0, 0, 0, 0.16)">Deep Layered (20px)</option>
              <option value="0 0 20px rgba(37, 99, 235, 0.3)">Primary Glow</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
