import React from 'react';
import {
  Trash2,
  Lock,
  Unlock,
  Layers,
  ArrowUp,
  ArrowDown,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Maximize2,
  Minimize2,
  RotateCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CanvasElement } from '../types';

interface PropertiesPanelProps {
  selectedElements: CanvasElement[];
  onUpdateElement: (updates: Partial<CanvasElement>) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onToggleLock: () => void;
  onMoveLayer: (direction: 'up' | 'down' | 'front' | 'back') => void;
  onGroupSelected: () => void;
  onUngroupSelected: () => void;
}

const COLOR_PALETTE = [
  '#000000',
  '#ffffff',
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // slate
  '#fef08a', // yellow sticky
  '#bbf7d0', // green sticky
  '#bae6fd', // blue sticky
  '#fbcfe8', // pink sticky
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElements,
  onUpdateElement,
  onDeleteSelected,
  onDuplicateSelected,
  onToggleLock,
  onMoveLayer,
  onGroupSelected,
  onUngroupSelected,
}) => {
  if (selectedElements.length === 0) return null;

  const first = selectedElements[0];
  const isMultiple = selectedElements.length > 1;

  return (
    <div className="absolute right-6 top-6 z-40 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col select-none max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {isMultiple ? `${selectedElements.length} Items Selected` : `${first.type} Properties`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicateSelected}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition"
            title="Duplicate (Cmd+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleLock}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition"
            title={first.locked ? 'Unlock' : 'Lock'}
          >
            {first.locked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onDeleteSelected}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-red-500 transition"
            title="Delete (Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5 text-xs">
        {/* Stroke Color */}
        <div>
          <label className="text-[11px] text-slate-500 font-medium uppercase block mb-1.5">
            Stroke Color
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PALETTE.slice(0, 9).map((c) => (
              <button
                key={c}
                onClick={() => onUpdateElement({ strokeColor: c })}
                className={`w-6 h-6 rounded border border-slate-200 dark:border-slate-700 transition ${
                  first.strokeColor === c ? 'ring-2 ring-indigo-500 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={first.strokeColor || '#000000'}
              onChange={(e) => onUpdateElement({ strokeColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer overflow-hidden p-0 border-0"
              title="Custom stroke color"
            />
          </div>
        </div>

        {/* Fill Color */}
        {first.type !== 'pencil' && first.type !== 'pen' && first.type !== 'highlighter' && (
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase block mb-1.5">
              Fill Color
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onUpdateElement({ fillColor: 'transparent' })}
                className={`w-6 h-6 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400 ${
                  first.fillColor === 'transparent' ? 'ring-2 ring-indigo-500' : ''
                }`}
                title="Transparent Fill"
              >
                Ø
              </button>
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateElement({ fillColor: c })}
                  className={`w-6 h-6 rounded border border-slate-200 dark:border-slate-700 transition ${
                    first.fillColor === c ? 'ring-2 ring-indigo-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={first.fillColor && first.fillColor !== 'transparent' ? first.fillColor : '#ffffff'}
                onChange={(e) => onUpdateElement({ fillColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer overflow-hidden p-0 border-0"
                title="Custom fill color"
              />
            </div>
          </div>
        )}

        {/* Stroke Style & Width */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase block mb-1.5">
              Stroke Width
            </label>
            <div className="flex gap-2">
              {[1, 2, 4, 6].map((w) => (
                <button
                  key={w}
                  onClick={() => onUpdateElement({ strokeWidth: w })}
                  className={`flex-1 h-8 rounded border text-[11px] font-medium transition flex items-center justify-center ${
                    first.strokeWidth === w
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium uppercase block mb-1.5">
              Stroke Style
            </label>
            <div className="flex gap-2">
              {(['solid', 'dashed', 'dotted'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateElement({ strokeStyle: st })}
                  className={`flex-1 h-8 rounded border transition flex items-center justify-center ${
                    first.strokeStyle === st
                      ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {st === 'solid' && <div className="w-6 h-[2px] bg-slate-800 dark:bg-slate-200" />}
                  {st === 'dashed' && <div className="w-6 h-[2px] border-t border-dashed border-slate-500" />}
                  {st === 'dotted' && <div className="w-6 h-[2px] border-t border-dotted border-slate-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] text-slate-500 font-medium uppercase">Opacity</label>
            <span className="text-xs font-mono text-slate-400">{Math.round((first.opacity ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={first.opacity ?? 1}
            onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Typography */}
        {(first.text !== undefined || first.type === 'text' || first.type === 'sticky-note') && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-[11px] text-slate-500 font-medium uppercase block">Typography</label>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['sans', 'serif', 'mono'] as const).map((ff) => (
                <button
                  key={ff}
                  onClick={() => onUpdateElement({ fontFamily: ff })}
                  className={`py-1 text-[10px] font-semibold capitalize rounded transition ${
                    first.fontFamily === ff
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {ff}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Size</label>
                <select
                  value={first.fontSize || 14}
                  onChange={(e) => onUpdateElement({ fontSize: parseInt(e.target.value) })}
                  className="w-full p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs"
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64].map((s) => (
                    <option key={s} value={s}>
                      {s}px
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">Align</label>
                <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => onUpdateElement({ textAlign: 'left' })}
                    className={`flex-1 p-1 rounded ${
                      first.textAlign === 'left' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5 mx-auto" />
                  </button>
                  <button
                    onClick={() => onUpdateElement({ textAlign: 'center' })}
                    className={`flex-1 p-1 rounded ${
                      first.textAlign === 'center' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5 mx-auto" />
                  </button>
                  <button
                    onClick={() => onUpdateElement({ textAlign: 'right' })}
                    className={`flex-1 p-1 rounded ${
                      first.textAlign === 'right' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layer Order */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] text-slate-500 font-medium uppercase block">Layer Order</label>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => onMoveLayer('front')}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[10px] flex flex-col items-center gap-0.5"
              title="Bring to Front"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Front
            </button>
            <button
              onClick={() => onMoveLayer('up')}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[10px] flex flex-col items-center gap-0.5"
              title="Bring Forward"
            >
              <ArrowUp className="w-3 h-3" /> Up
            </button>
            <button
              onClick={() => onMoveLayer('down')}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[10px] flex flex-col items-center gap-0.5"
              title="Send Backward"
            >
              <ArrowDown className="w-3 h-3" /> Down
            </button>
            <button
              onClick={() => onMoveLayer('back')}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[10px] flex flex-col items-center gap-0.5"
              title="Send to Back"
            >
              <ArrowDown className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
