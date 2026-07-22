import React, { useState } from 'react';
import { CANVAS_PRESETS } from '../data/presetsAndAssets';
import { CanvasPreset } from '../types';
import { Maximize2, Palette, Settings2, Sparkles, Check } from 'lucide-react';

interface DesignPresetSelectorProps {
  currentPresetId?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  backgroundColor?: string;
  onSelectPreset: (preset: CanvasPreset) => void;
  onChangeCustomDimensions: (width: number, height: number) => void;
  onChangeBackgroundColor: (color: string) => void;
}

const COLOR_PALETTES = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Warm Cream', value: '#fafaf9' },
  { name: 'Soft Gray', value: '#f1f5f9' },
  { name: 'Midnight Dark', value: '#0f172a' },
  { name: 'Indigo Aura', value: '#312e81' },
  { name: 'Emerald Sage', value: '#064e3b' },
  { name: 'Sunset Amber', value: '#78350f' },
];

export const DesignPresetSelector: React.FC<DesignPresetSelectorProps> = ({
  currentPresetId,
  canvasWidth = 1080,
  canvasHeight = 1080,
  backgroundColor = '#ffffff',
  onSelectPreset,
  onChangeCustomDimensions,
  onChangeBackgroundColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customW, setCustomW] = useState(canvasWidth);
  const [customH, setCustomH] = useState(canvasHeight);

  const activePreset = CANVAS_PRESETS.find((p) => p.id === currentPresetId) || CANVAS_PRESETS[0];

  const handleCustomApply = () => {
    if (customW > 100 && customH > 100) {
      onChangeCustomDimensions(customW, customH);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-xs text-xs select-none">
      <div className="flex items-center gap-1.5 px-2 text-indigo-600 dark:text-indigo-400 font-bold">
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Design Canvas:</span>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5 transition"
      >
        <span>{activePreset ? activePreset.name : 'Custom Size'}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          ({canvasWidth}×{canvasHeight}px)
        </span>
      </button>

      {/* Quick Background Colors */}
      <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-200 dark:border-slate-800">
        {COLOR_PALETTES.slice(0, 5).map((color) => (
          <button
            key={color.value}
            onClick={() => onChangeBackgroundColor(color.value)}
            className={`w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 transition-transform ${
              backgroundColor === color.value ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color.value }}
            title={`Background: ${color.name}`}
          />
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-indigo-600" /> Canvas Dimension Presets
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {CANVAS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    currentPresetId === preset.id
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{preset.name}</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                      {preset.aspectRatio}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    {preset.width} × {preset.height} px
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Dimensions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Dimensions:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customW}
                  onChange={(e) => setCustomW(Number(e.target.value))}
                  placeholder="Width"
                  className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
                <span className="text-slate-400 font-bold">×</span>
                <input
                  type="number"
                  value={customH}
                  onChange={(e) => setCustomH(Number(e.target.value))}
                  placeholder="Height"
                  className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
                <button
                  onClick={() => {
                    handleCustomApply();
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs shrink-0 hover:bg-indigo-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
