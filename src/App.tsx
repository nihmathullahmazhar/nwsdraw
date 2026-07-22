import React, { useState, useEffect, useCallback } from 'react';
import {
  CanvasElement,
  DrawingProject,
  ToolType,
  ElementType,
  Viewport,
  GridType,
  Template,
  WorkspaceMode,
  Slide,
} from './types';
import {
  createNewProject,
  getAllProjects,
  saveProject,
  getLastActiveProjectId,
} from './lib/storage';
import {
  generateSvgFromElements,
  exportToImage,
  exportToSvgFile,
  exportToPdf,
  exportNativeProjectFile,
  importNativeProjectFile,
} from './lib/exportUtils';

import { Landing } from './components/Landing';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { Minimap } from './components/Minimap';
import { BottomBar } from './components/BottomBar';
import { Canvas } from './components/Canvas';

import { CommandPalette } from './components/CommandPalette';
import { ShortcutsModal } from './components/ShortcutsModal';
import { MyDrawingsModal } from './components/MyDrawingsModal';
import { TemplatesModal } from './components/TemplatesModal';
import { EcosystemModal } from './components/EcosystemModal';

import { AssetLibraryModal } from './components/AssetLibraryModal';
import { DesignPresetSelector } from './components/DesignPresetSelector';
import { PresentationSlidesBar } from './components/PresentationSlidesBar';
import { PresentationViewModal } from './components/PresentationViewModal';
import { AlignmentToolbar } from './components/AlignmentToolbar';

import { AssetDefinition } from './data/presetsAndAssets';
import { alignElements, distributeElements, groupElements, ungroupElements } from './lib/alignmentUtils';

