import React, { useState, useRef } from 'react';
import {
  Undo,
  Redo,
  Download,
  FolderOpen,
  LayoutTemplate,
  Search,
  Keyboard,
  Moon,
  Sun,
  Grid,
  Check,
  ChevronDown,
  Upload,
  Boxes,
  Layers,
  FileCode,
} from 'lucide-react';
import { DrawingProject, WorkspaceMode } from '../types';
import { WorkspaceModeSwitcher } from './WorkspaceModeSwitcher';

interface HeaderProps {
  project: DrawingProject;
  onGoHome: () => void;
  onRenameProject: (name: string) => void;
  onSelectMode: (mode: WorkspaceMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenDrawings: () => void;
  onOpenTemplates: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
  onOpenEcosystem: () => void;
  onToggleTheme: () => void;
  onToggleLayers: () => void;
  isDarkMode: boolean;
  isLayersOpen: boolean;
  onExport: (format: 'png' | 'jpeg' | 'svg' | 'pdf' | 'nwsdraw') => void;
  onImportFile: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onGoHome,
  onRenameProject,
  onSelectMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenDrawings,
  onOpenTemplates,
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenEcosystem,
  onToggleTheme,
  onToggleLayers,
  isDarkMode,
  isLayersOpen,
  onExport,
  onImportFile,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onRenameProject(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
  };

  return (
    <header className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-50 shrink-0 select-none">
      {/* Left: Brand & Ecosystem & Project Name */}
      <div className="flex items-center gap-4">
        {/* NWS Brand Logo — back to the landing page */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
          title="Back to NWS Draw home"
        >
          <img
            src="/nws-draw-logo.png"
            alt="NWS Draw"
            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="text-left hidden sm:block">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
              NWS<span className="font-normal text-slate-500">Draw</span>
            </span>
          </div>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Project Name Editable */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
              }}
              className="px-2.5 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-800 border border-indigo-500 rounded-lg focus:outline-none text-slate-900 dark:text-slate-100 max-w-[160px]"
              autoFocus
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(project.name);
                setIsEditingTitle(true);
              }}
              className="text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1 rounded-md transition truncate max-w-[120px] sm:max-w-[180px]"
              title="Click to rename drawing"
            >
              {project.name}
            </button>
          )}

          <span
            className="text-[10px] text-slate-400 hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-medium"
            title="Auto-saved in browser IndexedDB"
          >
            <Check className="w-3 h-3 text-emerald-500" /> Auto-saved
          </span>
        </div>
      </div>

      {/* Center: Mode Switcher */}
      <div className="hidden sm:block">
        <WorkspaceModeSwitcher
          currentMode={project.mode || 'whiteboard'}
          onSelectMode={onSelectMode}
        />
      </div>

      {/* Center: Undo / Redo */}
      <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded shadow-xs text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          title="Undo (Cmd+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick Find</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 rounded font-mono border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* My Drawings */}
        <button
          onClick={onOpenDrawings}
          className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5"
          title="My Saved Drawings"
        >
          <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">My Drawings</span>
        </button>

        {/* Templates */}
        <button
          onClick={onOpenTemplates}
          className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5"
          title="Starter Templates"
        >
          <LayoutTemplate className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {isExportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Image Formats
                </div>
                <button
                  onClick={() => {
                    onExport('png');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Export as PNG Image
                </button>
                <button
                  onClick={() => {
                    onExport('jpeg');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Export as JPG Image
                </button>
                <button
                  onClick={() => {
                    onExport('svg');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Export as Vector SVG
                </button>
                <button
                  onClick={() => {
                    onExport('pdf');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Export / Print to PDF
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Editable Project File
                </div>
                <button
                  onClick={() => {
                    onExport('nwsdraw');
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition flex items-center justify-between"
                >
                  <span>Export .nwsdraw</span>
                  <FileCode className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                >
                  <span>Import .nwsdraw File</span>
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* File input for import */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".nwsdraw,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Layers Toggle */}
        <button
          onClick={onToggleLayers}
          className={`p-2 rounded-lg transition ${
            isLayersOpen
              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Toggle Layers Panel"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition hidden sm:block"
          title="Keyboard Shortcuts Guide"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* NWS Ecosystem */}
        <button
          onClick={onOpenEcosystem}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition hidden sm:block"
          title="NWS Ecosystem Apps"
        >
          <Boxes className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          title="Toggle Dark / Light Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
