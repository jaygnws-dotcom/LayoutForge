import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { CanvasElement } from '../../types';
import {
  Sparkles, X, Wand2, Copy, Check, ArrowRight, RefreshCw,
  Palette, Sliders, Type, Zap
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent
} from '@mui/material';

interface AiElementAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiElementAssistantModal({
  isOpen,
  onClose
}: AiElementAssistantModalProps) {
  const { elements, selectedElementIds, updateElementWithHistory, addElement } = useProjectStore();

  const selectedElement = elements.find((el: CanvasElement) => selectedElementIds.includes(el.id)) || elements[0];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !selectedElement) return null;

  const currentText = selectedElement.content?.text || selectedElement.name || 'Component';

  // Smart Context-Aware Copy Suggestions based on element type and current text
  const copySuggestions = [
    {
      id: 'luxury',
      label: '✨ Luxury & Editorial',
      desc: 'Evocative, timeless tone for design & architecture',
      text: selectedElement.type === 'heading'
        ? 'Architecture of Quiet Permanence & Spatial Silence'
        : selectedElement.type === 'button'
        ? 'Explore Monograph'
        : 'Monolithic spaces sculpted from stone, timber, and filtered natural light.'
    },
    {
      id: 'punchy',
      label: '⚡ High-Converting & Punchy',
      desc: 'Action-oriented, confident, and direct',
      text: selectedElement.type === 'heading'
        ? 'Design Faster. Build Better. Ship Without Limits.'
        : selectedElement.type === 'button'
        ? 'Start Building Free →'
        : 'Zero dependencies, instant responsive clustering, and pure production-ready code.'
    },
    {
      id: 'enterprise',
      label: '🏢 Enterprise B2B',
      desc: 'Credible, metrics-backed, professional',
      text: selectedElement.type === 'heading'
        ? 'Enterprise-Grade Visual Systems for High-Growth Teams'
        : selectedElement.type === 'button'
        ? 'Schedule Platform Demo'
        : 'Trusted by over 1,200 design engineering teams to accelerate digital production.'
    },
    {
      id: 'minimal',
      label: '🎯 Ultra-Minimal & Clean',
      desc: 'Concise, essential, distraction-free',
      text: selectedElement.type === 'heading'
        ? 'Form Meets Purpose'
        : selectedElement.type === 'button'
        ? 'View Work'
        : 'Precision crafted interfaces.'
    }
  ];

  // Smart Style Presets
  const styleSuggestions = [
    {
      id: 'elevated',
      label: 'Elevated Soft Depth',
      desc: 'Subtle 1px border with layered soft shadow and rounded corners',
      styles: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'solid',
        boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)'
      }
    },
    {
      id: 'brutalist',
      label: 'Neo-Brutalist High-Contrast',
      desc: 'Crisp 2px black border with sharp offset shadow',
      styles: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#0F172A',
        borderStyle: 'solid',
        boxShadow: '4px 4px 0px #0F172A'
      }
    },
    {
      id: 'terracotta',
      label: 'Warm Terracotta Accent',
      desc: 'Studio earth tone palette with warm glow',
      styles: {
        backgroundColor: '#B4573A',
        color: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 0,
        boxShadow: '0 4px 16px rgba(180, 87, 58, 0.3)'
      }
    }
  ];

  const handleApplyText = (text: string) => {
    updateElementWithHistory(selectedElement.id, {
      content: { text }
    });
    setCopiedKey(text);
    setTimeout(() => {
      setCopiedKey(null);
      onClose();
    }, 400);
  };

  const handleApplyStyles = (styles: Record<string, unknown>) => {
    updateElementWithHistory(selectedElement.id, { styles });
    onClose();
  };

  const handleGenerateSisterElement = () => {
    if (selectedElement.type === 'heading') {
      // Add subtitle paragraph below
      const sub = addElement('text', selectedElement.x, selectedElement.y + selectedElement.height + 16);
      updateElementWithHistory(sub.id, {
        content: { text: 'Crafted with precision engineering and fluid responsive typography.' },
        styles: { fontFamily: 'Rethink Sans', fontSize: 16 }
      });
    } else if (selectedElement.type === 'button') {
      // Add secondary ghost button beside it
      const btn = addElement('button', selectedElement.x + selectedElement.width + 16, selectedElement.y);
      updateElementWithHistory(btn.id, {
        content: { text: 'Learn More' },
        styles: {
          backgroundColor: 'transparent',
          color: '#2563EB',
          borderWidth: 1,
          borderColor: '#2563EB',
          borderStyle: 'solid',
          borderRadius: selectedElement.styles?.borderRadius || 8
        }
      });
    } else {
      // Duplicate card/component
      addElement(selectedElement.type, selectedElement.x + 40, selectedElement.y + 40);
    }
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.28)'
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              AI Section Copilot & Stylist
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Refine copy, transform styles, or generate companion elements
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            '&:hover': { bgcolor: 'error.lighter', color: 'error.main' }
          }}
        >
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Target Element Context */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label={selectedElement.type.toUpperCase()}
                size="small"
                sx={{ height: 18, fontSize: '0.625rem', fontWeight: 700, bgcolor: 'primary.main', color: '#FFF' }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {selectedElement.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
              &ldquo;{currentText}&rdquo;
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={handleGenerateSisterElement}
            startIcon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            + Add Companion
          </Button>
        </Box>

        {/* Section 1: AI Copy Suggestions */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Type className="w-4 h-4 text-primary" />
            <span>AI Copywriting Refinements</span>
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {copySuggestions.map((sug) => (
              <Box
                key={sug.id}
                onClick={() => handleApplyText(sug.text)}
                sx={{
                  p: 1.8,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {sug.label}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ fontSize: '0.6875rem', py: 0, px: 1, minWidth: 'auto', textTransform: 'none' }}
                  >
                    {copiedKey === sug.text ? 'Applied!' : 'Apply'}
                  </Button>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.8125rem' }}>
                  {sug.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Section 2: AI Style Transformations */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette className="w-4 h-4 text-purple-600" />
            <span>AI Style Presets</span>
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
            {styleSuggestions.map((style) => (
              <Box
                key={style.id}
                onClick={() => handleApplyStyles(style.styles)}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'purple.main',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem', mb: 0.5 }}>
                  {style.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem', display: 'block', mb: 1 }}>
                  {style.desc}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  sx={{ fontSize: '0.6875rem', py: 0.3, textTransform: 'none' }}
                >
                  Apply
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
