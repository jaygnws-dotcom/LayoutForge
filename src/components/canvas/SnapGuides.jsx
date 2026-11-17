import React from 'react';

export default function SnapGuides({ guides = [] }) {
  if (!guides || !guides.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {guides.map((g, idx) => {
        if (g.type === 'vertical') {
          return (
            <div
              key={idx}
              style={{ left: `${g.pos}px` }}
              className="absolute top-0 bottom-0 w-px bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"
            />
          );
        }
        return (
          <div
            key={idx}
            style={{ top: `${g.pos}px` }}
            className="absolute left-0 right-0 h-px bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"
          />
        );
      })}
    </div>
  );
}
