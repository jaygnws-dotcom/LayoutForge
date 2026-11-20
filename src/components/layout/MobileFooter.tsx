import React from 'react';
import { Layout, Box, Layers, Sliders, Sparkles } from 'lucide-react';

export type MobileTab = 'canvas' | 'components' | 'layers' | 'properties';

interface MobileFooterProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenStudioTools: () => void;
  selectedCount: number;
  totalElements: number;
}

export default function MobileFooter({
  activeTab,
  onSelectTab,
  onOpenStudioTools,
  selectedCount,
  totalElements
}: MobileFooterProps) {
  return (
    <footer className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border shadow-2xl pb-[env(safe-area-inset-bottom,0px)] select-none">
      <nav aria-label="Mobile Bottom Navigation" className="h-14 px-2 flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Canvas View */}
        <button
          type="button"
          onClick={() => onSelectTab('canvas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'canvas'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="Switch to Canvas Artboard"
        >
          <div className="relative">
            <Layout className={`w-5 h-5 transition-transform ${activeTab === 'canvas' ? 'scale-110' : ''}`} />
            {activeTab === 'canvas' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Canvas</span>
        </button>

        {/* 2. Components Catalog */}
        <button
          type="button"
          onClick={() => onSelectTab('components')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'components'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="Browse & Add Components"
        >
          <div className="relative">
            <Box className={`w-5 h-5 transition-transform ${activeTab === 'components' ? 'scale-110' : ''}`} />
            {activeTab === 'components' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Components</span>
        </button>

        {/* 3. Layers Panel */}
        <button
          type="button"
          onClick={() => onSelectTab('layers')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'layers'
              ? 'text-primary font-bold'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="Manage Canvas Layers"
        >
          <div className="relative">
            <Layers className={`w-5 h-5 transition-transform ${activeTab === 'layers' ? 'scale-110' : ''}`} />
            {totalElements > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-3.5 rounded-full bg-muted border border-border text-[9px] font-mono font-semibold flex items-center justify-center text-secondary">
                {totalElements}
              </span>
            )}
            {activeTab === 'layers' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Layers</span>
        </button>

        {/* 4. Properties Inspector */}
        <button
          type="button"
          onClick={() => onSelectTab('properties')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'properties'
              ? 'text-primary font-bold'
              : selectedCount > 0
              ? 'text-primary/90 font-medium'
              : 'text-secondary hover:text-onSurface'
          }`}
          title="Element Properties & Page Settings"
        >
          <div className="relative">
            <Sliders className={`w-5 h-5 transition-transform ${activeTab === 'properties' ? 'scale-110' : ''}`} />
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-3.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                {selectedCount}
              </span>
            )}
            {activeTab === 'properties' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">
            {selectedCount > 0 ? `Properties (${selectedCount})` : 'Properties'}
          </span>
        </button>

        {/* 5. Studio Tools Menu */}
        <button
          type="button"
          onClick={onOpenStudioTools}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer text-purple-600 hover:text-purple-700"
          title="Open Studio Tools Menu"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium text-purple-700 dark:text-purple-400">
            Tools
          </span>
        </button>
      </nav>
    </footer>
  );
}
