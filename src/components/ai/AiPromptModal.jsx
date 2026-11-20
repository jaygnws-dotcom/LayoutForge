import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, X, Wand2, Layers, ArrowDownCircle, RefreshCw,
  CheckCircle2, Compass, Zap, Flame, Monitor, Palette,
  Sliders, ShieldCheck, CheckSquare, Square, CornerDownLeft,
  Terminal, Activity, ArrowRight, Dices, ChevronRight,
  Upload, Image as ImageIcon, Camera, Eye, Trash2, Check,
  Scan, Copy, FileUp
} from 'lucide-react';
import {
  generateLayoutFromPrompt,
  AI_PROMPT_PRESETS,
  PALETTE_PRESETS,
  enhancePrompt
} from '../../engine/aiLayoutEngine';
import {
  analyzeImageVisuals,
  generateLayoutFromImage,
  SAMPLE_DESIGN_IMAGES
} from '../../engine/imageLayoutEngine';
import { useProjectStore } from '../../store/useProjectStore';

const ARCHETYPES = [
  { id: 'architecture', label: 'Architecture & Spatial', icon: Compass },
  { id: 'saas', label: 'B2B SaaS Platform', icon: Zap },
  { id: 'ai', label: 'Generative AI Tech', icon: Sparkles },
  { id: 'agency', label: 'Design Studio / Agency', icon: Palette },
  { id: 'pricing', label: 'Pricing & Plans Matrix', icon: Layers },
  { id: 'contact', label: 'Inbound Contact & Lead Gen', icon: Activity },
  { id: 'mobile', label: 'Mobile Consumer App', icon: Monitor }
];

