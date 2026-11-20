import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { useProjectStore } from './store/useProjectStore';

import TopBar from './components/layout/TopBar';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import MobileFooter, { MobileTab } from './components/layout/MobileFooter';
import CanvasArtboard from './components/canvas/CanvasArtboard';
import PreviewModal from './components/preview/PreviewModal';
import ExportModal from './components/export/ExportModal';
import JsonModal from './components/export/JsonModal';
import AiPromptModal from './components/ai/AiPromptModal';
import AssetLibraryModal from './components/assets/AssetLibraryModal';
import AiElementAssistantModal from './components/ai/AiElementAssistantModal';
import StitchVibeModal from './components/stitch/StitchVibeModal';
import StitchCritiqueModal from './components/stitch/StitchCritiqueModal';
import StitchBlocksModal from './components/stitch/StitchBlocksModal';
import StitchCommandBar from './components/stitch/StitchCommandBar';
import { Sliders } from 'lucide-react';

export default function App() {
  const { addElement, zoom, snapToGrid, gridSize, selectedElementIds, elements } = useProjectStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isJsonOpen, setIsJsonOpen] = useState<boolean>(false);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState<boolean>(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState<boolean>(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isVibesOpen, setIsVibesOpen] = useState<boolean>(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState<boolean>(false);
  const [isBlocksOpen, setIsBlocksOpen] = useState<boolean>(false);
  const [isStudioDrawerOpen, setIsStudioDrawerOpen] = useState<boolean>(false);
  const [aiPromptTab, setAiPromptTab] = useState<'prompt' | 'image'>('prompt');
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle AI Prompt modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAiPromptOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Require pointer movement of at least 4px before initiating drag (prevents accidental drags on click)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta, activatorEvent } = event;
    if (!over || over.id !== 'canvas-artboard') return;

    const currentData = active.data?.current as { isPaletteItem?: boolean; type?: string } | undefined;

    if (currentData?.isPaletteItem && currentData.type) {
      const type = currentData.type;
      const artboardEl = document.querySelector('[data-canvas="artboard"]');

      if (artboardEl && activatorEvent && 'clientX' in activatorEvent) {
        const mouseEv = activatorEvent as MouseEvent;
        const rect = artboardEl.getBoundingClientRect();
        const dropClientX = mouseEv.clientX + delta.x;
        const dropClientY = mouseEv.clientY + delta.y;

        let rawX = (dropClientX - rect.left) / zoom;
        let rawY = (dropClientY - rect.top) / zoom;

        // Apply grid snapping if active
        if (snapToGrid) {
          rawX = Math.round(rawX / gridSize) * gridSize;
          rawY = Math.round(rawY / gridSize) * gridSize;
        }

        // Clamp to positive coordinates within artboard
        const dropX = Math.max(20, Math.round(rawX));
        const dropY = Math.max(20, Math.round(rawY));

        addElement(type, dropX, dropY);
      } else {
        // Fallback default coordinates
        addElement(type, 160, 160);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen bg-muted text-onSurface font-sans overflow-hidden">
        {/* Top Bar Header */}
        <TopBar
          onOpenPreview={() => setIsPreviewOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenJson={() => setIsJsonOpen(true)}
          onOpenAiPrompt={(tab: 'prompt' | 'image' = 'prompt') => {
            setAiPromptTab(tab);
            setIsAiPromptOpen(true);
          }}
          onOpenAssets={() => setIsAssetsOpen(true)}
          onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
          onOpenVibes={() => setIsVibesOpen(true)}
          onOpenCritique={() => setIsCritiqueOpen(true)}
          onOpenBlocks={() => setIsBlocksOpen(true)}
          isStudioDrawerOpen={isStudioDrawerOpen}
          onOpenStudioDrawer={() => setIsStudioDrawerOpen(true)}
          onCloseStudioDrawer={() => setIsStudioDrawerOpen(false)}
        />

        {/* 3-Column Studio Layout with Mobile Responsiveness */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Desktop Left: Palette & Layers (hidden on mobile/tablet) */}
          <div className="hidden lg:flex">
            <LeftSidebar />
          </div>

          {/* Center: Infinite Canvas & Artboard (full screen width on mobile) */}
          <main className="flex-1 h-full overflow-hidden relative w-full">
            <CanvasArtboard />

            {/* Stitch Signature Floating Command Bar */}
            <StitchCommandBar
              onOpenVibes={() => setIsVibesOpen(true)}
              onOpenCritique={() => setIsCritiqueOpen(true)}
              onOpenBlocks={() => setIsBlocksOpen(true)}
            />

            {/* Mobile Quick Properties Floating Pill when element is selected */}
            {selectedElementIds.length > 0 && mobileTab === 'canvas' && (
              <button
                type="button"
                onClick={() => setMobileTab('properties')}
                className="lg:hidden fixed bottom-20 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white shadow-xl text-xs font-semibold hover:bg-primaryDark transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Properties ({selectedElementIds.length})</span>
              </button>
            )}
          </main>

          {/* Desktop Right: Properties Inspector (hidden on mobile/tablet) */}
          <div className="hidden lg:flex">
            <RightSidebar />
          </div>
        </div>

        {/* Mobile Slide-Over Drawers */}
        {/* 1. LeftSidebar Drawer (Components / Layers) */}
        {(mobileTab === 'components' || mobileTab === 'layers') && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileTab('canvas')}
            />
            {/* Slide-over Sheet */}
            <div className="relative w-full sm:w-96 max-w-[92vw] h-full bg-surface shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
              <LeftSidebar
                activeTab={mobileTab}
                onTabChange={(tab: 'components' | 'layers') => setMobileTab(tab)}
                onClose={() => setMobileTab('canvas')}
                isMobile={true}
                onItemAdded={() => {
                  // After adding an element on mobile, user can continue adding or close
                }}
              />
            </div>
          </div>
        )}

        {/* 2. RightSidebar Drawer (Properties Inspector & Page Settings) */}
        {mobileTab === 'properties' && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileTab('canvas')}
            />
            {/* Slide-over Sheet */}
            <div className="relative w-full sm:w-96 max-w-[92vw] h-full bg-surface shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
              <RightSidebar
                onClose={() => setMobileTab('canvas')}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar (Footer) */}
        <MobileFooter
          activeTab={mobileTab}
          onSelectTab={(tab) => setMobileTab(tab)}
          onOpenStudioTools={() => setIsStudioDrawerOpen(true)}
          selectedCount={selectedElementIds.length}
          totalElements={elements.length}
        />

        {/* Modals */}
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

        <JsonModal
          isOpen={isJsonOpen}
          onClose={() => setIsJsonOpen(false)}
        />

        <AiPromptModal
          isOpen={isAiPromptOpen}
          onClose={() => setIsAiPromptOpen(false)}
          initialTab={aiPromptTab}
        />

        {/* Feature 7: Asset Library (Unsplash Photos & 100+ Icons) */}
        <AssetLibraryModal
          isOpen={isAssetsOpen}
          onClose={() => setIsAssetsOpen(false)}
        />

        {/* Feature 1: AI Section Copilot & Stylist */}
        <AiElementAssistantModal
          isOpen={isAiCopilotOpen}
          onClose={() => setIsAiCopilotOpen(false)}
        />

        {/* Google Stitch Vibe Design System Tokens Modal */}
        <StitchVibeModal
          isOpen={isVibesOpen}
          onClose={() => setIsVibesOpen(false)}
        />

        {/* Google Stitch AI Design Critique & Auto-Polish Modal */}
        <StitchCritiqueModal
          isOpen={isCritiqueOpen}
          onClose={() => setIsCritiqueOpen(false)}
        />

        {/* Google Stitch High-Fidelity Blocks Modal */}
        <StitchBlocksModal
          isOpen={isBlocksOpen}
          onClose={() => setIsBlocksOpen(false)}
        />
      </div>
    </DndContext>
  );
}
