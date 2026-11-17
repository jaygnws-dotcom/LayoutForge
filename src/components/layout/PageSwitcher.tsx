import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { PageDefinition } from '../../types';
import {
  FileText, Plus, Copy, Trash2, Check, Edit2, ChevronDown, Layers
} from 'lucide-react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';

export default function PageSwitcher() {
  const {
    pages,
    activePageId,
    switchPage,
    addPage,
    duplicatePage,
    deletePage,
    renamePage
  } = useProjectStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState('');

  const activePage = pages.find((p: PageDefinition) => p.id === activePageId) || pages[0];

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsAdding(false);
    setEditingPageId(null);
  };

  const handleSelectPage = (id: string) => {
    switchPage(id);
    handleClose();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsAdding(false);
      handleClose();
    }
  };

  const handleRenameSubmit = (pageId: string) => {
    if (editNameInput.trim()) {
      renamePage(pageId, editNameInput.trim());
    }
    setEditingPageId(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        startIcon={<FileText className="w-3.5 h-3.5 text-primary" />}
        endIcon={<ChevronDown className="w-3 h-3 text-secondary" />}
        sx={{
          borderColor: 'divider',
          color: 'text.primary',
          bgcolor: 'background.paper',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'none',
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
        title="Switch or manage website pages"
      >
        <span className="max-w-[120px] truncate">{activePage?.name || 'Home'}</span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              p: 0.5,
              borderRadius: 2.5,
              boxShadow: '0 12px 32px -4px rgba(0,0,0,0.18)'
            }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Website Pages ({pages.length})
          </Typography>
          <Tooltip title="Duplicate Current Page">
            <IconButton
              size="small"
              onClick={() => {
                duplicatePage(activePageId);
                handleClose();
              }}
              sx={{ p: 0.5 }}
            >
              <Copy className="w-3 h-3 text-secondary" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* List of Pages */}
        {pages.map((page: PageDefinition) => {
          const isActive = page.id === activePageId;
          const isEditingThis = editingPageId === page.id;

          return (
            <MenuItem
              key={page.id}
              selected={isActive}
              onClick={() => !isEditingThis && handleSelectPage(page.id)}
              sx={{
                borderRadius: 1.5,
                py: 0.8,
                my: 0.2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: isActive ? 'action.selected' : 'transparent'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                {isEditingThis ? (
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRenameSubmit(page.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}
                  >
                    <TextField
                      size="small"
                      value={editNameInput}
                      onChange={(e) => setEditNameInput(e.target.value)}
                      autoFocus
                      slotProps={{
                        input: {
                          sx: { fontSize: '0.75rem', height: 26, py: 0, px: 0.8 }
                        }
                      }}
                    />
                    <IconButton size="small" onClick={() => handleRenameSubmit(page.id)}>
                      <Check className="w-3 h-3 text-emerald-600" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 500, fontSize: '0.8125rem' }} noWrap>
                      {page.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem' }} noWrap>
                      {page.path}
                    </Typography>
                  </Box>
                )}
              </Box>

              {!isEditingThis && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip title="Rename">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingPageId(page.id);
                        setEditNameInput(page.name);
                      }}
                      sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </IconButton>
                  </Tooltip>

                  {pages.length > 1 && (
                    <Tooltip title="Delete Page">
                      <IconButton
                        size="small"
                        onClick={() => deletePage(page.id)}
                        sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </MenuItem>
          );
        })}

        <Divider sx={{ my: 0.5 }} />

        {/* Add Page Section */}
        {isAdding ? (
          <Box
            component="form"
            onSubmit={handleAddSubmit}
            sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <TextField
              size="small"
              placeholder="e.g. Services, Blog, 404"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              autoFocus
              fullWidth
              slotProps={{ input: { sx: { fontSize: '0.75rem' } } }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                type="submit"
                fullWidth
                sx={{ fontSize: '0.6875rem', py: 0.5, textTransform: 'none' }}
              >
                Create
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsAdding(false)}
                sx={{ fontSize: '0.6875rem', py: 0.5, textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <MenuItem
            onClick={() => setIsAdding(true)}
            sx={{
              borderRadius: 1.5,
              py: 0.8,
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            <ListItemIcon sx={{ minWidth: 24, color: 'primary.main' }}>
              <Plus className="w-4 h-4" />
            </ListItemIcon>
            <ListItemText primary="Add New Page" slotProps={{ primary: { sx: { fontSize: '0.75rem', fontWeight: 600 } } }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
