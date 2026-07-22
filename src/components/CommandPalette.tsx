import React, { useState, useEffect } from 'react';
import { Search, Square, Circle, StickyNote, Type, ArrowRight, Download, Trash2, Sun, Moon, Maximize2, GitFork, LayoutTemplate, Sparkles, X } from 'lucide-react';
import { ToolType, GridType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolType) => void;
  onSelectShape: (shape: any) => void;
  onExport: (format: 'png' | 'jpeg' | 'svg' | 'pdf' | 'nwsdraw') => void;
  onClearCanvas: () => void;
  onResetZoom: () => void;
  onFitScreen: () => void;
  onOpenTemplates: () => void;
  onOpenDrawings: () => void;
  onToggleTheme: () => void;
  onSetGrid: (grid: GridType) => void;
  isDarkMode: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onSelectShape,
  onExport,
  onClearCanvas,
  onResetZoom,
  onFitScreen,
  onOpenTemplates,
  onOpenDrawings,
  onToggleTheme,
  onSetGrid,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    {
      id: 'tool_pencil',
      label: 'Freehand Pencil Tool',
      cat: 'Tools',
      icon: Sparkles,
      action: () => onSelectTool('pencil'),
    },
    {
      id: 'tool_sticky',
      label: 'Add Sticky Note',
      cat: 'Tools',
      icon: StickyNote,
      action: () => onSelectTool('sticky-note'),
    },
    {
      id: 'tool_text',
      label: 'Add Standalone Text',
      cat: 'Tools',
      icon: Type,
      action: () => onSelectTool('text'),
    },
    {
      id: 'tool_connector',
      label: 'Add Connector Arrow',
      cat: 'Tools',
      icon: ArrowRight,
      action: () => onSelectTool('line'),
    },
    {
      id: 'tool_mindmap',
      label: 'Create Mind Map Node',
      cat: 'Tools',
      icon: GitFork,
      action: () => onSelectTool('mindmap'),
    },
    {
      id: 'shape_rect',
      label: 'Add Rectangle Shape',
      cat: 'Shapes',
      icon: Square,
      action: () => onSelectShape('rectangle'),
    },
    {
      id: 'shape_circle',
      label: 'Add Circle / Ellipse Shape',
      cat: 'Shapes',
      icon: Circle,
      action: () => onSelectShape('circle'),
    },
    {
      id: 'export_png',
      label: 'Export as High-Res PNG Image',
      cat: 'Export',
      icon: Download,
      action: () => onExport('png'),
    },
    {
      id: 'export_svg',
      label: 'Export as Vector SVG File',
      cat: 'Export',
      icon: Download,
      action: () => onExport('svg'),
    },
    {
      id: 'export_nwsdraw',
      label: 'Export Editable .nwsdraw Project File',
      cat: 'Export',
      icon: Download,
      action: () => onExport('nwsdraw'),
    },
    {
      id: 'templates',
      label: 'Open Starter Templates',
      cat: 'Canvas',
      icon: LayoutTemplate,
      action: onOpenTemplates,
    },
    {
      id: 'drawings',
      label: 'Open Saved Drawings',
      cat: 'Canvas',
      icon: Search,
      action: onOpenDrawings,
    },
    {
      id: 'reset_zoom',
      label: 'Reset Zoom to 100%',
      cat: 'View',
      icon: Maximize2,
      action: onResetZoom,
    },
    {
      id: 'fit_screen',
      label: 'Fit All Content to Screen',
      cat: 'View',
      icon: Maximize2,
      action: onFitScreen,
    },
    {
      id: 'theme',
      label: `Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`,
      cat: 'View',
      icon: isDarkMode ? Sun : Moon,
      action: onToggleTheme,
    },
    {
      id: 'grid_dots',
      label: 'Set Canvas Grid: Dots Pattern',
      cat: 'Grid',
      icon: Square,
      action: () => onSetGrid('dots'),
    },
    {
      id: 'grid_lines',
      label: 'Set Canvas Grid: Graph Lines',
      cat: 'Grid',
      icon: Square,
      action: () => onSetGrid('lines'),
    },
    {
      id: 'clear',
      label: 'Clear Entire Canvas',
      cat: 'Canvas',
      icon: Trash2,
      action: onClearCanvas,
    },
  ];

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search commands, tools, exports... (e.g., 'rectangle', 'export')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => {
              const IconComp = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition text-xs font-medium"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {cmd.cat}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
