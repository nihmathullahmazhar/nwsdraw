import React, { useState } from 'react';
import {
  MousePointer,
  Hand,
  Pencil,
  PenTool,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Triangle,
  Diamond,
  Star,
  Hexagon,
  Type,
  StickyNote,
  ArrowUpRight,
  GitFork,
  Workflow,
  Layout,
  ChevronRight,
  Database,
  FileText,
  Smartphone,
  CreditCard,
  Image as ImageIcon,
  Shapes,
} from 'lucide-react';
import { ToolType, ElementType } from '../types';

interface ToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onSelectShapeType: (shapeType: ElementType) => void;
  activeShapeType: ElementType;
  onOpenAssetLibrary?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onSelectTool,
  onSelectShapeType,
  activeShapeType,
  onOpenAssetLibrary,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<'shapes' | 'flowchart' | 'wireframe' | null>(null);

  const toggleSubmenu = (menu: 'shapes' | 'flowchart' | 'wireframe') => {
    if (openSubmenu === menu) setOpenSubmenu(null);
    else setOpenSubmenu(menu);
  };

  const handleShapeSelect = (type: ElementType) => {
    onSelectShapeType(type);
    onSelectTool('shape');
    setOpenSubmenu(null);
  };

  const handleFlowchartSelect = (type: ElementType) => {
    onSelectShapeType(type);
    onSelectTool('flowchart');
    setOpenSubmenu(null);
  };

  const handleWireframeSelect = (type: ElementType) => {
    onSelectShapeType(type);
    onSelectTool('wireframe');
    setOpenSubmenu(null);
  };

  return (
    <aside className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 select-none">
      {/* Select Tool */}
      <button
        onClick={() => {
          onSelectTool('select');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'select'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Select & Move (V)"
      >
        <MousePointer className="w-5 h-5" />
      </button>

      {/* Hand Pan Tool */}
      <button
        onClick={() => {
          onSelectTool('pan');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'pan'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Pan Canvas (Space + Drag)"
      >
        <Hand className="w-5 h-5" />
      </button>

      <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-2" />

      {/* Freehand Pencil */}
      <button
        onClick={() => {
          onSelectTool('pencil');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'pencil'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Freehand Pencil (P)"
      >
        <Pencil className="w-5 h-5" />
      </button>

      {/* Smooth Pen */}
      <button
        onClick={() => {
          onSelectTool('pen');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'pen'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Smooth Drawing Pen"
      >
        <PenTool className="w-5 h-5" />
      </button>

      {/* Highlighter */}
      <button
        onClick={() => {
          onSelectTool('highlighter');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'highlighter'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Highlighter Marker"
      >
        <Highlighter className="w-5 h-5" />
      </button>

      {/* Eraser */}
      <button
        onClick={() => {
          onSelectTool('eraser');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'eraser'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Eraser (E)"
      >
        <Eraser className="w-5 h-5" />
      </button>

      <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-2" />

      {/* Shapes Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => toggleSubmenu('shapes')}
          className={`p-3 rounded-lg transition-colors flex items-center justify-center ${
            activeTool === 'shape'
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
          }`}
          title="Geometric Shapes"
        >
          <Square className="w-5 h-5" />
        </button>

        {openSubmenu === 'shapes' && (
          <div className="absolute left-14 top-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 grid grid-cols-2 gap-1.5 w-48 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
            <button
              onClick={() => handleShapeSelect('rectangle')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Square className="w-4 h-4 text-indigo-600" /> Rectangle
            </button>
            <button
              onClick={() => handleShapeSelect('rounded-rectangle')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Square className="w-4 h-4 text-indigo-600 rounded" /> Rounded
            </button>
            <button
              onClick={() => handleShapeSelect('circle')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Circle className="w-4 h-4 text-emerald-500" /> Circle
            </button>
            <button
              onClick={() => handleShapeSelect('triangle')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Triangle className="w-4 h-4 text-amber-500" /> Triangle
            </button>
            <button
              onClick={() => handleShapeSelect('diamond')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Diamond className="w-4 h-4 text-purple-500" /> Diamond
            </button>
            <button
              onClick={() => handleShapeSelect('star')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-400" /> Star
            </button>
            <button
              onClick={() => handleShapeSelect('hexagon')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2 col-span-2"
            >
              <Hexagon className="w-4 h-4 text-rose-500" /> Hexagon
            </button>
          </div>
        )}
      </div>

      {/* Arrow / Line / Connector */}
      <button
        onClick={() => {
          onSelectTool('line');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'line' || activeTool === 'arrow'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Lines & Connectors (A)"
      >
        <ArrowUpRight className="w-5 h-5" />
      </button>

      {/* Standalone Text */}
      <button
        onClick={() => {
          onSelectTool('text');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'text'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Text Tool (T)"
      >
        <Type className="w-5 h-5" />
      </button>

      {/* Sticky Note */}
      <button
        onClick={() => {
          onSelectTool('sticky-note');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'sticky-note'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Sticky Note (S)"
      >
        <StickyNote className="w-5 h-5" />
      </button>

      <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-2" />

      {/* Flowchart Submenu */}
      <div className="relative">
        <button
          onClick={() => toggleSubmenu('flowchart')}
          className={`p-3 rounded-lg transition-colors ${
            activeTool === 'flowchart'
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
          }`}
          title="Flowchart Library"
        >
          <Workflow className="w-5 h-5" />
        </button>

        {openSubmenu === 'flowchart' && (
          <div className="absolute left-14 top-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 flex flex-col gap-1 w-48 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
            <button
              onClick={() => handleFlowchartSelect('flowchart-start')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Circle className="w-4 h-4 text-emerald-500" /> Start / End
            </button>
            <button
              onClick={() => handleFlowchartSelect('flowchart-process')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Square className="w-4 h-4 text-indigo-600" /> Process Box
            </button>
            <button
              onClick={() => handleFlowchartSelect('flowchart-decision')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Diamond className="w-4 h-4 text-amber-500" /> Decision
            </button>
            <button
              onClick={() => handleFlowchartSelect('flowchart-db')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-purple-500" /> Database
            </button>
            <button
              onClick={() => handleFlowchartSelect('flowchart-doc')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-500" /> Document
            </button>
          </div>
        )}
      </div>

      {/* Mind Map Tool */}
      <button
        onClick={() => {
          onSelectTool('mindmap');
          setOpenSubmenu(null);
        }}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'mindmap'
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
        }`}
        title="Mind Map (M)"
      >
        <GitFork className="w-5 h-5" />
      </button>

      {/* Wireframe Submenu */}
      <div className="relative">
        <button
          onClick={() => toggleSubmenu('wireframe')}
          className={`p-3 rounded-lg transition-colors ${
            activeTool === 'wireframe'
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800'
          }`}
          title="UI Wireframes"
        >
          <Layout className="w-5 h-5" />
        </button>

        {openSubmenu === 'wireframe' && (
          <div className="absolute left-14 top-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 flex flex-col gap-1 w-48 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
            <button
              onClick={() => handleWireframeSelect('wireframe-browser')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Layout className="w-4 h-4 text-slate-500" /> Browser Frame
            </button>
            <button
              onClick={() => handleWireframeSelect('wireframe-mobile')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-slate-500" /> Mobile Frame
            </button>
            <button
              onClick={() => handleWireframeSelect('wireframe-button')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Square className="w-4 h-4 text-indigo-600" /> Button
            </button>
            <button
              onClick={() => handleWireframeSelect('wireframe-card')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-slate-500" /> UI Card
            </button>
            <button
              onClick={() => handleWireframeSelect('wireframe-image')}
              className="p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-slate-500" /> Image Placeholder
            </button>
          </div>
        )}
      </div>

      {/* Asset Library Trigger */}
      {onOpenAssetLibrary && (
        <button
          onClick={() => {
            onOpenAssetLibrary();
            setOpenSubmenu(null);
          }}
          className="p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 transition-colors"
          title="Open Asset & Symbol Library"
        >
          <Shapes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </button>
      )}
    </aside>
  );
};
