import React, { useState, useMemo } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { CanvasElement } from '../../types';
import * as LucideIcons from 'lucide-react';
import {
  X, Search, Image as ImageIcon, Sparkles, Check, Download,
  ExternalLink, Copy, Layers, Compass, ArrowRight
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';

// Curated high-res Unsplash photography collections
const CURATED_PHOTOS = [
  // Architecture & Spatial
  {
    id: 'p-arch-1',
    category: 'Architecture',
    title: 'Minimalist Concrete Villa',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    author: 'R ARCH'
  },
  {
    id: 'p-arch-2',
    category: 'Architecture',
    title: 'Nordic Wood & Stone Pavilion',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
    author: 'Studio Verra'
  },
  {
    id: 'p-arch-3',
    category: 'Architecture',
    title: 'Monolithic Interior Stairs',
    url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=400&q=80',
    author: 'Atelier K'
  },
  {
    id: 'p-arch-4',
    category: 'Architecture',
    title: 'Brutalist Museum Facade',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    author: 'J. Meyer'
  },

  // Tech & SaaS
  {
    id: 'p-tech-1',
    category: 'Tech & SaaS',
    title: 'Modern Clean Workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    author: 'Christopher G.'
  },
  {
    id: 'p-tech-2',
    category: 'Tech & SaaS',
    title: 'Minimalist Keyboard & Display',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    author: 'Ilya Pavlov'
  },
  {
    id: 'p-tech-3',
    category: 'Tech & SaaS',
    title: 'Abstract Blue Fluid Glass',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    author: 'Milad Fakurian'
  },

  // Minimalist Studio & Editorial
  {
    id: 'p-min-1',
    category: 'Minimalist',
    title: 'Stone & Sand Still Life',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    author: 'Europeana'
  },
  {
    id: 'p-min-2',
    category: 'Minimalist',
    title: 'Ceramic Vases & Soft Shadow',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    author: 'Tom Crew'
  },
  {
    id: 'p-min-3',
    category: 'Minimalist',
    title: 'Linen Texture & Earth Tones',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80',
    author: 'Kelly Sikkema'
  },

  // Portraits & Team
  {
    id: 'p-port-1',
    category: 'Portraits',
    title: 'Architect Portrait in Natural Light',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    author: 'A. O.'
  },
  {
    id: 'p-port-2',
    category: 'Portraits',
    title: 'Creative Director Studio Portrait',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    author: 'J. M.'
  },
  {
    id: 'p-port-3',
    category: 'Portraits',
    title: 'Design Lead Monochrome',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    author: 'V. L.'
  }
];

// Top Curated UI Icons
const CURATED_ICONS = [
  // Actions & UI
  { name: 'Zap', category: 'Actions' },
  { name: 'Sparkles', category: 'Actions' },
  { name: 'ArrowRight', category: 'Actions' },
  { name: 'Check', category: 'Actions' },
  { name: 'CheckCircle2', category: 'Actions' },
  { name: 'Plus', category: 'Actions' },
  { name: 'Star', category: 'Actions' },
  { name: 'Heart', category: 'Actions' },
  { name: 'Download', category: 'Actions' },
  { name: 'Upload', category: 'Actions' },
  { name: 'Share2', category: 'Actions' },
  { name: 'Copy', category: 'Actions' },

  // Navigation & Spatial
  { name: 'Compass', category: 'Navigation' },
  { name: 'MapPin', category: 'Navigation' },
  { name: 'Menu', category: 'Navigation' },
  { name: 'Search', category: 'Navigation' },
  { name: 'Globe', category: 'Navigation' },
  { name: 'Layout', category: 'Navigation' },
  { name: 'Layers', category: 'Navigation' },
  { name: 'Home', category: 'Navigation' },
  { name: 'ExternalLink', category: 'Navigation' },

  // Architecture & Media
  { name: 'Building2', category: 'Architecture' },
  { name: 'Camera', category: 'Architecture' },
  { name: 'Eye', category: 'Architecture' },
  { name: 'Image', category: 'Architecture' },
  { name: 'Palette', category: 'Architecture' },
  { name: 'Feather', category: 'Architecture' },
  { name: 'Maximize2', category: 'Architecture' },
  { name: 'Sliders', category: 'Architecture' },

  // Business & Commerce
  { name: 'ShieldCheck', category: 'Business' },
  { name: 'Award', category: 'Business' },
  { name: 'Briefcase', category: 'Business' },
  { name: 'CreditCard', category: 'Business' },
  { name: 'TrendingUp', category: 'Business' },
  { name: 'BarChart3', category: 'Business' },
  { name: 'Users', category: 'Business' },
  { name: 'Mail', category: 'Business' },
  { name: 'Phone', category: 'Business' },
  { name: 'Clock', category: 'Business' }
];

interface AssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'photos' | 'icons';
}

