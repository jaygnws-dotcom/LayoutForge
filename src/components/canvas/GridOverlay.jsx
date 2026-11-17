import React from 'react';

export default function GridOverlay({ showGrid, gridSize = 20, gridType = 'lines' }) {
  if (!showGrid) return null;

  if (gridType === 'columns') {
    return (
      <div className="absolute inset-0 pointer-events-none flex px-6 z-0 select-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 px-2.5 h-full">
            <div className="w-full h-full bg-blue-500/10 border-x border-blue-500/25 relative">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary/60 font-semibold">
                {i + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (gridType === 'dots') {
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0 select-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(100, 116, 139, 0.5) 1.5px, transparent 1.5px)',
          backgroundSize: `${gridSize}px ${gridSize}px`
        }}
      />
    );
  }

  // Default: 'lines' (Architectural / Designer Grid Lines with Major lines every 5 cells)
  const majorSize = gridSize * 5;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 select-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(148, 163, 184, 0.35) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.35) 1px, transparent 1px),
          linear-gradient(to right, rgba(71, 85, 105, 0.5) 1.5px, transparent 1.5px),
          linear-gradient(to bottom, rgba(71, 85, 105, 0.5) 1.5px, transparent 1.5px)
        `,
        backgroundSize: `
          ${gridSize}px ${gridSize}px,
          ${gridSize}px ${gridSize}px,
          ${majorSize}px ${majorSize}px,
          ${majorSize}px ${majorSize}px
        `
      }}
    />
  );
}
