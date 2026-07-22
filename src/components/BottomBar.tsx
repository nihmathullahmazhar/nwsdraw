import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Grid, MapPin } from 'lucide-react';
import { Viewport, GridType } from '../types';

interface BottomBarProps {
  viewport: Viewport;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitScreen: () => void;
  gridType: GridType;
  onSelectGridType: (grid: GridType) => void;
  isMinimapOpen: boolean;
  onToggleMinimap: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  viewport,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitScreen,
  gridType,
  onSelectGridType,
  isMinimapOpen,
  onToggleMinimap,
}) => {
  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl px-3 py-1.5 gap-3 text-xs select-none">
      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          onClick={onZoomOut}
          className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetZoom}
          className="px-2 py-0.5 text-[11px] font-mono font-medium text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded transition"
          title="Reset Zoom to 100%"
        >
          {zoomPercent}%
        </button>
        <button
          onClick={onZoomIn}
          className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={onFitScreen}
        className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        title="Fit All Content to Screen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      {/* Grid Pattern Picker */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <Grid className="w-3.5 h-3.5 text-slate-400 ml-1" />
        {(['dots', 'lines', 'blank', 'isometric'] as const).map((g) => (
          <button
            key={g}
            onClick={() => onSelectGridType(g)}
            className={`px-2 py-0.5 text-[10px] font-medium capitalize rounded transition ${
              gridType === g
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      {/* Minimap toggle */}
      <button
        onClick={onToggleMinimap}
        className={`p-1.5 rounded-lg transition ${
          isMinimapOpen
            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        title="Toggle Minimap Radar"
      >
        <MapPin className="w-4 h-4" />
      </button>
    </footer>
  );
};
