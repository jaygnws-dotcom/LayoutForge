import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  LayoutGrid, Plus, X, Sparkles, Check, ArrowRight,
  Maximize2, Box, Layers, Star, Award, Image as ImageIcon
} from 'lucide-react';
import { Button, IconButton, Chip } from '@mui/material';

interface StitchBlocksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StitchBlocksModal({ isOpen, onClose }: StitchBlocksModalProps) {
  const { elements, pageSettings } = useProjectStore();

  if (!isOpen) return null;

  // Find lowest element Y to insert new block below existing content
  const maxY = elements.reduce((max: number, el: any) => Math.max(max, (el.y || 0) + (el.height || 0)), 40);
  const insertY = maxY + 40;

  const handleInsertBlock = (blockType: string) => {
    useProjectStore.getState().pushHistory();

    if (blockType === 'bento_grid') {
      const card1Id = `el_bento_c1_${Date.now()}`;
      const card2Id = `el_bento_c2_${Date.now()}`;

      const newBlocks: any[] = [
        // Bento Card 1 (Wide)
        {
          id: card1Id,
          type: 'card',
          name: 'Bento Card Large',
          parentId: null,
          x: 120,
          y: insertY,
          width: 760,
          height: 280,
          styles: {
            backgroundColor: '#FFFFFF',
            borderColor: '#E6E1D8',
            borderWidth: 1,
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: { top: 28, right: 28, bottom: 28, left: 28 }
          }
        },
        {
          id: `el_bento_t1_${Date.now()}`,
          type: 'heading',
          name: 'Bento Title 1',
          parentId: card1Id,
          x: 150,
          y: insertY + 30,
          width: 700,
          height: 40,
          content: { text: 'Editorial Space & Minimal Geometry' },
          styles: { fontSize: 24, fontWeight: '600', color: '#1A1A18', textAlign: 'left' }
        },
        {
          id: `el_bento_p1_${Date.now()}`,
          type: 'text',
          name: 'Bento Subtitle 1',
          parentId: card1Id,
          x: 150,
          y: insertY + 80,
          width: 680,
          height: 60,
          content: { text: 'Crafting spaces with generous natural light, tactile sandstone, and clean linear dividers.' },
          styles: { fontSize: 15, color: '#66635D', textAlign: 'left', lineHeight: 1.6 }
        },
        // Bento Card 2 (Side Column)
        {
          id: card2Id,
          type: 'card',
          name: 'Bento Card Side',
          parentId: null,
          x: 910,
          y: insertY,
          width: 410,
          height: 280,
          styles: {
            backgroundColor: '#FAF8F5',
            borderColor: '#E6E1D8',
            borderWidth: 1,
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: { top: 28, right: 28, bottom: 28, left: 28 }
          }
        },
        {
          id: `el_bento_t2_${Date.now()}`,
          type: 'heading',
          name: 'Bento Title 2',
          parentId: card2Id,
          x: 935,
          y: insertY + 30,
          width: 360,
          height: 36,
          content: { text: '18 Years of Awards' },
          styles: { fontSize: 20, fontWeight: '600', color: '#B4573A', textAlign: 'left' }
        },
        {
          id: `el_bento_p2_${Date.now()}`,
          type: 'text',
          name: 'Bento Subtitle 2',
          parentId: card2Id,
          x: 935,
          y: insertY + 75,
          width: 350,
          height: 60,
          content: { text: 'Recognized by RIBA, Dezeen Awards, and ArchDaily for residential excellence.' },
          styles: { fontSize: 14, color: '#66635D', textAlign: 'left', lineHeight: 1.5 }
        }
      ];

      useProjectStore.setState((state: any) => ({
        elements: [...state.elements, ...newBlocks],
        selectedElementIds: [card1Id, card2Id]
      }));
    } else if (blockType === 'stats_bar') {
      const barId = `el_stats_bar_${Date.now()}`;
      const stats = [
        { label: 'COMPLETED PROJECTS', val: '140+' },
        { label: 'GLOBAL AWARDS', val: '18' },
        { label: 'STUDIO CRAFTSMEN', val: '32' },
        { label: 'CLIENT RATING', val: '4.98' }
      ];

      const elementsToAdd: any[] = [
        {
          id: barId,
          type: 'card',
          name: 'Stats Banner',
          parentId: null,
          x: 120,
          y: insertY,
          width: 1200,
          height: 120,
          styles: {
            backgroundColor: '#FFFFFF',
            borderColor: '#E6E1D8',
            borderWidth: 1,
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }
        }
      ];

      stats.forEach((st, idx) => {
        elementsToAdd.push({
          id: `el_st_val_${Date.now()}_${idx}`,
          type: 'heading',
          name: `Stat ${idx + 1}`,
          parentId: barId,
          x: 160 + idx * 290,
          y: insertY + 24,
          width: 240,
          height: 44,
          content: { text: st.val },
          styles: { fontSize: 32, fontWeight: '700', color: '#1A1A18', textAlign: 'center' }
        });
        elementsToAdd.push({
          id: `el_st_lbl_${Date.now()}_${idx}`,
          type: 'label',
          name: `Stat Label ${idx + 1}`,
          parentId: barId,
          x: 160 + idx * 290,
          y: insertY + 72,
          width: 240,
          height: 24,
          content: { text: st.label },
          styles: { fontSize: 11, fontWeight: '600', color: '#B4573A', textAlign: 'center', letterSpacing: 1.5 }
        });
      });

      useProjectStore.setState((state: any) => ({
        elements: [...state.elements, ...elementsToAdd],
        selectedElementIds: [barId]
      }));
    } else if (blockType === 'testimonial') {
      const cardId = `el_test_c_${Date.now()}`;
      const testimonialElements: any[] = [
        {
          id: cardId,
          type: 'card',
          name: 'Client Testimonial Card',
          parentId: null,
          x: 270,
          y: insertY,
          width: 900,
          height: 220,
          styles: {
            backgroundColor: '#FAF8F5',
            borderColor: '#E6E1D8',
            borderWidth: 1,
            borderRadius: 20,
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            padding: { top: 32, right: 36, bottom: 32, left: 36 }
          }
        },
        {
          id: `el_quote_${Date.now()}`,
          type: 'text',
          name: 'Quote Text',
          parentId: cardId,
          x: 310,
          y: insertY + 30,
          width: 820,
          height: 80,
          content: { text: '“Atelier Verra completely redefined our living experience. Their attention to natural stone, quiet proportion, and effortless flow created a sanctuary we cherish daily.”' },
          styles: { fontSize: 18, color: '#1A1A18', textAlign: 'center', lineHeight: 1.6, fontStyle: 'italic' }
        },
        {
          id: `el_author_${Date.now()}`,
          type: 'label',
          name: 'Author Name',
          parentId: cardId,
          x: 310,
          y: insertY + 125,
          width: 820,
          height: 30,
          content: { text: '— Marcus & Elena Vance, Villa Serena Residence (2024)' },
          styles: { fontSize: 13, fontWeight: '600', color: '#B4573A', textAlign: 'center' }
        }
      ];

      useProjectStore.setState((state: any) => ({
        elements: [...state.elements, ...testimonialElements],
        selectedElementIds: [cardId]
      }));
    }

    useProjectStore.getState().saveToStorage();
    onClose();
  };