export default function AssetLibraryModal({
  isOpen,
  onClose,
  defaultTab = 'photos'
}: AssetLibraryModalProps) {
  const { elements, selectedElementIds, updateElement, addElement } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'photos' | 'icons'>(defaultTab);
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoCategory, setPhotoCategory] = useState('All');
  const [iconSearch, setIconSearch] = useState('');
  const [iconCategory, setIconCategory] = useState('All');

  const selectedElement = elements.find((el: CanvasElement) => selectedElementIds.includes(el.id));

  // Filtered Photos
  const filteredPhotos = useMemo(() => {
    return CURATED_PHOTOS.filter(p => {
      const matchesCat = photoCategory === 'All' || p.category === photoCategory;
      const matchesSearch =
        !photoSearch.trim() ||
        p.title.toLowerCase().includes(photoSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(photoSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [photoSearch, photoCategory]);

  // Filtered Icons
  const filteredIcons = useMemo(() => {
    return CURATED_ICONS.filter(i => {
      const matchesCat = iconCategory === 'All' || i.category === iconCategory;
      const matchesSearch =
        !iconSearch.trim() ||
        i.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
        i.category.toLowerCase().includes(iconSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [iconSearch, iconCategory]);

  const handleApplyPhoto = (url: string) => {
    if (selectedElement && selectedElement.type === 'image') {
      updateElement(selectedElement.id, { content: { src: url } });
    } else {
      // Add as new Image element on canvas
      addElement('image', 180, 180);
      setTimeout(() => {
        const latest = useProjectStore.getState().elements.slice(-1)[0];
        if (latest) {
          updateElement(latest.id, {
            content: { src: url },
            styles: { borderRadius: 12 }
          });
        }
      }, 50);
    }
    onClose();
  };

  const handleApplyIcon = (iconName: string) => {
    if (selectedElement && selectedElement.type === 'icon') {
      updateElement(selectedElement.id, { content: { iconName } });
    } else {
      // Add as new Icon element
      addElement('icon', 220, 220);
      setTimeout(() => {
        const latest = useProjectStore.getState().elements.slice(-1)[0];
        if (latest) {
          updateElement(latest.id, { content: { iconName } });
        }
      }, 50);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: '82vh',
            borderRadius: 3,
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }
        }
      }}
    >
      {/* Header */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
            }}
          >
            <ImageIcon className="w-5 h-5" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Asset Library & Curated Media
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              High-resolution Unsplash photography & 100+ UI icon sets
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

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, bgcolor: 'background.default' }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{ minHeight: 48 }}
        >
          <Tab
            value="photos"
            label="Stock Photos (Unsplash)"
            icon={<ImageIcon className="w-4 h-4" />}
            iconPosition="start"
            sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
          />
          <Tab
            value="icons"
            label="UI Icons (Lucide)"
            icon={<Sparkles className="w-4 h-4" />}
            iconPosition="start"
            sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
          />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {activeTab === 'photos' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Search and Category Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                size="small"
                placeholder="Search photography by keyword or style..."
                value={photoSearch}
                onChange={(e) => setPhotoSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 320 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="w-4 h-4 text-secondary" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['All', 'Architecture', 'Tech & SaaS', 'Minimalist', 'Portraits'].map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    size="small"
                    clickable
                    color={photoCategory === cat ? 'primary' : 'default'}
                    variant={photoCategory === cat ? 'filled' : 'outlined'}
                    onClick={() => setPhotoCategory(cat)}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Photos Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2
              }}
            >
              {filteredPhotos.map((photo) => (
                <Box
                  key={photo.id}
                  onClick={() => handleApplyPhoto(photo.url)}
                  sx={{
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 24px -6px rgba(0,0,0,0.12)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                    <Box
                      component="img"
                      src={photo.thumb}
                      alt={photo.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    />
                    <Chip
                      label={photo.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#FFFFFF',
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.625rem',
                        height: 20
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }} noWrap>
                        {photo.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}>
                        by {photo.author}
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        fontSize: '0.6875rem',
                        py: 0.4,
                        px: 1.2,
                        textTransform: 'none',
                        minWidth: 'auto'
                      }}
                    >
                      Use
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {activeTab === 'icons' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Search and Category Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                size="small"
                placeholder="Search 100+ UI icons..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 320 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="w-4 h-4 text-secondary" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['All', 'Actions', 'Navigation', 'Architecture', 'Business'].map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    size="small"
                    clickable
                    color={iconCategory === cat ? 'primary' : 'default'}
                    variant={iconCategory === cat ? 'filled' : 'outlined'}
                    onClick={() => setIconCategory(cat)}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Icons Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                  sm: 'repeat(4, 1fr)',
                  md: 'repeat(6, 1fr)'
                },
                gap: 1.5
              }}
            >
              {filteredIcons.map((item) => {
                const IconComponent = (LucideIcons as Record<string, any>)[item.name] || LucideIcons.Zap;

                return (
                  <Box
                    key={item.name}
                    onClick={() => handleApplyIcon(item.name)}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <IconComponent className="w-6 h-6 text-primary" />
                    <Typography variant="caption" sx={{ fontSize: '0.6875rem', fontWeight: 600, textAlign: 'center' }} noWrap>
                      {item.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