export default function App() {
  // Landing page gate — the designed NWS entry screen shows on every load,
  // "Open the canvas" enters the workspace, the header logo returns home.
  const [hasEntered, setHasEntered] = useState(false);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('nws_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nws_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nws_theme', 'light');
    }
  }, [isDarkMode]);

  // Project state
  const [project, setProject] = useState<DrawingProject>(() => createNewProject('Untitled Drawing'));

  // Canvas elements state
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Viewport & Tools
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [activeShapeType, setActiveShapeType] = useState<ElementType>('rectangle');
  const [gridType, setGridType] = useState<GridType>('dots');

  // History Stack
  const [undoStack, setUndoStack] = useState<CanvasElement[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasElement[][]>([]);

  // Clipboard for Copy / Paste
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);

  // UI Panels
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isMinimapOpen, setIsMinimapOpen] = useState(true);

  // Modals & Drawers
  const [isDrawingsModalOpen, setIsDrawingsModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState(false);
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);

  // Presentation Mode State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPresentationViewOpen, setIsPresentationViewOpen] = useState(false);

  // Initialize or load last project from IndexedDB
  useEffect(() => {
    const initStorage = async () => {
      const allProjects = await getAllProjects();
      if (allProjects.length === 0) {
        const defaultProj = createNewProject('My First Drawing');
        await saveProject(defaultProj);
        setProject(defaultProj);
        setElements(defaultProj.elements);
      } else {
        const lastId = await getLastActiveProjectId();
        const found = allProjects.find((p) => p.id === lastId) || allProjects[0];
        setProject(found);
        setElements(found.elements);
        if (found.viewport) setViewport(found.viewport);
        if (found.gridType) setGridType(found.gridType);
      }
    };
    initStorage();
  }, []);

  // Debounced auto-save to IndexedDB whenever elements or metadata change
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedProj: DrawingProject = {
        ...project,
        elements,
        viewport,
        gridType,
        updatedAt: Date.now(),
      };
      setProject(updatedProj);
      saveProject(updatedProj);
    }, 500);

    return () => clearTimeout(timer);
  }, [elements, viewport, gridType, project.id, project.name]);

  // Record Undo History Snapshot
  const handleElementsChange = useCallback(() => {
    setUndoStack((prev) => [...prev, elements]);
    setRedoStack([]);
  }, [elements]);

  // Undo / Redo Actions
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [elements, ...r]);
    setElements(prev);
    setUndoStack((u) => u.slice(0, u.length - 1));
  }, [undoStack, elements]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack((u) => [...u, elements]);
    setElements(next);
    setRedoStack((r) => r.slice(1));
  }, [redoStack, elements]);

  // Workspace Mode Switcher
  const handleSelectMode = (mode: WorkspaceMode) => {
    setProject((prev) => {
      const updated = { ...prev, mode, updatedAt: Date.now() };
      // Ensure slides exist if presentation mode is selected
      if (mode === 'presentation' && (!updated.slides || updated.slides.length === 0)) {
        updated.slides = [
          {
            id: 'slide_1',
            title: 'Intro Slide',
            elements: [...elements],
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          },
        ];
      }
      return updated;
    });
  };

  // Add Asset from Library
  const handleAddAsset = (asset: AssetDefinition) => {
    handleElementsChange();
    const centerX = -viewport.x + window.innerWidth / 2 - asset.width / 2;
    const centerY = -viewport.y + window.innerHeight / 2 - asset.height / 2;

    const newElement: CanvasElement = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: asset.type === 'badge' ? 'asset-badge' : 'asset-icon',
      x: Math.round(centerX),
      y: Math.round(centerY),
      width: asset.width,
      height: asset.height,
      text: asset.badgeText || asset.name,
      fillColor: asset.fillColor || '#4f46e5',
      strokeColor: asset.strokeColor || '#312e81',
      strokeWidth: 2,
      textColor: '#ffffff',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedIds([newElement.id]);
  };

  // Alignment Handlers
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    handleElementsChange();
    setElements((prev) => alignElements(prev, selectedIds, alignment));
  };

  const handleDistribute = (axis: 'horizontal' | 'vertical') => {
    handleElementsChange();
    setElements((prev) => distributeElements(prev, selectedIds, axis));
  };

  const handleGroup = () => {
    handleElementsChange();
    setElements((prev) => groupElements(prev, selectedIds));
  };

  const handleUngroup = () => {
    handleElementsChange();
    setElements((prev) => ungroupElements(prev, selectedIds));
  };

  // Slide Deck Handlers (Presentation Mode)
  const currentSlides = project.slides || [
    {
      id: 'slide_default',
      title: 'Slide 1',
      elements: elements,
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    },
  ];

  const handleSelectSlide = (idx: number) => {
    // Save current elements to previous slide
    setProject((p) => {
      const slidesCopy = [...(p.slides || currentSlides)];
      if (slidesCopy[activeSlideIndex]) {
        slidesCopy[activeSlideIndex] = {
          ...slidesCopy[activeSlideIndex],
          elements: [...elements],
        };
      }
      return { ...p, slides: slidesCopy };
    });

    setActiveSlideIndex(idx);
    if (currentSlides[idx]) {
      setElements(currentSlides[idx].elements);
    }
  };

  const handleAddSlide = () => {
    handleElementsChange();
    const newSlide: Slide = {
      id: `slide_${Date.now()}`,
      title: `Slide ${currentSlides.length + 1}`,
      elements: [],
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    };

    const updatedSlides = [...currentSlides, newSlide];
    setProject((p) => ({ ...p, slides: updatedSlides }));
    setActiveSlideIndex(updatedSlides.length - 1);
    setElements([]);
  };

  const handleDuplicateSlide = (idx: number) => {
    handleElementsChange();
    const target = currentSlides[idx];
    if (!target) return;

    const dup: Slide = {
      ...target,
      id: `slide_${Date.now()}`,
      title: `${target.title} (Copy)`,
      elements: target.elements.map((el) => ({ ...el, id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })),
    };

    const updatedSlides = [...currentSlides];
    updatedSlides.splice(idx + 1, 0, dup);
    setProject((p) => ({ ...p, slides: updatedSlides }));
    setActiveSlideIndex(idx + 1);
    setElements(dup.elements);
  };

  const handleDeleteSlide = (idx: number) => {
    if (currentSlides.length <= 1) return;
    handleElementsChange();

    const updatedSlides = currentSlides.filter((_, i) => i !== idx);
    const newIndex = Math.min(activeSlideIndex, updatedSlides.length - 1);

    setProject((p) => ({ ...p, slides: updatedSlides }));
    setActiveSlideIndex(newIndex);
    setElements(updatedSlides[newIndex]?.elements || []);
  };

  const handleMoveSlide = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentSlides.length) return;

    handleElementsChange();
    const copy = [...currentSlides];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;

    setProject((p) => ({ ...p, slides: copy }));
    setActiveSlideIndex(targetIdx);
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes any open modal even when a modal input has focus —
      // this must run BEFORE the input/textarea guard below.
      const anyModalOpen =
        isCommandPaletteOpen ||
        isTemplatesModalOpen ||
        isDrawingsModalOpen ||
        isShortcutsModalOpen ||
        isEcosystemModalOpen ||
        isAssetLibraryOpen;
      if (e.key === 'Escape' && anyModalOpen) {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
        setIsTemplatesModalOpen(false);
        setIsDrawingsModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsEcosystemModalOpen(false);
        setIsAssetLibraryOpen(false);
        return;
      }

      // Don't trigger if typing in an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      const isCmd = e.metaKey || e.ctrlKey;

      if (isCmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if (isCmd && e.key.toLowerCase() === 'c') {
        // Copy
        e.preventDefault();
        const selected = elements.filter((el) => selectedIds.includes(el.id));
        setClipboard(selected);
      } else if (isCmd && e.key.toLowerCase() === 'v') {
        // Paste
        e.preventDefault();
        if (clipboard.length > 0) {
          handleElementsChange();
          const pasted = clipboard.map((el) => ({
            ...el,
            id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            x: el.x + 30,
            y: el.y + 30,
            updatedAt: Date.now(),
          }));
          setElements((prev) => [...prev, ...pasted]);
          setSelectedIds(pasted.map((p) => p.id));
        }
      } else if (isCmd && e.key.toLowerCase() === 'd') {
        // Duplicate
        e.preventDefault();
        handleDuplicateSelected();
      } else if (isCmd && e.key.toLowerCase() === 'a') {
        // Select All
        e.preventDefault();
        setSelectedIds(elements.map((el) => el.id));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected
        e.preventDefault();
        handleDeleteSelected();
      } else if (isCmd && e.key.toLowerCase() === 'k') {
        // Open command palette (the palette itself handles toggling closed)
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'Escape') {
        // Clear selection / tool (modals were handled above)
        setSelectedIds([]);
        setActiveTool('select');
      } else if (e.key.toLowerCase() === 'v') {
        setActiveTool('select');
      } else if (e.key.toLowerCase() === 'p') {
        setActiveTool('pencil');
      } else if (e.key.toLowerCase() === 'e') {
        setActiveTool('eraser');
      } else if (e.key.toLowerCase() === 't') {
        setActiveTool('text');
      } else if (e.key.toLowerCase() === 's') {
        setActiveTool('sticky-note');
      } else if (e.key.toLowerCase() === 'm') {
        setActiveTool('mindmap');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    elements,
    selectedIds,
    clipboard,
    handleUndo,
    handleRedo,
    handleElementsChange,
    isCommandPaletteOpen,
    isTemplatesModalOpen,
    isDrawingsModalOpen,
    isShortcutsModalOpen,
    isEcosystemModalOpen,
    isAssetLibraryOpen,
  ]);

  // Selected Elements Operations
  const handleUpdateSelected = (updates: Partial<CanvasElement>) => {
    handleElementsChange();
    setElements((prev) =>
      prev.map((el) => (selectedIds.includes(el.id) ? { ...el, ...updates, updatedAt: Date.now() } : el))
    );
  };

  const handleUpdateElementById = (id: string, updates: Partial<CanvasElement>) => {
    handleElementsChange();
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates, updatedAt: Date.now() } : el))
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    handleElementsChange();
    setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
    setSelectedIds([]);
  };

  const handleDuplicateSelected = () => {
    if (selectedIds.length === 0) return;
    handleElementsChange();
    const dups = elements
      .filter((el) => selectedIds.includes(el.id))
      .map((el) => ({
        ...el,
        id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        x: el.x + 20,
        y: el.y + 20,
        updatedAt: Date.now(),
      }));
    setElements((prev) => [...prev, ...dups]);
    setSelectedIds(dups.map((d) => d.id));
  };

  const handleToggleLock = () => {
    handleElementsChange();
    setElements((prev) =>
      prev.map((el) => (selectedIds.includes(el.id) ? { ...el, locked: !el.locked } : el))
    );
  };

  const handleMoveLayer = (dir: 'up' | 'down' | 'front' | 'back') => {
    if (selectedIds.length === 0) return;
    handleElementsChange();

    setElements((prev) => {
      const selectedIndices = prev
        .map((el, i) => (selectedIds.includes(el.id) ? i : -1))
        .filter((i) => i !== -1);

      const copy = [...prev];

      if (dir === 'front') {
        const selected = copy.filter((el) => selectedIds.includes(el.id));
        const rest = copy.filter((el) => !selectedIds.includes(el.id));
        return [...rest, ...selected];
      } else if (dir === 'back') {
        const selected = copy.filter((el) => selectedIds.includes(el.id));
        const rest = copy.filter((el) => !selectedIds.includes(el.id));
        return [...selected, ...rest];
      } else if (dir === 'up') {
        for (let i = copy.length - 2; i >= 0; i--) {
          if (selectedIds.includes(copy[i].id) && !selectedIds.includes(copy[i + 1].id)) {
            const temp = copy[i];
            copy[i] = copy[i + 1];
            copy[i + 1] = temp;
          }
        }
        return copy;
      } else if (dir === 'down') {
        for (let i = 1; i < copy.length; i++) {
          if (selectedIds.includes(copy[i].id) && !selectedIds.includes(copy[i - 1].id)) {
            const temp = copy[i];
            copy[i] = copy[i - 1];
            copy[i - 1] = temp;
          }
        }
        return copy;
      }
      return copy;
    });
  };

  // Canvas View Controls
  const handleZoomIn = () => setViewport((v) => ({ ...v, zoom: Math.min(5, v.zoom * 1.2) }));
  const handleZoomOut = () => setViewport((v) => ({ ...v, zoom: Math.max(0.2, v.zoom / 1.2) }));
  const handleResetZoom = () => setViewport({ x: 0, y: 0, zoom: 1 });

  const handleFitScreen = () => {
    if (elements.length === 0) {
      handleResetZoom();
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((el) => {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    });

    const padding = 100;
    const contentW = maxX - minX || 800;
    const contentH = maxY - minY || 600;

    const scaleX = (window.innerWidth - padding * 2) / contentW;
    const scaleY = (window.innerHeight - padding * 2) / contentH;
    const zoom = Math.min(Math.max(0.2, Math.min(scaleX, scaleY)), 2);

    const x = (window.innerWidth - contentW * zoom) / 2 - minX * zoom;
    const y = (window.innerHeight - contentH * zoom) / 2 - minY * zoom;

    setViewport({ x, y, zoom });
  };

  // Export Dispatcher
  const handleExport = (format: 'png' | 'jpeg' | 'svg' | 'pdf' | 'nwsdraw') => {
    const bgColor = isDarkMode ? '#020617' : '#ffffff';
    const svgStr = generateSvgFromElements(elements, bgColor);
    const fileName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (format === 'png' || format === 'jpeg') {
      exportToImage(svgStr, fileName, format, bgColor);
    } else if (format === 'svg') {
      exportToSvgFile(svgStr, fileName);
    } else if (format === 'pdf') {
      exportToPdf(svgStr, fileName);
    } else if (format === 'nwsdraw') {
      exportNativeProjectFile({ ...project, elements, viewport, gridType });
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const imported = await importNativeProjectFile(file);
      await saveProject(imported);
      setProject(imported);
      setElements(imported.elements);
      if (imported.viewport) setViewport(imported.viewport);
      if (imported.gridType) setGridType(imported.gridType);
    } catch (err: any) {
      alert(err.message || 'Failed to import project file.');
    }
  };

  // Template Loader
  const handleSelectTemplate = (template: Template) => {
    handleElementsChange();
    const loadedElements: CanvasElement[] = template.elements.map((el, i) => ({
      id: `tmpl_${Date.now()}_${i}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...el,
    })) as CanvasElement[];

    if (template.mode) {
      handleSelectMode(template.mode);
    }

    setElements(loadedElements);
    setSelectedIds([]);
    handleFitScreen();
  };

  const handleCreateNewProject = () => {
    const newProj = createNewProject('New Drawing');
    saveProject(newProj);
    setProject(newProj);
    setElements([]);
    setSelectedIds([]);
    setUndoStack([]);
    setRedoStack([]);
    handleResetZoom();
  };

  if (!hasEntered) {
    return (
      <Landing
        onLaunch={(mode) => {
          if (mode) handleSelectMode(mode);
          setHasEntered(true);
        }}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header Bar */}
      <Header
        project={project}
        onGoHome={() => setHasEntered(false)}
        onRenameProject={(newName) => setProject((p) => ({ ...p, name: newName }))}
        onSelectMode={handleSelectMode}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenDrawings={() => setIsDrawingsModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenEcosystem={() => setIsEcosystemModalOpen(true)}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onToggleLayers={() => setIsLayersOpen(!isLayersOpen)}
        isDarkMode={isDarkMode}
        isLayersOpen={isLayersOpen}
        onExport={handleExport}
        onImportFile={handleImportFile}
      />

      {/* Main Work Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Floating Toolbar (Left) */}
        <Toolbar
          activeTool={activeTool}
          onSelectTool={(tool) => {
            setActiveTool(tool);
            if (tool !== 'select') setSelectedIds([]);
          }}
          onSelectShapeType={setActiveShapeType}
          activeShapeType={activeShapeType}
          onOpenAssetLibrary={() => setIsAssetLibraryOpen(true)}
        />

        {/* Floating Design Preset Bar (Top Center - Design Mode) */}
        {project.mode === 'design' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
            <DesignPresetSelector
              currentPresetId={project.canvasPresetId}
              canvasWidth={project.canvasWidth || 1080}
              canvasHeight={project.canvasHeight || 1080}
              backgroundColor={project.backgroundColor || (isDarkMode ? '#0f172a' : '#ffffff')}
              onSelectPreset={(preset) => {
                handleElementsChange();
                setProject((p) => ({
                  ...p,
                  canvasPresetId: preset.id,
                  canvasWidth: preset.width,
                  canvasHeight: preset.height,
                  backgroundColor: preset.backgroundColor || p.backgroundColor,
                }));
              }}
              onChangeCustomDimensions={(width, height) => {
                handleElementsChange();
                setProject((p) => ({ ...p, canvasWidth: width, canvasHeight: height, canvasPresetId: undefined }));
              }}
              onChangeBackgroundColor={(color) => {
                handleElementsChange();
                setProject((p) => ({ ...p, backgroundColor: color }));
              }}
            />
          </div>
        )}

        {/* Alignment & Object Operations Bar */}
        <AlignmentToolbar
          selectedCount={selectedIds.length}
          hasGroupedElements={elements.some((el) => selectedIds.includes(el.id) && !!el.groupId)}
          onAlign={handleAlign}
          onDistribute={handleDistribute}
          onGroup={handleGroup}
          onUngroup={handleUngroup}
          onDuplicate={handleDuplicateSelected}
          onDelete={handleDeleteSelected}
        />

        {/* Floating Properties Panel (Right) */}
        <PropertiesPanel
          selectedElements={elements.filter((el) => selectedIds.includes(el.id))}
          onUpdateElement={handleUpdateSelected}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateSelected={handleDuplicateSelected}
          onToggleLock={handleToggleLock}
          onMoveLayer={handleMoveLayer}
          onGroupSelected={handleGroup}
          onUngroupSelected={handleUngroup}
        />

        {/* Slideout Layers Manager */}
        <LayersPanel
          isOpen={isLayersOpen}
          onClose={() => setIsLayersOpen(false)}
          elements={elements}
          selectedIds={selectedIds}
          onSelectElement={(id, multi) => {
            if (multi) {
              setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
            } else {
              setSelectedIds([id]);
            }
          }}
          onUpdateElement={handleUpdateElementById}
          onDeleteElement={(id) => {
            handleElementsChange();
            setElements((prev) => prev.filter((el) => el.id !== id));
          }}
          onReorder={() => {}}
        />

        {/* Infinite Canvas */}
        <Canvas
          elements={elements}
          setElements={setElements}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          activeTool={activeTool}
          activeShapeType={activeShapeType}
          viewport={viewport}
          setViewport={setViewport}
          gridType={gridType}
          isDarkMode={isDarkMode}
          onElementsChange={handleElementsChange}
        />

        {/* Minimap Overview Radar */}
        {isMinimapOpen && (
          <Minimap
            elements={elements}
            viewport={viewport}
            onNavigateViewport={(x, y) => setViewport((v) => ({ ...v, x, y }))}
          />
        )}

        {/* Bottom Bar Controls */}
        <BottomBar
          viewport={viewport}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onFitScreen={handleFitScreen}
          gridType={gridType}
          onSelectGridType={setGridType}
          isMinimapOpen={isMinimapOpen}
          onToggleMinimap={() => setIsMinimapOpen(!isMinimapOpen)}
        />

        {/* Presentation Slide Deck Bottom Bar (Presentation Mode) */}
        {project.mode === 'presentation' && (
          <PresentationSlidesBar
            slides={currentSlides}
            activeSlideIndex={activeSlideIndex}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onMoveSlide={handleMoveSlide}
            onStartPresentationMode={() => setIsPresentationViewOpen(true)}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <AssetLibraryModal
        isOpen={isAssetLibraryOpen}
        onClose={() => setIsAssetLibraryOpen(false)}
        onAddAsset={handleAddAsset}
      />

      <PresentationViewModal
        isOpen={isPresentationViewOpen}
        slides={currentSlides}
        initialSlideIndex={activeSlideIndex}
        onClose={() => setIsPresentationViewOpen(false)}
      />

      {/* Dialog Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={setActiveTool}
        onSelectShape={(st) => {
          setActiveShapeType(st);
          setActiveTool('shape');
        }}
        onExport={handleExport}
        onClearCanvas={() => {
          if (confirm('Are you sure you want to clear all canvas elements?')) {
            handleElementsChange();
            setElements([]);
            setSelectedIds([]);
          }
        }}
        onResetZoom={handleResetZoom}
        onFitScreen={handleFitScreen}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenDrawings={() => setIsDrawingsModalOpen(true)}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSetGrid={setGridType}
        isDarkMode={isDarkMode}
      />

      <ShortcutsModal isOpen={isShortcutsModalOpen} onClose={() => setIsShortcutsModalOpen(false)} />

      <MyDrawingsModal
        isOpen={isDrawingsModalOpen}
        onClose={() => setIsDrawingsModalOpen(false)}
        currentProjectId={project.id}
        onSelectProject={(proj) => {
          setProject(proj);
          setElements(proj.elements);
          if (proj.viewport) setViewport(proj.viewport);
          if (proj.gridType) setGridType(proj.gridType);
        }}
        onCreateNew={handleCreateNewProject}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <EcosystemModal isOpen={isEcosystemModalOpen} onClose={() => setIsEcosystemModalOpen(false)} />
    </div>
  );
}
