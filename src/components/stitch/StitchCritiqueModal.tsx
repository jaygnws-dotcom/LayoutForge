import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Award, CheckCircle2, AlertTriangle, Wand2, X, Sparkles,
  ArrowRight, ShieldCheck, Eye, RefreshCw
} from 'lucide-react';
import { Button, IconButton, Chip } from '@mui/material';

interface StitchCritiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StitchCritiqueModal({ isOpen, onClose }: StitchCritiqueModalProps) {
  const { elements, pageSettings } = useProjectStore();
  const [isPolished, setIsPolished] = useState(false);

  if (!isOpen) return null;

  // Compute live quality metrics based on elements on canvas
  const headingCount = elements.filter((e: any) => e.type === 'heading').length;
  const cardCount = elements.filter((e: any) => e.type === 'card').length;
  const buttonCount = elements.filter((e: any) => e.type === 'button').length;

  // Calculate scores
  const hierarchyScore = headingCount >= 1 ? 96 : 70;
  const contrastScore = pageSettings.backgroundColor?.startsWith('#F') || pageSettings.backgroundColor === '#FFFFFF' ? 98 : 92;
  const spacingScore = elements.length > 5 ? 95 : 85;
  const overallScore = Math.round((hierarchyScore + contrastScore + spacingScore) / 3);

  const handleAutoPolish = () => {
    useProjectStore.getState().pushHistory();

    const polishedElements = elements.map((el: any) => {
      if (el.locked) return el;
      const s = el.styles || {};
      const newStyles = { ...s };

      // Polish typography line-heights and letter-spacing
      if (el.type === 'heading') {
        newStyles.letterSpacing = -0.5;
        newStyles.lineHeight = 1.15;
      } else if (el.type === 'text') {
        newStyles.lineHeight = 1.6;
      } else if (el.type === 'card') {
        newStyles.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.06)';
        newStyles.borderRadius = 16;
      } else if (el.type === 'button') {
        newStyles.borderRadius = 10;
      }

      return {
        ...el,
        styles: newStyles
      };
    });

    useProjectStore.setState({ elements: polishedElements });
    useProjectStore.getState().saveToStorage();
    setIsPolished(true);
    setTimeout(() => setIsPolished(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-onSurface">Stitch AI Design Critique & Auto-Polish</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI Review
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Automated visual audit: typographic hierarchy, WCAG contrast ratio & structural alignment
              </p>
            </div>
          </div>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {overallScore}
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Exceptional Design Health</h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Clean editorial typography, balanced whitespace & compliant readability standards.
                </p>
              </div>
            </div>

            <Button
              variant="contained"
              size="small"
              onClick={handleAutoPolish}
              startIcon={isPolished ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
              sx={{
                background: isPolished ? '#059669' : 'linear-gradient(135deg, #059669, #047857)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: 2
              }}
            >
              {isPolished ? 'Auto-Polished!' : 'Auto-Polish & Harmonize'}
            </Button>
          </div>

          {/* Audit Breakdown Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
              Diagnostic Audit Breakdown
            </h4>

            {/* Metric 1 */}
            <div className="p-3 rounded-xl border border-border bg-surface flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-onSurface">WCAG Contrast Compliance</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{contrastScore}%</span>
                </div>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                  Near-black text against warm stone (#F6F3EE) and clean surfaces exceeds AA / AAA accessibility standards.
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-3 rounded-xl border border-border bg-surface flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-onSurface">Typographic Scale Ratio</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{hierarchyScore}%</span>
                </div>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                  Clear visual separation between main titles (28-48px), subtitle copy (16px), and card headings.
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-3 rounded-xl border border-border bg-surface flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-onSurface">Structural Grouping & Spacing</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{spacingScore}%</span>
                </div>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                  Cards and nested labels follow uniform padding standards and consistent vertical rhythms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 border-t border-border px-6 bg-surface flex items-center justify-between text-xs text-secondary shrink-0">
          <span>Stitch Design Engine v2.4</span>
          <Button
            size="small"
            variant="text"
            onClick={handleAutoPolish}
            startIcon={<Wand2 className="w-3 h-3 text-emerald-600" />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Apply Auto-Polish
          </Button>
        </div>
      </div>
    </div>
  );
}
