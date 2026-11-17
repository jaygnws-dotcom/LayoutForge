import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import AlignmentToolbar from '../properties/AlignmentToolbar';
import LayoutSection from '../properties/LayoutSection';
import ContentSection from '../properties/ContentSection';
import TypographySection from '../properties/TypographySection';
import BackgroundSection from '../properties/BackgroundSection';
import BorderShadowSection from '../properties/BorderShadowSection';
import SpacingSection from '../properties/SpacingSection';
import AnimationSection from '../properties/AnimationSection';
import DeviceVisibilitySection from '../properties/DeviceVisibilitySection';
import PageSettingsSection from '../properties/PageSettingsSection';
import { Trash2, Files, Sliders, Box } from 'lucide-react';

export default function RightSidebar() {
  const {
    elements, selectedElementIds,
    deleteElements, duplicateElements
  } = useProjectStore();

  const selectedElements = elements.filter(e => selectedElementIds.includes(e.id));
  const singleSelected = selectedElements.length === 1 ? selectedElements[0] : null;

  return (
    <aside className="w-80 border-l border-border bg-surface flex flex-col h-[calc(100vh-3.5rem)] select-none overflow-y-auto shadow-sm">
      {/* Top Header */}
      <div className="p-3 border-b border-border flex items-center justify-between text-xs text-onSurface bg-surface">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            {singleSelected ? singleSelected.name : selectedElements.length > 1 ? `Selection (${selectedElements.length})` : 'Page Settings'}
          </span>
        </div>

        {selectedElements.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => duplicateElements()}
              className="p-1 hover:text-onSurface text-secondary hover:bg-muted rounded"
              title="Duplicate (Ctrl+D)"
            >
              <Files className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteElements()}
              className="p-1 hover:text-error text-secondary hover:bg-red-50 rounded"
              title="Delete (Del)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {selectedElements.length > 1 && (
        <AlignmentToolbar />
      )}

      {singleSelected ? (
        <div className="flex-1 divide-y divide-border pb-8 bg-surface">
          <LayoutSection element={singleSelected} />
          <ContentSection element={singleSelected} />
          {['heading', 'text', 'button', 'badge', 'label', 'navbar', 'footer', 'input', 'textarea', 'select', 'checkbox', 'radiogroup', 'list'].includes(singleSelected.type) && (
            <TypographySection element={singleSelected} />
          )}
          <BackgroundSection element={singleSelected} />
          <BorderShadowSection element={singleSelected} />
          <SpacingSection element={singleSelected} />
          <AnimationSection element={singleSelected} />
          <DeviceVisibilitySection element={singleSelected} />
        </div>
      ) : selectedElements.length === 0 ? (
        <PageSettingsSection />
      ) : (
        <div className="p-4 text-center text-xs text-secondary bg-surface">
          <Box className="w-8 h-8 mx-auto mb-2 opacity-30 text-primary" />
          <p className="font-medium text-onSurface">{selectedElements.length} elements selected</p>
          <p className="text-[11px] text-secondary mt-1">Use the alignment toolbar above or arrow keys to nudge together.</p>
        </div>
      )}
    </aside>
  );
}
