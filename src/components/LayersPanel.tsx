import React from 'react';
import { X, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2, Layers as LayersIcon } from 'lucide-react';
import { CanvasElement } from '../types';

interface LayersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
  selectedIds: string[];
  onSelectElement: (id: string, multi: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  isOpen,
  onClose,
  elements,
  selectedIds,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onReorder,
}) => {
  if (!isOpen) return null;

  // Render elements in top-to-bottom display stack order (reverse of array index)
  const reversed = [...elements].reverse();

  return (
    <div className="absolute right-6 top-6 z-40 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 flex flex-col gap-3 text-xs max-h-[calc(100vh-120px)] select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
          <LayersIcon className="w-4 h-4 text-indigo-600" />
          <span>Layers ({elements.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {elements.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">Canvas is empty</div>
        ) : (
          reversed.map((el, revIdx) => {
            const isSelected = selectedIds.includes(el.id);
            const actualIndex = elements.length - 1 - revIdx;
            const displayName = el.name || el.text || el.type.replace('-', ' ');

            return (
              <div
                key={el.id}
                onClick={(e) => onSelectElement(el.id, e.shiftKey || e.metaKey)}
                className={`flex items-center justify-between p-2 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 font-semibold text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1 mr-2">
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-mono shrink-0">
                    {el.type.slice(0, 4)}
                  </span>
                  <span className="truncate text-slate-800 dark:text-slate-200">{displayName}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onUpdateElement(el.id, { hidden: !el.hidden })}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={el.hidden ? 'Show' : 'Hide'}
                  >
                    {el.hidden ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onUpdateElement(el.id, { locked: !el.locked })}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={el.locked ? 'Unlock' : 'Lock'}
                  >
                    {el.locked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onDeleteElement(el.id)}
                    className="p-1 text-slate-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