  const BLOCKS = [
    {
      id: 'bento_grid',
      title: 'Architectural Bento Grid',
      desc: 'Asymmetric 2-column showcase with wide primary card and accent side spotlight.',
      badge: 'Bento Grid',
      icon: LayoutGrid
    },
    {
      id: 'stats_bar',
      title: 'Metrics & Awards Counter Bar',
      desc: '4-column high-impact stats counter strip with bold numbers and uppercase track labels.',
      badge: 'Stats Strip',
      icon: Award
    },
    {
      id: 'testimonial',
      title: 'Curated Editorial Testimonial',
      desc: 'Generous centered quote card with italicized typography and client attribution.',
      badge: 'Social Proof',
      icon: Star
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="min-h-16 py-2 border-b border-border px-4 sm:px-6 flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-onSurface">Stitch UI Blocks</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  Pre-built UI
                </span>
              </div>
              <p className="hidden sm:block text-xs text-secondary mt-0.5">
                Insert high-fidelity agency blocks into the active artboard with 1-click
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

        {/* Blocks Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {BLOCKS.map(b => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                onClick={() => handleInsertBlock(b.id)}
                className="p-5 rounded-xl border border-border bg-surface hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted text-secondary">
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-onSurface mb-1.5 group-hover:text-blue-600 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-secondary leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Insert Block</span>
                  <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
