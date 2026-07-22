import React from 'react';
import { CanvasElement, Viewport } from '../types';

interface MinimapProps {
  elements: CanvasElement[];
  viewport: Viewport;
  onNavigateViewport: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({ elements, viewport, onNavigateViewport }) => {
  if (elements.length === 0) return null;

  // Calculate bounds of elements
  let minX = -1000;
  let maxX = 2000;
  let minY = -1000;
  let maxY = 2000;

  elements.forEach((el) => {
    minX = Math.min(minX, el.x - 200);
    maxX = Math.max(maxX, el.x + el.width + 200);
    minY = Math.min(minY, el.y - 200);
    maxY = Math.max(maxY, el.y + el.height + 200);
  });

  const mapWidth = 140;
  const mapHeight = 100;

  const totalWidth = maxX - minX || 1000;
  const totalHeight = maxY - minY || 1000;

  const scaleX = mapWidth / totalWidth;
  const scaleY = mapHeight / totalHeight;

  // Viewport box in minimap
  const viewX = (-viewport.x - minX) * scaleX;
  const viewY = (-viewport.y - minY) * scaleY;
  const viewW = (window.innerWidth / viewport.zoom) * scaleX;
  const viewH = (window.innerHeight / viewport.zoom) * scaleY;

  return (
    <div className="absolute right-3 bottom-14 z-20 w-[140px] h-[100px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden select-none pointer-events-auto">
      <svg className="w-full h-full bg-slate-50/50 dark:bg-slate-950/50">
        {elements.map((el) => {
          const x = (el.x - minX) * scaleX;
          const y = (el.y - minY) * scaleY;
          const w = Math.max(3, el.width * scaleX);
          const h = Math.max(3, el.height * scaleY);
          return (
            <rect
              key={el.id}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={el.fillColor || el.strokeColor || '#3b82f6'}
              opacity={0.6}
              rx={1}
            />
          );
        })}
        {/* Viewport Indicator Rectangle */}
        <rect
          x={viewX}
          y={viewY}
          width={Math.min(mapWidth, viewW)}
          height={Math.min(mapHeight, viewH)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          className="transition-all duration-75"
        />
      </svg>
    </div>
  );
};
