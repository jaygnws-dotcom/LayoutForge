import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Sparkles, ArrowRight, Check, LayoutGrid, Award,
  Palette, RefreshCw, Wand2, Maximize2
} from 'lucide-react';
import { STITCH_VIBES } from '../../types/vibes';
import { applyVibeTheme } from '../../engine/vibeEngine';
import { generateLayoutFromPrompt } from '../../engine/aiLayoutEngine';

interface StitchCommandBarProps {
  onOpenVibes: () => void;
  onOpenCritique: () => void;
  onOpenBlocks: () => void;
}

export default function StitchCommandBar({
  onOpenVibes,
  onOpenCritique,
  onOpenBlocks
}: StitchCommandBarProps) {
  const { elements, pageSettings, applyAiGeneratedLayout } = useProjectStore();

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const handleExecuteCommand = (commandText: string = input) => {
    const rawCmd = (commandText || input).trim();
    if (!rawCmd) return;

    setIsProcessing(true);
    const cmd = rawCmd.toLowerCase();

    setTimeout(() => {
      try {
        const store = useProjectStore.getState();
        store.pushHistory();

        let feedback = `Executed: "${rawCmd}"`;

        // Case 1: Centering / Alignment
        if (cmd === 'center all' || cmd === 'center' || cmd.includes('center all elements') || cmd.includes('center layout')) {
          const artboardWidth = store.pageSettings.pageWidth || 1440;
          const updated = store.elements.map((el: any) => {
            if (el.locked) return el;
            return {
              ...el,
              x: Math.max(20, Math.round((artboardWidth - (el.width || 300)) / 2)),
              styles: {
                ...el.styles,
                textAlign: ['heading', 'text', 'label', 'badge', 'button'].includes(el.type)
                  ? 'center'
                  : el.styles?.textAlign
              }
            };
          });

          useProjectStore.setState((state: any) => {
            const updatedPages = state.pages.map((p: any) =>
              p.id === state.activePageId ? { ...p, elements: updated } : p
            );
            return { elements: updated, pages: updatedPages };
          });
          feedback = 'Centered all canvas elements and text';
        }
        // Case 2: Any Stitch Vibe matching keyword or explicit vibe selection
        else if (
          cmd.includes('vibe') ||
          cmd.includes('linear dark') || cmd === 'dark' || cmd === 'dark mode' || cmd.includes('obsidian') ||
          cmd.includes('atelier') || cmd.includes('terracotta') || cmd.includes('warm off-white') ||
          cmd.includes('nordic') || cmd.includes('botanical') || cmd.includes('olive') || cmd.includes('sage') ||
          cmd.includes('cyberpunk') || cmd.includes('neon') ||
          cmd.includes('kyoto') || cmd.includes('zen') ||
          cmd.includes('editorial') || cmd.includes('serif') ||
          cmd.includes('glass') ||
          cmd.includes('champagne') ||
          cmd.includes('sunset') ||
          cmd.includes('tokyo') ||
          cmd.includes('swiss') || cmd.includes('brutalist') ||
          cmd.includes('lofi') || cmd.includes('paper') ||
          cmd.includes('retro') ||
          cmd.includes('aurora')
        ) {
          const matchingVibe = STITCH_VIBES.find(v => {
            const vName = v.name.toLowerCase();
            const vId = v.id.replace('_', ' ');
            if (cmd.includes(vId) || cmd.includes(vName)) return true;
            if ((cmd.includes('dark') || cmd.includes('obsidian')) && v.id === 'linear_dark') return true;
            if ((cmd.includes('atelier') || cmd.includes('terracotta')) && v.id === 'atelier_studio') return true;
            if ((cmd.includes('nordic') || cmd.includes('botanical') || cmd.includes('sage')) && v.id === 'nordic_botanical') return true;
            if ((cmd.includes('cyberpunk') || cmd.includes('neon')) && v.id === 'cyberpunk_neon') return true;
            if ((cmd.includes('kyoto') || cmd.includes('zen')) && v.id === 'kyoto_zen') return true;
            if (cmd.includes('editorial') && v.id === 'editorial_serif') return true;
            if ((cmd.includes('glass') || cmd.includes('frosted')) && v.id === 'frosted_glass') return true;
            if ((cmd.includes('gradient') || cmd.includes('cosmic')) && v.id === 'cosmic_gradient') return true;
            if (cmd.includes('champagne') && v.id === 'midnight_champagne') return true;
            if (cmd.includes('sunset') && v.id === 'sunset_gradient') return true;
            if (cmd.includes('tokyo') && v.id === 'tokyo_electric') return true;
            if ((cmd.includes('swiss') || cmd.includes('brutalist')) && v.id === 'swiss_brutalist') return true;
            if ((cmd.includes('lofi') || cmd.includes('paper')) && v.id === 'lofi_paper') return true;
            if (cmd.includes('retro') && v.id === 'neo_retro') return true;
            if (cmd.includes('aurora') && v.id === 'aurora_borealis') return true;
            return false;
          }) || STITCH_VIBES[0];

          const { elements: nextEl, pageSettings: nextSet } = applyVibeTheme(matchingVibe, store.elements, store.pageSettings);
          useProjectStore.setState((state: any) => {
            const updatedPages = state.pages.map((p: any) =>
              p.id === state.activePageId ? { ...p, elements: nextEl, pageSettings: nextSet } : p
            );
            return { elements: nextEl, pageSettings: nextSet, pages: updatedPages };
          });
          useProjectStore.getState().saveToStorage();
          feedback = `Applied ${matchingVibe.name} theme (background: ${matchingVibe.colors.background})`;
        }
        // Case 3: Explicit Background Color commands
        else if (cmd.startsWith('background') || cmd.startsWith('bg ') || cmd.includes('change background') || cmd.includes('set background')) {
          const colorMatch = rawCmd.match(/#([0-9a-fA-F]{3,8})/i) || rawCmd.match(/\b(black|white|dark|slate|zinc|gray|red|blue|emerald|green|purple|beige|cream|sand)\b/i);
          let targetColor = '#FFFFFF';
          if (colorMatch) {
            const val = colorMatch[0].toLowerCase();
            const colorMap: Record<string, string> = {
              black: '#0A0A0C',
              dark: '#0B0C10',
              slate: '#0F172A',
              zinc: '#18181B',
              gray: '#1F2937',
              white: '#FFFFFF',
              beige: '#F6F3EE',
              cream: '#FAF8F5',
              sand: '#F5F2EB',
              emerald: '#064E3B',
              purple: '#1E1B4B',
              blue: '#0F172A'
            };
            targetColor = colorMap[val] || val;
          }
          const nextSet = { ...store.pageSettings, backgroundColor: targetColor, backgroundGradient: null, backgroundImage: null };
          useProjectStore.setState((state: any) => {
            const updatedPages = state.pages.map((p: any) =>
              p.id === state.activePageId ? { ...p, pageSettings: nextSet } : p
            );
            return { pageSettings: nextSet, pages: updatedPages };
          });
          useProjectStore.getState().saveToStorage();
          feedback = `Updated background color to ${targetColor}`;
        }
        // Case 5: Rounded / Pill corners
        else if (cmd.includes('round') || cmd.includes('pill') || cmd.includes('radius')) {
          const updated = store.elements.map((el: any) => {
            if (el.type === 'card' || el.type === 'container') {
              return { ...el, styles: { ...el.styles, borderRadius: 24 } };
            }
            if (el.type === 'button') {
              return { ...el, styles: { ...el.styles, borderRadius: 9999 } };
            }
            return el;
          });
          useProjectStore.setState((state: any) => {
            const updatedPages = state.pages.map((p: any) =>
              p.id === state.activePageId ? { ...p, elements: updated } : p
            );
            return { elements: updated, pages: updatedPages };
          });
          feedback = 'Applied rounded radius styling across cards and buttons';
        }
        // Case 6: Bento grid insertion
        else if (cmd.includes('bento') || cmd.includes('grid block')) {
          onOpenBlocks();
          feedback = 'Opening Bento Grid component builder';
        }
        // Case 7: Critique / Audit
        else if (cmd.includes('critique') || cmd.includes('audit') || cmd.includes('score')) {
          onOpenCritique();
          feedback = 'Opening AI Design Critique diagnostic';
        }
        // Case 8: Full AI Layout Generation (any prompt describing a site, studio, portfolio, etc.)
        else {
          // Parse with the AI Layout Engine!
          const result = generateLayoutFromPrompt(rawCmd, {
            append: false
          });

          if (result && Array.isArray(result.elements) && result.elements.length > 0) {
            applyAiGeneratedLayout({
              elements: result.elements,
              pageSettings: result.pageSettings,
              append: false,
              projectName: result.projectName || 'AI Generated Studio'
            });
            feedback = `Generated new design for "${result.projectName || rawCmd}"`;
          } else {
            // Fallback: Polish styling
            const updated = store.elements.map((el: any) => {
              if (el.type === 'card') {
                return {
                  ...el,
                  styles: {
                    ...el.styles,
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)'
                  }
                };
              }
              return el;
            });
            useProjectStore.setState({ elements: updated });
            feedback = `Applied style refinement: "${rawCmd}"`;
          }
        }

        useProjectStore.getState().saveToStorage();
        setLastFeedback(feedback);
        setInput('');
      } catch (err) {
        console.error('Ask Stitch error:', err);
        setLastFeedback('Error processing prompt. Please try again.');
      } finally {
        setIsProcessing(false);
        setTimeout(() => setLastFeedback(null), 3500);
      }
    }, 300);
  };

  const QUICK_PROMPTS = [
    { label: '🏛️ Atelier Vibe', action: () => handleExecuteCommand('atelier terracotta architecture') },
    { label: '✨ Center All', action: () => handleExecuteCommand('center all') },
    { label: '🌙 Obsidian Dark', action: () => handleExecuteCommand('linear dark') },
    { label: '🧱 Bento Layout', action: onOpenBlocks },
    { label: '🔍 AI Critique', action: onOpenCritique }
  ];

  const [isMinimizedOnMobile, setIsMinimizedOnMobile] = useState(false);

  return (
    <div className="fixed bottom-18 lg:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto max-w-[95vw]">
      {/* Feedback Toast */}
      {lastFeedback && (
        <div className="mb-2 bg-neutral-900/90 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate max-w-xs sm:max-w-sm">{lastFeedback}</span>
        </div>
      )}

      {isMinimizedOnMobile ? (
        <button
          type="button"
          onClick={() => setIsMinimizedOnMobile(false)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/95 backdrop-blur-xl border border-border shadow-lg text-xs font-semibold text-primary hover:bg-muted transition-all cursor-pointer ring-1 ring-black/5"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Ask Stitch AI</span>
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteCommand();
          }}
          className="bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-1.5 flex flex-col items-center transition-all w-[94vw] sm:w-auto min-w-0 sm:min-w-[440px] max-w-xl ring-1 ring-black/5"
        >
          <div className="flex items-center gap-2 w-full px-1.5 sm:px-2 py-1">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Stitch (e.g. 'Build architecture studio site', 'Center all')..."
              className="flex-1 bg-transparent text-xs text-onSurface outline-none placeholder:text-secondary/70 font-sans select-text min-w-0"
            />

            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-xs shrink-0"
              title="Execute Stitch Command"
            >
              {isProcessing ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Mobile Minimize button */}
            <button
              type="button"
              onClick={() => setIsMinimizedOnMobile(true)}
              className="lg:hidden p-1 text-secondary hover:text-onSurface rounded cursor-pointer"
              title="Minimize command bar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/50 w-full px-1 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={q.action}
                className="px-2.5 py-1 rounded-lg bg-muted/80 hover:bg-muted text-[11px] font-medium text-onSurface transition-colors whitespace-nowrap cursor-pointer hover:shadow-2xs"
              >
                {q.label}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
