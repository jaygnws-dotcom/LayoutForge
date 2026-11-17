import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { useProjectStore } from './store/useProjectStore';

import TopBar from './components/layout/TopBar';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
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

export default function App() {
  const { addElement, zoom, snapToGrid, gridSize } = useProjectStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isJsonOpen, setIsJsonOpen] = useState<boolean>(false);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState<boolean>(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState<boolean>(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isVibesOpen, setIsVibesOpen] = useState<boolean>(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState<boolean>(false);
  const [isBlocksOpen, setIsBlocksOpen] = useState<boolean>(false);
  const [aiPromptTab, setAiPromptTab] = useState<'prompt' | 'image'>('prompt');

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
        {/* Top Bar */}
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
        />

        {/* 3-Column Studio Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Palette & Layers */}
          <LeftSidebar />

          {/* Center: Infinite Canvas & Artboard */}
          <main className="flex-1 h-full overflow-hidden relative">
            <CanvasArtboard />

            {/* Stitch Signature Floating Command Bar */}
            <StitchCommandBar
              onOpenVibes={() => setIsVibesOpen(true)}
              onOpenCritique={() => setIsCritiqueOpen(true)}
              onOpenBlocks={() => setIsBlocksOpen(true)}
            />
          </main>

          {/* Right: Properties Inspector */}
          <RightSidebar />
        </div>

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
