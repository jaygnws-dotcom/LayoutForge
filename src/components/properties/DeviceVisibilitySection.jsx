import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export default function DeviceVisibilitySection({ element }) {
  const { updateElementWithHistory } = useProjectStore();
  const responsive = element.responsive || {};

  const toggleVisibility = (key) => {
    updateElementWithHistory(element.id, {
      responsive: { ...responsive, [key]: !responsive[key] }
    });
  };

  return (
    <div className="p-3 border-b border-border space-y-2 bg-surface">
      <div className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
        Device Visibility
      </div>

      <div className="space-y-1.5 text-xs">
        <label className="flex items-center justify-between p-2 rounded-lg bg-muted border border-border cursor-pointer hover:bg-accentSoft/30 transition-colors">
          <span className="flex items-center gap-2 text-onSurface">
            <Monitor className="w-3.5 h-3.5 text-primary" />
            <span>Hide on Desktop (≥1024px)</span>
          </span>
          <input
            type="checkbox"
            checked={!!responsive.hideOnDesktop}
            onChange={() => toggleVisibility('hideOnDesktop')}
            className="rounded border-border text-primary focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-lg bg-muted border border-border cursor-pointer hover:bg-accentSoft/30 transition-colors">
          <span className="flex items-center gap-2 text-onSurface">
            <Tablet className="w-3.5 h-3.5 text-primary" />
            <span>Hide on Tablet (640–1023px)</span>
          </span>
          <input
            type="checkbox"
            checked={!!responsive.hideOnTablet}
            onChange={() => toggleVisibility('hideOnTablet')}
            className="rounded border-border text-primary focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded-lg bg-muted border border-border cursor-pointer hover:bg-accentSoft/30 transition-colors">
          <span className="flex items-center gap-2 text-onSurface">
            <Smartphone className="w-3.5 h-3.5 text-primary" />
            <span>Hide on Mobile (&lt;640px)</span>
          </span>
          <input
            type="checkbox"
            checked={!!responsive.hideOnMobile}
            onChange={() => toggleVisibility('hideOnMobile')}
            className="rounded border-border text-primary focus:ring-0"
          />
        </label>
      </div>
    </div>
  );
}