export default function AiPromptModal({ isOpen, onClose, initialTab = 'prompt' }) {
  const { applyAiGeneratedLayout, elements } = useProjectStore();

  const [activeTab, setActiveTab] = useState(initialTab); // 'prompt' | 'image'
  const fileInputRef = useRef(null);

  // --- Text Prompt State ---
  const [promptText, setPromptText] = useState(AI_PROMPT_PRESETS[0].prompt);
  const [activeArchetype, setActiveArchetype] = useState('architecture');
  const [palette, setPalette] = useState('auto');
  const [density, setDensity] = useState('balanced');
  const [mode, setMode] = useState('replace'); // 'replace' | 'append'

  const [sections, setSections] = useState({
    navbar: true,
    hero: true,
    features: true,
    list: true,
    pricing: false,
    contact: false,
    footer: true
  });

  // --- Image to Design State ---
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageDomain, setImageDomain] = useState('auto');
  const [imageNotes, setImageNotes] = useState('');
  const [overrideBg, setOverrideBg] = useState('');
  const [overrideAccent, setOverrideAccent] = useState('');

  // Telemetry & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [telemetryProgress, setTelemetryProgress] = useState(0);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Global clipboard paste listener for screenshots (Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleProcessImageFile(file, 'Clipboard Screenshot');
            setActiveTab('image');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  // Hotkeys: Escape to close, Ctrl+Enter to generate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isGenerating) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isGenerating) {
        if (activeTab === 'prompt') {
          handleGenerateFromPrompt();
        } else if (uploadedImage) {
          handleGenerateFromImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, promptText, palette, density, mode, sections, uploadedImage, isGenerating]);

  if (!isOpen) return null;

  // Process an image file into dataURL and run vision analysis
  const handleProcessImageFile = (file, customName = null) => {
    if (!file) return;
    const name = customName || file.name || 'Uploaded Design Mockup';
    setImageName(name);
    setIsAnalyzingImage(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setUploadedImage(dataUrl);

      try {
        const analysis = await analyzeImageVisuals(dataUrl, name);
        setImageAnalysis(analysis);
        if (analysis.backgroundColor) setOverrideBg(analysis.backgroundColor);
        if (analysis.accentColor) setOverrideAccent(analysis.accentColor);
        if (analysis.guessedDomain) setImageDomain(analysis.guessedDomain);
      } catch (err) {
        console.error('Image analysis error:', err);
      } finally {
        setIsAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleProcessImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessImageFile(file);
  };

  const handleSelectSample = async (sample) => {
    setImageName(sample.title);
    setUploadedImage(sample.url);
    if (sample.domain) setImageDomain(sample.domain);
    setIsAnalyzingImage(true);

    try {
      const analysis = await analyzeImageVisuals(sample.url, sample.title);
      setImageAnalysis(analysis);
      if (analysis.backgroundColor) setOverrideBg(analysis.backgroundColor);
      if (analysis.accentColor) setOverrideAccent(analysis.accentColor);
    } catch (err) {
      console.error('Sample analysis error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // --- Generation Handlers ---
  const handleGenerateFromPrompt = () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setTelemetryLogs(['[01/04] Tokenizing semantic prompt intent & architectural components...']);
    setTelemetryProgress(20);

    setTimeout(() => {
      setTelemetryLogs(prev => [
        ...prev,
        '[02/04] Calibrating 12-column responsive layout grid & coordinate system...'
      ]);
      setTelemetryProgress(50);
    }, 220);

    setTimeout(() => {
      setTelemetryLogs(prev => [
        ...prev,
        '[03/04] Synthesizing typography scale, elevation, border-radii & motion transitions...'
      ]);
      setTelemetryProgress(80);
    }, 450);

    setTimeout(() => {
      setTelemetryLogs(prev => [
        ...prev,
        `[04/04] Assembling components onto canvas (${mode === 'append' ? 'Appended below' : 'Full replacement'})...`
      ]);
      setTelemetryProgress(100);

      try {
        const result = generateLayoutFromPrompt(promptText, {
          palette,
          density,
          sections,
          append: mode === 'append'
        });

        applyAiGeneratedLayout({
          elements: result.elements,
          pageSettings: result.pageSettings,
          append: mode === 'append',
          projectName: result.projectName
        });

        setIsGenerating(false);
        onClose();
      } catch (err) {
        console.error('AI Layout generation failed:', err);
        setIsGenerating(false);
      }
    }, 750);
  };

  const handleGenerateFromImage = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setTelemetryLogs(['[01/04] Scanning visual layout & pixel matrix from uploaded image...']);
    setTelemetryProgress(25);

    setTimeout(() => {
      setTelemetryLogs(prev => [
        ...prev,
        `[02/04] Extracted dominant palette (${imageAnalysis?.backgroundColor || '#F8FAFC'}) & ${imageAnalysis?.isDark ? 'Dark' : 'Light'} mood...`
      ]);
      setTelemetryProgress(50);
    }, 250);

    setTimeout(() => {
      setTelemetryLogs(prev => [
        ...prev,
        '[03/04] Segmenting visual zones into 12-column responsive flex grid...'
      ]);
      setTelemetryProgress(80);
    }, 500);

    setTimeout(async () => {
      setTelemetryLogs(prev => [
        ...prev,
        `[04/04] Reconstructing layout components onto artboard (${mode === 'append' ? 'Appended' : 'Replaced'})...`
      ]);
      setTelemetryProgress(100);

      try {
        const result = await generateLayoutFromImage(uploadedImage, {
          density,
          domain: imageDomain !== 'auto' ? imageDomain : undefined,
          designNotes: imageNotes,
          overrideBg: overrideBg || undefined,
          overrideAccent: overrideAccent || undefined,
          append: mode === 'append',
          imageName
        });

        applyAiGeneratedLayout({
          elements: result.elements,
          pageSettings: result.pageSettings,
          append: mode === 'append',
          projectName: result.projectName
        });

        setIsGenerating(false);
        onClose();
      } catch (err) {
        console.error('Image layout generation failed:', err);
        setIsGenerating(false);
      }
    }, 800);
  };

  const handleSelectArchetype = (archId) => {
    setActiveArchetype(archId);
    const preset = AI_PROMPT_PRESETS.find(p => p.prompt.toLowerCase().includes(archId)) || AI_PROMPT_PRESETS[0];
    setPromptText(preset.prompt);

    if (archId === 'pricing') {
      setSections({ navbar: true, hero: true, features: false, list: true, pricing: true, contact: false, footer: true });
    } else if (archId === 'contact') {
      setSections({ navbar: true, hero: true, features: true, list: false, pricing: false, contact: true, footer: true });
    } else {
      setSections({ navbar: true, hero: true, features: true, list: true, pricing: false, contact: false, footer: true });
    }
  };

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEnhance = () => {
    const enhanced = enhancePrompt(promptText, activeArchetype);
    setPromptText(enhanced);
  };

  const handleShuffle = () => {
    const randomPreset = AI_PROMPT_PRESETS[Math.floor(Math.random() * AI_PROMPT_PRESETS.length)];
    setPromptText(randomPreset.prompt);
  };

  const enabledSectionCount = Object.values(sections).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div
        className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-muted via-surface to-muted shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-onSurface tracking-tight">AI Studio</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                  Neural v2.5
                </span>
              </div>
              <p className="hidden sm:block text-xs text-secondary mt-0.5">
                Generate responsive visual layouts from text prompts or synthesize designs directly from uploaded screenshots.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-mono text-secondary border border-border">
              <span>⌘↵ Generate</span>
              <span>•</span>
              <span>Esc Close</span>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-1.5 rounded-lg text-secondary hover:text-onSurface hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation: Text Prompt vs Image-to-Design */}
        <div className="px-3 sm:px-6 pt-2 sm:pt-3 pb-0 border-b border-border bg-surface shrink-0 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
                activeTab === 'prompt'
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-secondary hover:text-onSurface'
              }`}
            >
              <Wand2 className="w-4 h-4 text-violet-600" />
              <span>Prompt to Layout</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
                activeTab === 'image'
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-secondary hover:text-onSurface'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Image to Design (Screenshot)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase">
                New
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-secondary">
            {activeTab === 'image' && (
              <span className="flex items-center gap-1 font-mono text-[10px] bg-muted px-2 py-0.5 rounded border border-border">
                <Copy className="w-3 h-3 text-secondary" />
                Press Ctrl+V to paste screenshot
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: TEXT PROMPT MODE */}
          {activeTab === 'prompt' && (
            <>
              {/* Archetype Quick Selectors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    Select Domain Archetype
                  </label>
                  <span className="text-[11px] text-secondary">Click to load curated architectural blueprint</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
                  {ARCHETYPES.map((arch) => {
                    const IconComponent = arch.icon;
                    const isSelected = activeArchetype === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => handleSelectArchetype(arch.id)}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          isSelected
                            ? 'bg-violet-50 text-violet-900 border-violet-300 shadow-xs font-semibold'
                            : 'bg-surface text-secondary hover:text-onSurface hover:bg-muted border-border'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-violet-600' : 'text-secondary'}`} />
                        <span className="truncate">{arch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Specification Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-onSurface flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-violet-600" />
                    Prompt & Architectural Intent
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleEnhance}
                      disabled={isGenerating}
                      className="flex items-center gap-1 text-[11px] font-medium text-violet-700 hover:text-violet-900 bg-violet-50 hover:bg-violet-100 px-2 py-0.5 rounded border border-violet-200 transition-colors"
                      title="Enrich brief prompt with detailed production design parameters"
                    >
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      <span>Polish Prompt</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShuffle}
                      disabled={isGenerating}
                      className="flex items-center gap-1 text-[11px] font-medium text-secondary hover:text-onSurface bg-muted hover:bg-surface px-2 py-0.5 rounded border border-border transition-colors"
                      title="Try another curated prompt example"
                    >
                      <Dices className="w-3 h-3" />
                      <span>Shuffle</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    disabled={isGenerating}
                    placeholder="Describe your layout requirements, typography style, target audience, hero messaging, and specific components to include..."
                    rows={4}
                    className="w-full px-4 py-3 text-xs leading-relaxed bg-muted/50 border border-border rounded-xl text-onSurface focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 placeholder:text-secondary/60 resize-none font-sans transition-all"
                  />
                  <div className="absolute right-3 bottom-3 text-[10px] text-secondary font-mono bg-surface/90 px-1.5 py-0.5 rounded border border-border">
                    {promptText.length} chars
                  </div>
                </div>
              </div>

              {/* Modular Section Stack */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Included Architectural Sections ({enabledSectionCount} Active)
                  </label>
                  <span className="text-[11px] text-secondary">Toggle sections to include or exclude</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[
                    { id: 'navbar', label: 'Navbar' },
                    { id: 'hero', label: 'Hero + CTA' },
                    { id: 'features', label: 'Feature Grid' },
                    { id: 'list', label: 'Checklist' },
                    { id: 'pricing', label: 'Pricing Matrix' },
                    { id: 'contact', label: 'Contact Form' },
                    { id: 'footer', label: 'Footer' }
                  ].map(sec => {
                    const isChecked = sections[sec.id];
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => toggleSection(sec.id)}
                        disabled={isGenerating}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition-all ${
                          isChecked
                            ? 'bg-surface text-onSurface border-violet-400 font-semibold shadow-xs'
                            : 'bg-muted/60 text-secondary hover:text-onSurface border-border line-through opacity-70'
                        }`}
                      >
                        <span>{sec.label}</span>
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-violet-600 shrink-0 ml-1" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-secondary shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Design Controls: Palette & Placement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Visual Palette */}
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Color Harmony & Theme
                  </label>
                  <select
                    value={palette}
                    onChange={(e) => setPalette(e.target.value)}
                    disabled={isGenerating}
                    className="w-full text-xs bg-muted border border-border rounded-xl px-3 py-2 text-onSurface focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                  >
                    {PALETTE_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Layout Density */}
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1.5 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Layout Density & Margins
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl border border-border">
                    {[
                      { id: 'compact', label: 'Compact' },
                      { id: 'balanced', label: 'Balanced' },
                      { id: 'spacious', label: 'Spacious' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDensity(item.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                          density === item.id
                            ? 'bg-surface text-onSurface shadow-xs font-semibold border border-border'
                            : 'text-secondary hover:text-onSurface'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas Target Mode */}
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Canvas Target Mode
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setMode('replace')}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        mode === 'replace'
                          ? 'bg-surface text-onSurface shadow-xs font-semibold border border-border'
                          : 'text-secondary hover:text-onSurface'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('append')}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                        mode === 'append'
                          ? 'bg-surface text-onSurface shadow-xs font-semibold border border-border'
                          : 'text-secondary hover:text-onSurface'
                      }`}
                      title={`Append below existing ${elements.length} elements`}
                    >
                      <ArrowDownCircle className="w-3 h-3" />
                      <span>Append</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: IMAGE TO DESIGN MODE */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              {/* Dropzone Area */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!uploadedImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    fileInputRef.current?.click();
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-violet-600 bg-violet-50/50 scale-[1.01]'
                      : 'border-border bg-muted/30 hover:bg-muted/60 hover:border-violet-400'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-3">
                    <FileUp className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-onSurface">Upload Screenshot or Design Mockup</h4>
                  <p className="text-xs text-secondary mt-1 max-w-md">
                    Drag and drop any web screenshot, Figma mockup, wireframe, or sketch here — or press <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px] border border-border">Ctrl+V</kbd> to paste directly from your clipboard.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-surface text-primary border border-border text-xs font-semibold shadow-xs">
                      Browse Image File
                    </span>
                    <span className="text-[11px] text-secondary">PNG, JPG, WebP, SVG</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-onSurface truncate max-w-md">{imageName}</h4>
                        <span className="text-[11px] text-secondary">Ready for layout reconstruction</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.value = '';
                          fileInputRef.current?.click();
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-secondary hover:text-onSurface bg-surface border border-border"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setImageAnalysis(null);
                        }}
                        className="p-1 rounded-lg text-secondary hover:text-error bg-surface border border-border"
                        title="Remove uploaded image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Image Preview with Scanning Beam */}
                  <div className="relative rounded-xl overflow-hidden border border-border bg-[#0B0F19] max-h-64 flex items-center justify-center group">
                    <img
                      src={uploadedImage}
                      alt="Uploaded mockup"
                      className="max-h-64 w-auto object-contain mx-auto transition-transform"
                    />
                    {isAnalyzingImage && (
                      <div className="absolute inset-0 bg-violet-600/10 flex items-center justify-center">
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{ top: '50%' }} />
                        <span className="px-3 py-1 rounded-full bg-black/75 text-white font-mono text-xs backdrop-blur-sm flex items-center gap-1.5 border border-white/20">
                          <Scan className="w-3.5 h-3.5 animate-spin" />
                          Extracting Vision Features...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Extracted Visual Telemetry Insights & Fine-Tuning */}
                  {imageAnalysis && (
                    <div className="space-y-3 p-4 bg-surface rounded-xl border border-border text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Detected & Customizable Palette */}
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1.5">
                            Extracted Palette (Click to customize)
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 cursor-pointer" title="Page Background Color">
                              <input
                                type="color"
                                value={overrideBg || imageAnalysis.backgroundColor}
                                onChange={(e) => setOverrideBg(e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer border border-border p-0"
                              />
                              <span className="font-mono text-[10px] text-secondary">{overrideBg || imageAnalysis.backgroundColor}</span>
                            </label>

                            <label className="flex items-center gap-1 cursor-pointer ml-1" title="Primary Brand Accent Color">
                              <input
                                type="color"
                                value={overrideAccent || imageAnalysis.accentColor}
                                onChange={(e) => setOverrideAccent(e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer border border-border p-0"
                              />
                              <span className="font-mono text-[10px] text-secondary">{overrideAccent || imageAnalysis.accentColor}</span>
                            </label>

                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-secondary font-medium ml-auto">
                              {imageAnalysis.isDark ? 'Dark' : 'Light'}
                            </span>
                          </div>
                        </div>

                        {/* Design Domain Archetype */}
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1.5">
                            Design Domain
                          </span>
                          <select
                            value={imageDomain}
                            onChange={(e) => setImageDomain(e.target.value)}
                            className="w-full text-xs bg-muted border border-border rounded-lg px-2.5 py-1 text-onSurface font-medium focus:outline-none focus:ring-1 focus:ring-violet-500"
                          >
                            <option value="auto">Auto-Detect from Image</option>
                            <option value="architecture">🏛️ Architecture & Spatial Studio</option>
                            <option value="saas">🚀 Modern B2B SaaS</option>
                            <option value="ai">🧠 Generative AI & Tech</option>
                            <option value="agency">✨ Creative Design Agency</option>
                            <option value="ecommerce">🛍️ Contemporary E-Commerce</option>
                            <option value="mobile">📱 Mobile Consumer App</option>
                          </select>
                        </div>

                        {/* Canvas Target Placement */}
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1.5">
                            Canvas Mode
                          </span>
                          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                            <button
                              type="button"
                              onClick={() => setMode('replace')}
                              className={`flex-1 py-1 rounded text-[11px] font-medium transition-all ${
                                mode === 'replace' ? 'bg-surface text-onSurface font-bold shadow-xs' : 'text-secondary'
                              }`}
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => setMode('append')}
                              className={`flex-1 py-1 rounded text-[11px] font-medium transition-all ${
                                mode === 'append' ? 'bg-surface text-onSurface font-bold shadow-xs' : 'text-secondary'
                              }`}
                            >
                              Append
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Optional Design Notes / Brand Name Hint */}
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                            Optional Design Notes / Brand Name Guidance
                          </label>
                          <span className="text-[10px] text-secondary">e.g. Architecture studio called Atelier Verra</span>
                        </div>
                        <input
                          type="text"
                          value={imageNotes}
                          onChange={(e) => setImageNotes(e.target.value)}
                          placeholder="e.g. Architecture studio called Atelier Verra, or B2B SaaS dashboard... (leave blank to auto-detect)"
                          className="w-full px-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg text-onSurface placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-violet-500 font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sample Inspiration Mockups */}
              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Or Try Sample Inspiration Mockup
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {SAMPLE_DESIGN_IMAGES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      disabled={isGenerating}
                      className="text-left p-2.5 rounded-xl border border-border bg-surface hover:bg-violet-50/50 hover:border-violet-300 transition-all group flex flex-col justify-between"
                    >
                      <div className="h-20 w-full rounded-lg overflow-hidden mb-2 bg-muted relative">
                        <img
                          src={sample.url}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-black/75 text-white font-mono">
                          {sample.category}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-onSurface group-hover:text-violet-700 transition-colors truncate">
                        {sample.title}
                      </span>
                      <p className="text-[10px] text-secondary line-clamp-1 mt-0.5">
                        {sample.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Progress & Log Stream during generation */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-[#0d1117] text-[#e6edf3] border border-[#30363d] space-y-3 font-mono text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">Layout Synthesis Pipeline</span>
                </div>
                <span className="text-[11px] text-[#8b949e]">{telemetryProgress}% Complete</span>
              </div>

              <div className="space-y-1.5 text-[11px] text-[#8b949e]">
                {telemetryLogs.map((log, index) => (
                  <div key={index} className="flex items-center gap-2 text-[#c9d1d9]">
                    <span className="text-emerald-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>

              <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${telemetryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-between shrink-0">
          <div className="text-xs text-secondary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {activeTab === 'image'
                ? 'Vision Pixel Sampling & Layout Mapping • Non-destructive with Ctrl+Z'
                : 'Deterministic Layout Heuristics • Non-destructive with Ctrl+Z'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-medium text-secondary hover:text-onSurface hover:bg-muted border border-border transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            {activeTab === 'prompt' ? (
              <button
                type="button"
                onClick={handleGenerateFromPrompt}
                disabled={isGenerating || !promptText.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing Architecture...' : 'Generate Layout Architecture'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateFromImage}
                disabled={isGenerating || !uploadedImage}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Analyzing & Reconstructing...' : 'Generate Design from Image'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
