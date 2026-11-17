import React, { useState, useRef } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import { STITCH_VIBES, VibeTheme } from "../../types/vibes";
import { applyVibeTheme } from "../../engine/vibeEngine";
import {
  parseMarkdownDesign,
  ParsedDesignResult,
} from "../../engine/markdownDesignParser";
import {
  Palette,
  Sparkles,
  Check,
  X,
  Sliders,
  Type,
  Box,
  Layers,
  ChevronRight,
  RefreshCw,
  Wand2,
  Search,
  Upload,
  FileText,
  CheckCircle2,
  FileCode,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Button, IconButton, Chip } from "@mui/material";

interface StitchVibeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_DESIGN_MD = `# Radiant Modern Studio

## Color Palette
- Primary: #0284C7
- Background: #0F172A
- Surface: #1E293B
- Text: #F8FAFC
- Secondary Text: #94A3B8
- Border: #334155
- Accent: #38BDF8

## Typography
- Heading Font: Outfit
- Body Font: Plus Jakarta Sans

## Component Radii & Shadows
- Border Radius: 18px
- Button Radius: 9999px
- Box Shadow: 0 10px 30px rgba(0, 0, 0, 0.45)
`;

export default function StitchVibeModal({
  isOpen,
  onClose,
}: StitchVibeModalProps) {
  const { elements, pageSettings, selectedElementIds } = useProjectStore();

  const [activeTab, setActiveTab] = useState<"presets" | "upload_md">(
    "presets",
  );
  const [customVibes, setCustomVibes] = useState<VibeTheme[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<VibeTheme>(STITCH_VIBES[0]);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "editorial" | "modern" | "minimal" | "dark" | "bold" | "glass"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [autoApplyOnSelect, setAutoApplyOnSelect] = useState(true);
  const [applyScope, setApplyScope] = useState<"all" | "selected">("all");

  // Markdown Upload & Parsing State
  const [markdownContent, setMarkdownContent] =
    useState<string>(SAMPLE_DESIGN_MD);
  const [markdownFileName, setMarkdownFileName] = useState<string>("design.md");
  const [parsedResult, setParsedResult] = useState<ParsedDesignResult>(() =>
    parseMarkdownDesign(SAMPLE_DESIGN_MD, "design.md"),
  );
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allVibes = [...customVibes, ...STITCH_VIBES];

  const filteredVibes = allVibes.filter((v) => {
    const matchesCategory =
      activeCategory === "all" || v.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApplyVibe = (
    vibeToApply: VibeTheme = selectedVibe,
    scope: "all" | "selected" = applyScope,
  ) => {
    useProjectStore.getState().pushHistory();
    const currentState = useProjectStore.getState();
    const currentElements = currentState.elements;
    const currentSettings = currentState.pageSettings;
    const currentSelectedIds = currentState.selectedElementIds || [];

    let targetElements = currentElements;
    let nextSettings = currentSettings;

    if (scope === "selected" && currentSelectedIds.length > 0) {
      const selectedSubset = currentElements.filter((e: any) =>
        currentSelectedIds.includes(e.id),
      );
      const { elements: styledSubset } = applyVibeTheme(
        vibeToApply,
        selectedSubset,
        currentSettings,
      );
      const styledMap = new Map(styledSubset.map((e: any) => [e.id, e]));
      targetElements = currentElements.map(
        (e: any) => styledMap.get(e.id) || e,
      );
    } else {
      const result = applyVibeTheme(
        vibeToApply,
        currentElements,
        currentSettings,
      );
      targetElements = result.elements;
      nextSettings = { ...result.pageSettings, activeVibeId: vibeToApply.id };
    }

    useProjectStore.setState((state: any) => {
      const updatedPages = state.pages.map((p: any) =>
        p.id === state.activePageId
          ? {
              ...p,
              elements: targetElements,
              pageSettings: nextSettings,
            }
          : p,
      );
      return {
        elements: targetElements,
        pageSettings: nextSettings,
        pages: updatedPages,
      };
    });

    useProjectStore.getState().saveToStorage();
    setSelectedVibe(vibeToApply);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  const handleSelectVibeCard = (vibe: VibeTheme) => {
    setSelectedVibe(vibe);
    if (autoApplyOnSelect) {
      handleApplyVibe(vibe, applyScope);
    }
  };

  // Handle Markdown file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processMarkdownText(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processMarkdownText(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const processMarkdownText = (text: string, fileName = "design.md") => {
    setMarkdownContent(text);
    setMarkdownFileName(fileName);
    const parsed = parseMarkdownDesign(text, fileName);
    setParsedResult(parsed);
  };

  const handleApplyMarkdownDesign = () => {
    if (!parsedResult) return;
    const newTheme = parsedResult.theme;

    // Add to custom vibes if not already present
    setCustomVibes((prev) => {
      const exists = prev.some((v) => v.id === newTheme.id);
      return exists ? prev : [newTheme, ...prev];
    });

    setSelectedVibe(newTheme);
    handleApplyVibe(newTheme, applyScope);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-onSurface">
                  Stitch Design System & Vibe Engine
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  {STITCH_VIBES.length} Curated Themes
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Switch structural design tokens, typography rules & color
                harmonies across the entire project in 1-click
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Top View Mode Tabs */}
            <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("presets")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "presets"
                    ? "bg-surface text-primary shadow-xs"
                    : "text-secondary hover:text-onSurface"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Curated Themes ({allVibes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("upload_md")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "upload_md"
                    ? "bg-surface text-primary shadow-xs"
                    : "text-secondary hover:text-onSurface"
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload design.md</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700">
                  NEW
                </span>
              </button>
            </div>

            <Button
              variant="contained"
              size="small"
              onClick={() =>
                activeTab === "upload_md"
                  ? handleApplyMarkdownDesign()
                  : handleApplyVibe()
              }
              startIcon={
                isApplied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )
              }
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: 2,
                background: isApplied
                  ? "#059669"
                  : "linear-gradient(135deg, #7C3AED, #6366F1)",
                boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
              }}
            >
              {isApplied
                ? "Vibe Applied!"
                : activeTab === "upload_md"
                  ? "Apply design.md"
                  : `Apply ${selectedVibe.name}`}
            </Button>

            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                ml: 0.5,
                "&:hover": { bgcolor: "error.lighter", color: "error.main" },
              }}
            >
              <X className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {/* Presets Tab View */}
        {activeTab === "presets" ? (
          <>
            {/* Filter Bar & Search */}
            <div className="px-6 py-2.5 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(
                  [
                    "all",
                    "editorial",
                    "modern",
                    "minimal",
                    "dark",
                    "bold",
                    "glass",
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-surface text-primary border border-border shadow-xs font-semibold"
                        : "text-secondary hover:text-onSurface"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Live Canvas Sync Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoApplyOnSelect(!autoApplyOnSelect)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    autoApplyOnSelect
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs font-semibold"
                      : "bg-surface text-secondary border-border hover:text-onSurface"
                  }`}
                  title="When active, selecting any design immediately applies it to CanvasArtboard"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${autoApplyOnSelect ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                  />
                  <span>Canvas Sync: {autoApplyOnSelect ? "LIVE" : "OFF"}</span>
                </button>

                {/* Scope Switcher when elements are selected */}
                {selectedElementIds.length > 0 && (
                  <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setApplyScope("all")}
                      className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                        applyScope === "all"
                          ? "bg-primary text-white shadow-2xs"
                          : "text-secondary hover:text-onSurface"
                      }`}
                    >
                      All Elements
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplyScope("selected")}
                      className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                        applyScope === "selected"
                          ? "bg-primary text-white shadow-2xs"
                          : "text-secondary hover:text-onSurface"
                      }`}
                    >
                      Selected ({selectedElementIds.length})
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-secondary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vibes..."
                    className="bg-transparent text-xs text-onSurface outline-none w-28 placeholder:text-secondary/60 select-text"
                  />
                </div>
              </div>
            </div>

            {/* Body: Vibe Grid & Live Inspector */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left: Vibe Preset Cards List */}
              <div className="w-7/12 border-r border-border p-4 overflow-y-auto space-y-3">
                {filteredVibes.map((vibe) => {
                  const isSelected = selectedVibe.id === vibe.id;
                  const isCustom = vibe.id.startsWith("custom_");
                  return (
                    <div
                      key={vibe.id}
                      onClick={() => handleSelectVibeCard(vibe)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/40 shadow-sm ring-1 ring-purple-600/20"
                          : "border-border bg-surface hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-onSurface">
                            {vibe.name}
                          </span>
                          {isCustom && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                              design.md
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted text-secondary">
                            {vibe.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Color Palette Swatches */}
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: vibe.colors.primary }}
                            title={`Primary: ${vibe.colors.primary}`}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs ring-1 ring-purple-500/30"
                            style={{ backgroundColor: vibe.colors.background }}
                            title={`Background: ${vibe.colors.background}`}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: vibe.colors.surface }}
                            title={`Surface: ${vibe.colors.surface}`}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: vibe.colors.accent }}
                            title={`Accent: ${vibe.colors.accent}`}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-secondary mb-2.5 leading-relaxed">
                        {vibe.tagline}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-secondary font-mono pt-2 border-t border-border/60">
                        <div className="flex items-center gap-2">
                          <span>
                            BG:{" "}
                            <span className="font-semibold text-onSurface">
                              {vibe.colors.background}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{vibe.typography.headingFont}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVibe(vibe);
                            handleApplyVibe(vibe);
                          }}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200 transition-colors"
                        >
                          Quick Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Live Interactive Mockup Preview */}
              <div className="w-5/12 p-6 flex flex-col justify-between overflow-y-auto bg-muted/20">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-onSurface uppercase tracking-wider">
                      Live Vibe Mockup
                    </span>
                    <span className="text-xs font-mono text-purple-600 font-semibold">
                      {selectedVibe.name}
                    </span>
                  </div>

                  {/* Simulated Card with this Vibe applied */}
                  <div
                    style={{
                      backgroundColor: selectedVibe.colors.background,
                      borderRadius: "16px",
                      padding: "20px",
                      border: `1px solid ${selectedVibe.colors.border}`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    }}
                    className="space-y-4"
                  >
                    {/* Simulated Badge */}
                    <span
                      style={{
                        backgroundColor: selectedVibe.colors.accentSoft,
                        color: selectedVibe.colors.primary,
                        borderColor: selectedVibe.colors.primary,
                        borderWidth: "1px",
                        borderRadius: "9999px",
                        fontFamily: selectedVibe.typography.bodyFont,
                      }}
                      className="inline-block text-[10px] font-semibold px-2.5 py-0.5"
                    >
                      ✨ DESIGN SYSTEM V2
                    </span>

                    {/* Simulated Heading */}
                    <h3
                      style={{
                        color: selectedVibe.colors.text,
                        fontFamily: selectedVibe.typography.headingFont,
                      }}
                      className="text-lg font-bold leading-tight"
                    >
                      Crafting spaces shaped by light & tactile precision.
                    </h3>

                    {/* Simulated Text */}
                    <p
                      style={{
                        color: selectedVibe.colors.secondaryText,
                        fontFamily: selectedVibe.typography.bodyFont,
                      }}
                      className="text-xs leading-relaxed"
                    >
                      Experience natural materials, intentional proportion, and
                      enduring architectural poise.
                    </p>

                    {/* Simulated Card Surface */}
                    <div
                      style={{
                        backgroundColor: selectedVibe.colors.surface,
                        borderColor: selectedVibe.colors.border,
                        borderWidth: `${selectedVibe.styles.borderWidth}px`,
                        borderRadius: `${selectedVibe.styles.borderRadius}px`,
                        boxShadow: selectedVibe.styles.boxShadow,
                      }}
                      className="p-3"
                    >
                      <span
                        style={{
                          color: selectedVibe.colors.secondaryText,
                          fontFamily: selectedVibe.typography.bodyFont,
                        }}
                        className="text-[11px] block font-mono"
                      >
                        Surface Elevation Token:{" "}
                        {selectedVibe.styles.borderRadius}px Radius
                      </span>
                    </div>

                    {/* Simulated Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        style={{
                          backgroundColor: selectedVibe.colors.primary,
                          color:
                            selectedVibe.colors.background.startsWith("#0") ||
                            selectedVibe.colors.background.startsWith("#1")
                              ? "#0B0C10"
                              : "#FFFFFF",
                          borderRadius: `${selectedVibe.styles.buttonRadius}px`,
                          fontFamily: selectedVibe.typography.bodyFont,
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Explore Studio
                      </button>

                      <button
                        style={{
                          backgroundColor: selectedVibe.colors.surface,
                          borderColor: selectedVibe.colors.border,
                          borderWidth: "1px",
                          color: selectedVibe.colors.text,
                          borderRadius: `${selectedVibe.styles.buttonRadius}px`,
                          fontFamily: selectedVibe.typography.bodyFont,
                        }}
                        className="px-3 py-1.5 text-xs font-semibold cursor-pointer"
                      >
                        View Works
                      </button>
                    </div>
                  </div>
                </div>

                {/* Apply Action at bottom */}
                <div className="pt-4 mt-4 border-t border-border">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleApplyVibe()}
                    startIcon={
                      isApplied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )
                    }
                    sx={{
                      background: isApplied
                        ? "#059669"
                        : "linear-gradient(135deg, #7C3AED, #6366F1)",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2.5,
                      py: 1,
                    }}
                  >
                    {isApplied
                      ? "Applied to All Canvas Elements!"
                      : `Apply ${selectedVibe.name} to Canvas`}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Upload design.md Tab View */
          <div className="flex-1 flex overflow-hidden">
            {/* Left: File Dropzone & Markdown Content Editor */}
            <div className="w-7/12 border-r border-border p-5 flex flex-col justify-between overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-onSurface">
                      Upload or Paste design.md
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        processMarkdownText(SAMPLE_DESIGN_MD, "design.md")
                      }
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                    >
                      Load Sample design.md
                    </button>
                  </div>
                </div>

                <p className="text-xs text-secondary mb-3 leading-relaxed">
                  Upload your brand's{" "}
                  <code className="text-purple-600 bg-purple-50 px-1 py-0.5 rounded font-mono">
                    design.md
                  </code>{" "}
                  file or paste design system markdown. Our parser extracts
                  color palettes, Google font families, and radii automatically.
                </p>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer mb-4 ${
                    isDraggingFile
                      ? "border-purple-600 bg-purple-50/60 scale-[0.99]"
                      : "border-border hover:border-purple-400 bg-surface"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.markdown,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-onSurface">
                    Drag & Drop your{" "}
                    <span className="text-purple-600">design.md</span> file
                    here, or click to browse
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Supports .md, .markdown, or plain text styleguides
                  </div>
                </div>

                {/* Markdown Editor / Viewer */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Markdown Tokens Content ({markdownFileName})
                    </span>
                    <span className="text-[11px] text-secondary font-mono">
                      Real-time Parser Active
                    </span>
                  </div>

                  <textarea
                    value={markdownContent}
                    onChange={(e) =>
                      processMarkdownText(e.target.value, markdownFileName)
                    }
                    placeholder="# Brand Design System&#10;&#10;## Colors&#10;- Primary: #6366F1&#10;- Background: #0B0C10&#10;&#10;## Typography&#10;- Heading Font: Space Grotesk&#10;- Body Font: Inter"
                    rows={9}
                    className="w-full text-xs font-mono p-3 rounded-xl border border-border bg-surface text-onSurface focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all select-text leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right: Parsed Design Tokens Inspector & Apply */}
            <div className="w-5/12 p-6 flex flex-col justify-between overflow-y-auto bg-muted/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-onSurface uppercase tracking-wider">
                      Extracted Design Tokens
                    </span>
                  </div>
                  <span className="text-xs font-mono text-purple-600 font-semibold">
                    {parsedResult?.summary.colorsFound || 0} Colors Found
                  </span>
                </div>

                {/* Extracted Tokens Summary Card */}
                <div className="space-y-3.5 bg-surface p-4 rounded-xl border border-border shadow-xs mb-4">
                  {/* Extracted Palette Swatches */}
                  <div>
                    <span className="text-[11px] font-semibold text-secondary block mb-1.5 uppercase tracking-wider">
                      Extracted Palette
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedResult?.rawTokens.palette.map((color, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-border bg-muted/30 text-[10px] font-mono shadow-2xs"
                          title={color}
                        >
                          <div
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span>{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Semantic Roles Mapping */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                      <span className="text-[10px] text-secondary block">
                        Primary Brand:
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-onSurface">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{
                            backgroundColor: parsedResult?.theme.colors.primary,
                          }}
                        />
                        <span className="font-mono text-[11px]">
                          {parsedResult?.theme.colors.primary}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                      <span className="text-[10px] text-secondary block">
                        Background:
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-onSurface">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{
                            backgroundColor:
                              parsedResult?.theme.colors.background,
                          }}
                        />
                        <span className="font-mono text-[11px]">
                          {parsedResult?.theme.colors.background}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Typography Tokens */}
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                    <span className="text-[10px] text-secondary block uppercase tracking-wider font-semibold">
                      Typography Families
                    </span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary">Heading:</span>
                      <span className="font-semibold text-onSurface font-mono">
                        {parsedResult?.theme.typography.headingFont}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary">Body:</span>
                      <span className="font-semibold text-onSurface font-mono">
                        {parsedResult?.theme.typography.bodyFont}
                      </span>
                    </div>
                  </div>

                  {/* Radii & Elevation */}
                  <div className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg bg-muted/30 border border-border/60 font-mono text-[11px]">
                    <span>
                      Radius: {parsedResult?.theme.styles.borderRadius}px
                    </span>
                    <span>•</span>
                    <span>
                      Button: {parsedResult?.theme.styles.buttonRadius}px
                    </span>
                  </div>
                </div>

                {/* Live Preview Card with extracted markdown tokens */}
                {parsedResult && (
                  <div
                    style={{
                      backgroundColor: parsedResult.theme.colors.background,
                      borderRadius: `${parsedResult.theme.styles.borderRadius}px`,
                      padding: "16px",
                      border: `1px solid ${parsedResult.theme.colors.border}`,
                      boxShadow: parsedResult.theme.styles.boxShadow,
                    }}
                    className="space-y-2.5 shadow-sm"
                  >
                    <span
                      style={{
                        backgroundColor: parsedResult.theme.colors.accentSoft,
                        color: parsedResult.theme.colors.primary,
                        borderColor: parsedResult.theme.colors.primary,
                        borderWidth: "1px",
                        borderRadius: "9999px",
                        fontFamily: parsedResult.theme.typography.bodyFont,
                      }}
                      className="inline-block text-[10px] font-semibold px-2 py-0.5"
                    >
                      {parsedResult.theme.name}
                    </span>

                    <h4
                      style={{
                        color: parsedResult.theme.colors.text,
                        fontFamily: parsedResult.theme.typography.headingFont,
                      }}
                      className="text-base font-bold leading-tight"
                    >
                      Harmonious layout forged from markdown tokens.
                    </h4>

                    <div
                      style={{
                        backgroundColor: parsedResult.theme.colors.surface,
                        borderColor: parsedResult.theme.colors.border,
                        borderWidth: "1px",
                        borderRadius: `${Math.max(4, parsedResult.theme.styles.borderRadius - 4)}px`,
                        color: parsedResult.theme.colors.secondaryText,
                        fontFamily: parsedResult.theme.typography.bodyFont,
                      }}
                      className="p-2.5 text-xs"
                    >
                      Surface card styled with extracted tokens from{" "}
                      {markdownFileName}.
                    </div>

                    <div className="pt-1">
                      <button
                        style={{
                          backgroundColor: parsedResult.theme.colors.primary,
                          color: "#FFFFFF",
                          borderRadius: `${parsedResult.theme.styles.buttonRadius}px`,
                          fontFamily: parsedResult.theme.typography.bodyFont,
                        }}
                        className="px-3 py-1.5 text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Action Button
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Action at bottom */}
              <div className="pt-4 mt-4 border-t border-border">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleApplyMarkdownDesign}
                  startIcon={
                    isApplied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )
                  }
                  sx={{
                    background: isApplied
                      ? "#059669"
                      : "linear-gradient(135deg, #7C3AED, #6366F1)",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2.5,
                    py: 1.2,
                  }}
                >
                  {isApplied
                    ? "Applied design.md to Canvas!"
                    : `Apply ${parsedResult?.theme.name || "design.md"} to Canvas Design`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
