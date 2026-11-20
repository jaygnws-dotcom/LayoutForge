import React, { useState, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { generateProjectCode } from '../../engine/htmlGenerator';
import { generateReactMuiCode } from '../../engine/reactMuiGenerator';
import { downloadProjectZip, downloadReactMuiZip, triggerFileDownload } from '../../engine/assetExtractor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import {
  X, Copy, Check, Download, Archive, FileCode, FileText,
  Moon, Sun, CheckCircle2, Code2, Layers, Atom, Palette, FileJson, Sparkles
} from 'lucide-react';
import {
  Button,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  CircularProgress
} from '@mui/material';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFramework = 'react' | 'html';
type ReactTab = 'react_app' | 'react_theme' | 'react_pkg';
type HtmlTab = 'html_index' | 'html_css' | 'html_single';

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { elements, pageSettings, projectName } = useProjectStore();

  // Top-level choice: React.js (TSX + MUI) vs HTML5 & CSS3
  const [framework, setFramework] = useState<ExportFramework>('react');
  const [activeTab, setActiveTab] = useState<ReactTab | HtmlTab>('react_app');
  const [editorTheme, setEditorTheme] = useState<'dark' | 'light'>('dark');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute HTML/CSS code
  const { html, css, singleFile } = useMemo(() => {
    if (!isOpen) return { html: '', css: '', singleFile: '' };
    return generateProjectCode(elements, pageSettings);
  }, [isOpen, elements, pageSettings]);

  // Compute React + Material UI code
  const { appTsx, themeTs, packageJson } = useMemo(() => {
    if (!isOpen) return { appTsx: '', themeTs: '', packageJson: '' };
    return generateReactMuiCode(elements, pageSettings, projectName);
  }, [isOpen, elements, pageSettings, projectName]);

  if (!isOpen) return null;

  // Handle framework switch
  const handleSelectFramework = (chosen: ExportFramework) => {
    setFramework(chosen);
    if (chosen === 'react') {
      setActiveTab('react_app');
    } else {
      setActiveTab('html_index');
    }
  };

  // Determine current file, language, and code content
  let currentCode = appTsx;
  let currentLanguage = 'tsx';
  let currentFilename = 'App.tsx';

  if (framework === 'react') {
    if (activeTab === 'react_theme') {
      currentCode = themeTs;
      currentLanguage = 'typescript';
      currentFilename = 'theme.ts';
    } else if (activeTab === 'react_pkg') {
      currentCode = packageJson;
      currentLanguage = 'json';
      currentFilename = 'package.json';
    } else {
      currentCode = appTsx;
      currentLanguage = 'tsx';
      currentFilename = 'App.tsx';
    }
  } else {
    if (activeTab === 'html_css') {
      currentCode = css;
      currentLanguage = 'css';
      currentFilename = 'styles.css';
    } else if (activeTab === 'html_single') {
      currentCode = singleFile;
      currentLanguage = 'markup';
      currentFilename = `${(projectName || 'layoutforge').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    } else {
      currentCode = html;
      currentLanguage = 'markup';
      currentFilename = 'index.html';
    }
  }

  // Syntax highlighting via Prism
  const grammar =
    currentLanguage === 'tsx'
      ? Prism.languages.tsx || Prism.languages.jsx || Prism.languages.javascript
      : currentLanguage === 'typescript'
      ? Prism.languages.typescript || Prism.languages.javascript
      : currentLanguage === 'json'
      ? Prism.languages.json || Prism.languages.javascript
      : currentLanguage === 'css'
      ? Prism.languages.css
      : Prism.languages.markup;

  const highlightedCode = Prism.highlight(
    currentCode,
    grammar,
    currentLanguage
  );

  const lineCount = currentCode ? currentCode.split('\n').length : 0;
  const byteSize = currentCode ? new Blob([currentCode]).size : 0;
  const formattedSize = byteSize > 1024 ? `${(byteSize / 1024).toFixed(1)} KB` : `${byteSize} B`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadActiveFile = () => {
    let mimeType = 'text/plain;charset=utf-8';
    if (currentLanguage === 'css') mimeType = 'text/css;charset=utf-8';
    else if (currentLanguage === 'markup') mimeType = 'text/html;charset=utf-8';
    else if (currentLanguage === 'json') mimeType = 'application/json;charset=utf-8';
    else if (currentLanguage === 'tsx' || currentLanguage === 'typescript') mimeType = 'text/typescript;charset=utf-8';

    const blob = new Blob([currentCode], { type: mimeType });
    triggerFileDownload(blob, currentFilename);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      if (framework === 'react') {
        await downloadReactMuiZip(elements, pageSettings, projectName);
      } else {
        await downloadProjectZip(elements, pageSettings, projectName);
      }
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="min-h-16 py-2 border-b border-border px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 bg-surface shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-onSurface">Export Code</h2>
                <Chip
                  label={framework === 'react' ? 'React MUI' : 'HTML5'}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    bgcolor: framework === 'react' ? '#DBEAFE' : '#D1FAE5',
                    color: framework === 'react' ? '#1D4ED8' : '#047857'
                  }}
                />
              </div>
              <p className="hidden sm:block text-xs text-secondary mt-0.5">
                {framework === 'react'
                  ? 'Modern React 18 with Material-UI (MUI v5), TypeScript tokens & responsive flex clustering'
                  : 'Semantic HTML5 markup with modular responsive CSS3 & vanilla JS interactions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="outlined"
              size="small"
              onClick={handleDownloadActiveFile}
              startIcon={<Download className="w-3.5 h-3.5 text-primary" />}
              sx={{ textTransform: 'none', fontSize: '0.75rem', borderColor: 'divider', color: 'text.primary', borderRadius: 2 }}
              title={`Download ${currentFilename}`}
            >
              <span className="hidden sm:inline">Download </span>{currentFilename}
            </Button>

            <Button
              variant="contained"
              size="small"
              disabled={isZipping}
              onClick={handleDownloadZip}
              startIcon={isZipping ? <CircularProgress size={14} color="inherit" /> : <Archive className="w-3.5 h-3.5" />}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 2,
                background:
                  framework === 'react'
                    ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                    : 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: framework === 'react' ? '0 4px 12px rgba(37,99,235,0.25)' : '0 4px 12px rgba(5,150,105,0.25)'
              }}
            >
              {isZipping
                ? 'Packaging ZIP...'
                : framework === 'react'
                ? 'Download React + MUI ZIP'
                : 'Download HTML/CSS ZIP'}
            </Button>

            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                ml: 0.5,
                '&:hover': { bgcolor: 'error.lighter', color: 'error.main' }
              }}
            >
              <X className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {/* Framework Selector Bar (React vs HTML/CSS) */}
        <div className="px-6 py-2.5 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-secondary mr-1">Choose Export Format:</span>
            <div className="inline-flex p-1 bg-surface rounded-xl border border-border shadow-xs">
              <button
                type="button"
                onClick={() => handleSelectFramework('react')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  framework === 'react'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-secondary hover:text-onSurface'
                }`}
              >
                <Atom className={`w-3.5 h-3.5 ${framework === 'react' ? 'text-white' : 'text-blue-500'}`} />
                <span>React.js (TSX + Material UI)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectFramework('html')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  framework === 'html'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                    : 'text-secondary hover:text-onSurface'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${framework === 'html' ? 'text-white' : 'text-emerald-500'}`} />
                <span>HTML5 & CSS3</span>
              </button>
            </div>
          </div>

          {/* Format quick badge info */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-secondary">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {framework === 'react'
                ? 'Full React 18 component structure with Material-UI'
                : 'Zero-framework vanilla HTML, CSS & JS'}
            </span>
          </div>
        </div>

        {/* Code Tabs & Action Bar */}
        <div className="px-6 py-2 border-b border-border flex flex-wrap items-center justify-between bg-muted/60 shrink-0 gap-2">
          {/* Export Sub-Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {framework === 'react' ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('react_app')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'react_app'
                      ? 'bg-surface text-primary border border-border shadow-xs font-bold'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5 text-cyan-500" />
                  <span>App.tsx (Component)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('react_theme')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'react_theme'
                      ? 'bg-surface text-primary border border-border shadow-xs font-bold'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-pink-500" />
                  <span>theme.ts (MUI Theme)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('react_pkg')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'react_pkg'
                      ? 'bg-surface text-primary border border-border shadow-xs font-bold'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5 text-amber-500" />
                  <span>package.json</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('html_index')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'html_index'
                      ? 'bg-surface text-primary border border-border shadow-xs font-bold'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span>index.html</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('html_css')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'html_css'
                      ? 'bg-surface text-primary border border-border shadow-xs font-bold'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>styles.css</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('html_single')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === 'html_single'
                      ? 'bg-surface text-primary border border-border shadow-xs font-bold'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Single HTML Bundle</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* File telemetry */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-secondary">
              <span className="px-2 py-0.5 rounded bg-surface border border-border">{lineCount} lines</span>
              <span className="px-2 py-0.5 rounded bg-surface border border-border">{formattedSize}</span>
            </div>

            {/* Dark / Light Syntax Switcher */}
            <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setEditorTheme('dark')}
                className={`p-1 px-2 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  editorTheme === 'dark' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
                }`}
                title="Dark IDE Theme"
              >
                <Moon className="w-3 h-3" />
                <span className="text-[10px]">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorTheme('light')}
                className={`p-1 px-2 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  editorTheme === 'light' ? 'bg-primary text-white font-medium shadow-xs' : 'text-secondary hover:text-onSurface'
                }`}
                title="Light IDE Theme"
              >
                <Sun className="w-3 h-3" />
                <span className="text-[10px]">Light</span>
              </button>
            </div>

            {/* Copy Button */}
            <Button
              variant="outlined"
              size="small"
              onClick={handleCopy}
              startIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-secondary" />}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                borderColor: 'divider',
                color: copied ? 'success.main' : 'text.primary',
                bgcolor: 'background.paper',
                borderRadius: 2
              }}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </div>

        {/* Code Viewer: Professional Dark/Light High-Contrast IDE */}
        <div
          className={`flex-1 p-4 overflow-auto font-mono text-xs select-text transition-colors ${
            editorTheme === 'dark' ? 'lf-code-dark' : 'lf-code-light'
          }`}
          style={{ minHeight: '300px' }}
        >
          <pre className="m-0 leading-relaxed font-mono">
            <code
              className={`language-${currentLanguage}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>

        {/* Footer info bar */}
        <div className="h-10 px-6 border-t border-border bg-surface flex items-center justify-between text-xs text-secondary shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Production Ready</span>
            </span>
            <span className="text-border">•</span>
            <span>
              {framework === 'react'
                ? 'React 18 + Material-UI (MUI v5) + TypeScript'
                : 'Pure HTML5 & Responsive CSS3 (zero external CSS frameworks)'}
            </span>
          </div>
          <div className="font-mono text-[11px] text-secondary">
            Generated with LayoutForge Engine
          </div>
        </div>
      </div>
    </div>
  );
}
