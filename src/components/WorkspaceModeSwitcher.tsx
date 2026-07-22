import React from 'react';
import { WorkspaceMode } from '../types';
import { PenTool, GitBranch, Layout, Palette, Presentation } from 'lucide-react';

interface WorkspaceModeSwitcherProps {
  currentMode: WorkspaceMode;
  onSelectMode: (mode: WorkspaceMode) => void;
}

const MODES: { id: WorkspaceMode; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  {
    id: 'whiteboard',
    label: 'Whiteboard',
    icon: PenTool,
    description: 'Infinite freehand canvas, mind maps & sticky notes',
  },
  {
    id: 'diagram',
    label: 'Diagram',
    icon: GitBranch,
    description: 'Structured flowcharts, ERD, UML & cloud architectures',
  },
  {
    id: 'wireframe',
    label: 'Wireframe',
    icon: Layout,
    description: 'UI/UX mockups, browser frames & app components',
  },
  {
    id: 'design',
    label: 'Design',
    icon: Palette,
    description: 'Fixed-size graphics, posters, stories & thumbnails',
  },
  {
    id: 'presentation',
    label: 'Presentation',
    icon: Presentation,
    description: 'Multi-slide presentation deck & presenter mode',
  },
];

export const WorkspaceModeSwitcher: React.FC<WorkspaceModeSwitcherProps> = ({
  currentMode,
  onSelectMode,
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs select-none">
      {MODES.map((m) => {
        const Icon = m.icon;
        const isActive = currentMode === m.id;

        return (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-slate-200 dark:ring-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            }`}
            title={`${m.label}: ${m.description}`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
            <span className="hidden md:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
