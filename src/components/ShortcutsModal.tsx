import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    title: 'General & Canvas',
    shortcuts: [
      { key: 'Cmd / Ctrl + K', label: 'Open Command Palette' },
      { key: 'Space + Drag', label: 'Pan Canvas' },
      { key: 'Scroll Wheel', label: 'Zoom In / Out' },
      { key: 'Cmd / Ctrl + A', label: 'Select All Elements' },
      { key: 'Escape', label: 'Clear Tool / Selection' },
    ],
  },
  {
    title: 'Editing & History',
    shortcuts: [
      { key: 'Cmd / Ctrl + Z', label: 'Undo' },
      { key: 'Cmd / Ctrl + Shift + Z', label: 'Redo' },
      { key: 'Cmd / Ctrl + C', label: 'Copy Selected' },
      { key: 'Cmd / Ctrl + V', label: 'Paste Selected' },
      { key: 'Cmd / Ctrl + D', label: 'Duplicate Selected' },
      { key: 'Delete / Backspace', label: 'Delete Selected' },
    ],
  },
  {
    title: 'Grouping & Layering',
    shortcuts: [
      { key: 'Cmd / Ctrl + G', label: 'Group Objects' },
      { key: 'Cmd / Ctrl + Shift + G', label: 'Ungroup Objects' },
      { key: 'Cmd / Ctrl + [', label: 'Send Backward' },
      { key: 'Cmd / Ctrl + ]', label: 'Bring Forward' },
    ],
  },
  {
    title: 'Mind Map Shortcuts',
    shortcuts: [
      { key: 'Tab', label: 'Add Child Node' },
      { key: 'Enter', label: 'Add Sibling Node' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speed up your visual workflow with instant hotkeys.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{sc.label}</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono text-slate-800 dark:text-slate-200 shadow-xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg hover:opacity-90 transition text-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
