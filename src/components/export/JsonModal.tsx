import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { triggerFileDownload } from '../../engine/assetExtractor';
import { X, Download, Upload, Copy, Check, FileJson } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  Typography,
  Box,
  Alert,
  Tooltip
} from '@mui/material';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JsonModal({ isOpen, onClose }: JsonModalProps) {
  const { projectName, pageSettings, elements, loadProjectData } = useProjectStore();

  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const projectPayload = {
    version: '2.0',
    theme: 'light',
    projectName,
    exportedAt: new Date().toISOString(),
    pageSettings,
    elements
  };

  const projectJsonString = JSON.stringify(projectPayload, null, 2);

  const handleDownloadJson = () => {
    const blob = new Blob([projectJsonString], { type: 'application/json' });
    const filename = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'}.layoutforge.json`;
    triggerFileDownload(blob, filename);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(projectJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJson = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(jsonInput.trim());
      if (!Array.isArray(parsed.elements)) {
        throw new Error('Invalid project file: missing elements array.');
      }
      loadProjectData(parsed);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not parse JSON file.';
      setImportError(msg);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed.elements)) {
            loadProjectData(parsed);
            onClose();
          } else {
            setImportError('Invalid project file format: missing elements array.');
          }
        } catch (err) {
          setImportError('Failed to parse uploaded JSON file.');
        }
      };
      reader.readAsText(file);
    }
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
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
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
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: '#FEF3C7',
              color: '#D97706',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileJson className="w-5 h-5" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Project Backup & Restore (JSON)
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Save your work to continue editing anytime
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

      {/* Content */}
      <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Export Card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Export Project
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Download JSON backup or copy state to clipboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCopyJson}
                startIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  borderColor: 'divider',
                  color: copied ? 'success.main' : 'text.primary',
                  bgcolor: 'background.paper'
                }}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleDownloadJson}
                startIcon={<Download className="w-3.5 h-3.5" />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Download .json
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Import Card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Import Project
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Restore a previously saved layout JSON file
            </Typography>
          </Box>

          <Button
            component="label"
            variant="outlined"
            startIcon={<Upload className="w-4 h-4 text-primary" />}
            sx={{
              py: 1.5,
              borderStyle: 'dashed',
              borderWidth: 1.5,
              textTransform: 'none',
              bgcolor: 'background.paper',
              '&:hover': {
                borderStyle: 'dashed',
                borderWidth: 1.5,
                bgcolor: 'action.hover'
              }
            }}
          >
            Upload .json project file
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              hidden
            />
          </Button>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Or paste JSON content directly:
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              size="small"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste project JSON string here..."
              slotProps={{
                input: {
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    bgcolor: 'background.paper'
                  }
                }
              }}
            />
          </Box>

          {importError && (
            <Alert severity="error" sx={{ py: 0.5, fontSize: '0.75rem' }}>
              {importError}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            disabled={!jsonInput.trim()}
            onClick={handleImportJson}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              py: 1
            }}
          >
            Import and Load Layout
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
