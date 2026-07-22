import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Group,
  Ungroup,
  Trash2,
  Copy,
} from 'lucide-react';

interface AlignmentToolbarProps {
  selectedCount: number;
  hasGroupedElements: boolean;
  onAlign: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute: (axis: 'horizontal' | 'vertical') => void;
  onGroup: () => void;
  onUngroup: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const AlignmentToolbar: React.FC<AlignmentToolbarProps> = ({
  selectedCount,
  hasGroupedElements,
  onAlign,
  onDistribute,
  onGroup,
  onUngroup,
  onDuplicate,
  onDelete,
}) => {
  if (selectedCount < 1) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl px-3 py-1.5 gap-2 text-xs select-none animate-in fade-in zoom-in-95 duration-100">
      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-1 font-mono">
        {selectedCount} selected
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      {selectedCount > 1 && (
        <>
          {/* Alignment controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => onAlign('left')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlign('center')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Align Horizontal Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlign('right')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />
            <button
              onClick={() => onAlign('top')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Align Top"
            >
              <AlignVerticalJustifyStart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlign('middle')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Align Vertical Middle"
            >
              <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlign('bottom')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Align Bottom"
            >
              <AlignVerticalJustifyEnd className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => onDistribute('horizontal')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Distribute Horizontally"
            >
              <AlignHorizontalSpaceAround className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDistribute('vertical')}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition"
              title="Distribute Vertically"
            >
              <AlignVerticalSpaceAround className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Group / Ungroup */}
          {hasGroupedElements ? (
            <button
              onClick={onUngroup}
              className="px-2 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 font-semibold text-[11px] flex items-center gap-1 transition"
              title="Ungroup Selected Objects"
            >
              <Ungroup className="w-3.5 h-3.5" /> Ungroup
            </button>
          ) : (
            <button
              onClick={onGroup}
              className="px-2 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 font-semibold text-[11px] flex items-center gap-1 transition"
              title="Group Selected Objects"
            >
              <Group className="w-3.5 h-3.5" /> Group
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        </>
      )}

      {/* Duplicate & Delete */}
      <button
        onClick={onDuplicate}
        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition"
        title="Duplicate (Cmd+D)"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onDelete}
        className="p-1.5 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/60 dark:text-rose-400 rounded-lg transition"
        title="Delete Selected (Backspace / Delete)"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
