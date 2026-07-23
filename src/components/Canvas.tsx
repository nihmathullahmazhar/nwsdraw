import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasElement, ToolType, ElementType, Point, Viewport, GridType, ResizeHandle } from '../types';
import {
  Award,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  Cloud,
  Code,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Globe,
  Lock,
  Server,
  Shield,
  Star,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

/** Lucide icons used by Asset Library elements (el.iconName). */
const ASSET_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Award, Briefcase, Calendar, Check, CheckCircle, Cloud, Code, Cpu, Database,
  DollarSign, FileText, Globe, Lock, Server, Shield, Star, Target, Terminal,
  TrendingUp, Users, Zap,
};

/** Points string for a 5-point star fitting a w×h box. */
function starPoints(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const outerR = Math.min(w, h) / 2;
  const innerR = outerR * 0.4;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Points string for a hexagon fitting a w×h box. */
function hexagonPoints(w: number, h: number): string {
  return `${w * 0.25},0 ${w * 0.75},0 ${w},${h / 2} ${w * 0.75},${h} ${w * 0.25},${h} 0,${h / 2}`;
}

interface CanvasProps {
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeTool: ToolType;
  activeShapeType: ElementType;
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  gridType: GridType;
  isDarkMode: boolean;
  onElementsChange: () => void;
  /** Design mode: fixed artboard drawn behind the elements at canvas (0,0). */
  artboard?: { width: number; height: number; background: string; label: string } | null;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  setElements,
  selectedIds,
  setSelectedIds,
  activeTool,
  activeShapeType,
  viewport,
  setViewport,
  gridType,
  isDarkMode,
  onElementsChange,
  artboard,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    mouseX: number;
    mouseY: number;
    elements: { id: string; x: number; y: number; width: number; height: number; rotation: number }[];
  } | null>(null);

  const [selectionBox, setSelectionBox] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Inline editing text
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Connector drawing state
  const [connectorStartId, setConnectorStartId] = useState<string | null>(null);

  // Screen to Canvas coordinate conversion
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => {
      if (!containerRef.current) return { x: screenX, y: screenY };
      const rect = containerRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - viewport.x) / viewport.zoom;
      const y = (screenY - rect.top - viewport.y) / viewport.zoom;
      return { x, y };
    },
    [viewport]
  );

  // Wheel Pan & Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(Math.max(0.2, viewport.zoom * zoomFactor), 5);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
      const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);

      setViewport({ x: newX, y: newY, zoom: newZoom });
    } else {
      // Pan
      setViewport((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Keyboard Mind Map handling (Tab = add child, Enter = add sibling)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingElementId) return; // ignore if typing inline
      if (selectedIds.length !== 1) return;

      const selectedEl = elements.find((el) => el.id === selectedIds[0]);
      if (!selectedEl || (selectedEl.type !== 'mindmap-node' && activeTool !== 'mindmap')) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        // Add Child Node
        const childId = `mm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const newChild: CanvasElement = {
          id: childId,
          type: 'mindmap-node',
          x: selectedEl.x + selectedEl.width + 120,
          y: selectedEl.y + (Math.random() * 80 - 40),
          width: 130,
          height: 50,
          fillColor: isDarkMode ? '#1e293b' : '#3b82f6',
          strokeColor: '#2563eb',
          strokeWidth: 2,
          text: 'New Sub-Idea',
          fontSize: 13,
          textColor: '#ffffff',
          parentId: selectedEl.id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setElements((prev) => [...prev, newChild]);
        setSelectedIds([childId]);
        setEditingElementId(childId);
        setEditingText('New Sub-Idea');
        onElementsChange();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Add Sibling Node
        const parentId = selectedEl.parentId;
        const newSiblingId = `mm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const newSibling: CanvasElement = {
          id: newSiblingId,
          type: 'mindmap-node',
          x: selectedEl.x,
          y: selectedEl.y + selectedEl.height + 40,
          width: 130,
          height: 50,
          fillColor: selectedEl.fillColor || '#3b82f6',
          strokeColor: selectedEl.strokeColor || '#2563eb',
          strokeWidth: 2,
          text: 'New Branch',
          fontSize: 13,
          textColor: '#ffffff',
          parentId: parentId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setElements((prev) => [...prev, newSibling]);
        setSelectedIds([newSiblingId]);
        setEditingElementId(newSiblingId);
        setEditingText('New Branch');
        onElementsChange();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, elements, editingElementId, activeTool, isDarkMode, setElements, setSelectedIds, onElementsChange]);

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent) => {
    if (editingElementId) {
      // Save pending text edits
      saveEditingText();
    }

    const pt = screenToCanvas(e.clientX, e.clientY);

    // Pan mode (spacebar, middle click, or hand tool)
    if (e.button === 1 || e.spaceKey || activeTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      return;
    }

    // Check hit test on elements (from top layer down)
    const clickedElement = [...elements]
      .reverse()
      .find(
        (el) =>
          !el.hidden &&
          pt.x >= el.x &&
          pt.x <= el.x + el.width &&
          pt.y >= el.y &&
          pt.y <= el.y + el.height
      );

    if (activeTool === 'select') {
      if (clickedElement) {
        if (!selectedIds.includes(clickedElement.id)) {
          if (e.shiftKey) {
            setSelectedIds((prev) => [...prev, clickedElement.id]);
          } else {
            setSelectedIds([clickedElement.id]);
          }
        }
        if (!clickedElement.locked) {
          setIsDraggingElement(true);
          setDragOffset({ x: pt.x, y: pt.y });
        }
      } else {
        // Start selection box
        setSelectedIds([]);
        setSelectionBox({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
      }
      return;
    }

    if (activeTool === 'eraser') {
      if (clickedElement) {
        setElements((prev) => prev.filter((el) => el.id !== clickedElement.id));
        onElementsChange();
      }
      return;
    }

    // Drawing freehand tools
    if (activeTool === 'pencil' || activeTool === 'pen' || activeTool === 'highlighter') {
      setIsDrawing(true);
      setCurrentPoints([pt]);
      return;
    }

    // Create Lines / Arrows / Connectors
    if (activeTool === 'line' || activeTool === 'arrow') {
      setIsDrawing(true);
      setCurrentPoints([pt, pt]);
      if (clickedElement) setConnectorStartId(clickedElement.id);
      return;
    }

    // Create New Shapes / Sticky Notes / Text / Mindmap / Flowchart / Wireframe
    let newType: ElementType = 'rectangle';
    let defaultWidth = 120;
    let defaultHeight = 80;
    let defaultText = '';
    let fillColor = isDarkMode ? '#1e293b' : '#ffffff';
    let strokeColor = isDarkMode ? '#94a3b8' : '#000000';

    if (activeTool === 'sticky-note') {
      newType = 'sticky-note';
      defaultWidth = 180;
      defaultHeight = 160;
      fillColor = '#fef08a'; // yellow sticky
      strokeColor = '#eab308';
      defaultText = 'Double click to edit note...';
    } else if (activeTool === 'text') {
      newType = 'text';
      defaultWidth = 160;
      defaultHeight = 40;
      fillColor = 'transparent';
      strokeColor = 'transparent';
      defaultText = 'Type text here...';
    } else if (activeTool === 'shape') {
      newType = activeShapeType || 'rectangle';
      if (newType === 'circle') defaultWidth = defaultHeight = 100;
    } else if (activeTool === 'flowchart') {
      newType = activeShapeType || 'flowchart-process';
      fillColor = '#e0f2fe';
      strokeColor = '#0284c7';
      defaultText = 'Process';
    } else if (activeTool === 'mindmap') {
      newType = 'mindmap-node';
      fillColor = '#3b82f6';
      strokeColor = '#1d4ed8';
      defaultText = 'Main Idea';
    } else if (activeTool === 'wireframe') {
      newType = activeShapeType || 'wireframe-card';
      if (newType === 'wireframe-browser') {
        defaultWidth = 600;
        defaultHeight = 400;
        defaultText = 'https://app.com';
      } else if (newType === 'wireframe-mobile') {
        defaultWidth = 260;
        defaultHeight = 480;
      }
    }

    const newId = `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEl: CanvasElement = {
      id: newId,
      type: newType,
      x: pt.x - defaultWidth / 2,
      y: pt.y - defaultHeight / 2,
      width: defaultWidth,
      height: defaultHeight,
      fillColor,
      strokeColor,
      strokeWidth: 2,
      text: defaultText,
      fontSize: 14,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setElements((prev) => [...prev, newEl]);
    setSelectedIds([newId]);
    onElementsChange();

    if (defaultText) {
      // Defer opening the inline editor to the next tick: the browser's native
      // mousedown focus action runs right after this handler and would blur an
      // immediately-mounted textarea, closing the editor before it appears.
      setTimeout(() => {
        setEditingElementId(newId);
        setEditingText(defaultText);
      }, 0);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setViewport((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
      return;
    }

    const pt = screenToCanvas(e.clientX, e.clientY);

    if (selectionBox) {
      setSelectionBox((prev) => (prev ? { ...prev, x2: pt.x, y2: pt.y } : null));
      return;
    }

    if (isDraggingElement && selectedIds.length > 0) {
      const dx = pt.x - dragOffset.x;
      const dy = pt.y - dragOffset.y;

      setElements((prev) =>
        prev.map((el) => {
          if (selectedIds.includes(el.id) && !el.locked) {
            return {
              ...el,
              x: el.x + dx,
              y: el.y + dy,
              points: el.points ? el.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) : undefined,
              updatedAt: Date.now(),
            };
          }
          return el;
        })
      );
      setDragOffset({ x: pt.x, y: pt.y });
      return;
    }

    if (activeHandle && resizeStart) {
      const dx = e.clientX - resizeStart.mouseX;
      const dy = e.clientY - resizeStart.mouseY;

      setElements((prev) =>
        prev.map((el) => {
          const init = resizeStart.elements.find((item) => item.id === el.id);
          if (!init) return el;

          let newX = init.x;
          let newY = init.y;
          let newW = init.width;
          let newH = init.height;

          const scaleDx = dx / viewport.zoom;
          const scaleDy = dy / viewport.zoom;

          if (activeHandle === 'e' || activeHandle === 'ne' || activeHandle === 'se') {
            newW = Math.max(20, init.width + scaleDx);
          }
          if (activeHandle === 's' || activeHandle === 'se' || activeHandle === 'sw') {
            newH = Math.max(20, init.height + scaleDy);
          }
          if (activeHandle === 'w' || activeHandle === 'nw' || activeHandle === 'sw') {
            const possibleW = init.width - scaleDx;
            if (possibleW >= 20) {
              newW = possibleW;
              newX = init.x + scaleDx;
            }
          }
          if (activeHandle === 'n' || activeHandle === 'nw' || activeHandle === 'ne') {
            const possibleH = init.height - scaleDy;
            if (possibleH >= 20) {
              newH = possibleH;
              newY = init.y + scaleDy;
            }
          }

          if (activeHandle === 'rotate') {
            const centerX = init.x + init.width / 2;
            const centerY = init.y + init.height / 2;
            const angle = Math.atan2(pt.y - centerY, pt.x - centerX) * (180 / Math.PI) + 90;
            return { ...el, rotation: Math.round(angle) };
          }

          return { ...el, x: newX, y: newY, width: newW, height: newH };
        })
      );
      return;
    }

    if (isDrawing) {
      setCurrentPoints((prev) => [...prev, pt]);
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    setIsDraggingElement(false);
    setActiveHandle(null);
    setResizeStart(null);

    if (selectionBox) {
      const minX = Math.min(selectionBox.x1, selectionBox.x2);
      const maxX = Math.max(selectionBox.x1, selectionBox.x2);
      const minY = Math.min(selectionBox.y1, selectionBox.y2);
      const maxY = Math.max(selectionBox.y1, selectionBox.y2);

      const enclosed = elements.filter(
        (el) =>
          !el.hidden &&
          el.x >= minX &&
          el.x + el.width <= maxX &&
          el.y >= minY &&
          el.y + el.height <= maxY
      );

      setSelectedIds(enclosed.map((el) => el.id));
      setSelectionBox(null);
    }

    if (isDrawing) {
      setIsDrawing(false);
      if (currentPoints.length > 0) {
        const pt = screenToCanvas(e.clientX, e.clientY);
        const clickedEndElement = [...elements]
          .reverse()
          .find(
            (el) =>
              !el.hidden &&
              pt.x >= el.x &&
              pt.x <= el.x + el.width &&
              pt.y >= el.y &&
              pt.y <= el.y + el.height
          );

        let elType: ElementType = 'pencil';
        if (activeTool === 'pen') elType = 'pen';
        if (activeTool === 'highlighter') elType = 'highlighter';
        if (activeTool === 'line') elType = 'line';
        if (activeTool === 'arrow') elType = 'arrow';

        const newId = `stroke_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const strokeColor = activeTool === 'highlighter' ? '#fde047' : isDarkMode ? '#e2e8f0' : '#0f172a';

        const newStroke: CanvasElement = {
          id: newId,
          type: elType,
          x: currentPoints[0].x,
          y: currentPoints[0].y,
          width: Math.abs(currentPoints[currentPoints.length - 1].x - currentPoints[0].x) || 10,
          height: Math.abs(currentPoints[currentPoints.length - 1].y - currentPoints[0].y) || 10,
          points: currentPoints,
          strokeColor,
          strokeWidth: activeTool === 'highlighter' ? 16 : 2,
          opacity: activeTool === 'highlighter' ? 0.4 : 1,
          startElementId: connectorStartId || undefined,
          endElementId: clickedEndElement?.id || undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setElements((prev) => [...prev, newStroke]);
        onElementsChange();
      }
      setCurrentPoints([]);
      setConnectorStartId(null);
    }
  };

  // Double click element for inline text editing
  const handleDoubleClick = (el: CanvasElement) => {
    setEditingElementId(el.id);
    setEditingText(el.text || '');
  };

  const saveEditingText = () => {
    if (editingElementId) {
      setElements((prev) =>
        prev.map((el) => (el.id === editingElementId ? { ...el, text: editingText, updatedAt: Date.now() } : el))
      );
      setEditingElementId(null);
      onElementsChange();
    }
  };

  const startResize = (handle: ResizeHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elements: elements
        .filter((el) => selectedIds.includes(el.id))
        .map((el) => ({ id: el.id, x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation || 0 })),
    });
  };

  // Render Background Grid Patterns
  const renderGridPattern = () => {
    if (gridType === 'blank') return null;

    const size = 20 * viewport.zoom;

    if (gridType === 'dots') {
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <pattern
              id="grid-dots"
              width={size}
              height={size}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${viewport.x} ${viewport.y})`}
            >
              <circle cx={2} cy={2} r={1.2} fill={isDarkMode ? '#94a3b8' : '#64748b'} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>
      );
    }

    if (gridType === 'lines') {
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <pattern
              id="grid-lines"
              width={size}
              height={size}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${viewport.x} ${viewport.y})`}
            >
              <path
                d={`M ${size} 0 L 0 0 0 ${size}`}
                fill="none"
                stroke={isDarkMode ? '#64748b' : '#cbd5e1'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-lines)" />
        </svg>
      );
    }

    if (gridType === 'isometric') {
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
          <defs>
            <pattern
              id="grid-iso"
              width={size * 1.732}
              height={size}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${viewport.x} ${viewport.y})`}
            >
              <path
                d={`M 0 ${size / 2} L ${size * 0.866} 0 L ${size * 1.732} ${size / 2} L ${size * 0.866} ${size} Z`}
                fill="none"
                stroke={isDarkMode ? '#64748b' : '#cbd5e1'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-iso)" />
        </svg>
      );
    }
  };

  // Helper to render individual element shapes
  const renderElement = (el: CanvasElement) => {
    if (el.hidden) return null;

    const isSelected = selectedIds.includes(el.id);
    const isEditing = editingElementId === el.id;

    // Recalculate smart connectors dynamically if connected
    let finalPoints = el.points;
    if ((el.type === 'line' || el.type === 'arrow' || el.type === 'connector') && el.startElementId) {
      const startEl = elements.find((e) => e.id === el.startElementId);
      const endEl = elements.find((e) => e.id === el.endElementId);
      if (startEl) {
        const startPt = { x: startEl.x + startEl.width / 2, y: startEl.y + startEl.height / 2 };
        const endPt = endEl
          ? { x: endEl.x + endEl.width / 2, y: endEl.y + endEl.height / 2 }
          : el.points?.[1] || { x: el.x + 100, y: el.y + 100 };
        finalPoints = [startPt, endPt];
      }
    }

    const stroke = el.strokeColor || (isDarkMode ? '#e2e8f0' : '#0f172a');
    const fill = el.fillColor || 'transparent';
    const sw = el.strokeWidth ?? 2;
    const opacity = el.opacity ?? 1;

    let dashArray: string | undefined = undefined;
    if (el.strokeStyle === 'dashed') dashArray = '6,6';
    if (el.strokeStyle === 'dotted') dashArray = '2,4';

    const rotationStyle = el.rotation ? { transform: `rotate(${el.rotation}deg)` } : {};

    return (
      <div
        key={el.id}
        onDoubleClick={() => handleDoubleClick(el)}
        style={{
          position: 'absolute',
          left: el.x,
          top: el.y,
          // Never 0: an SVG with zero width/height is skipped entirely by the
          // renderer, which made element-bound connectors (w/h 0) invisible.
          width: Math.max(el.width, 1),
          height: Math.max(el.height, 1),
          opacity,
          ...rotationStyle,
        }}
        className={`group ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      >
        {/* Imported image element */}
        {el.type === 'image' && el.src && (
          <img
            src={el.src}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-fill rounded-sm pointer-events-none select-none"
          />
        )}
        <svg className="w-full h-full overflow-visible pointer-events-none">
          {/* Pencil / Pen / Highlighter Path */}
          {(el.type === 'pencil' || el.type === 'pen' || el.type === 'highlighter') && finalPoints && (
            <path
              d={finalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x - el.x} ${p.y - el.y}`).join(' ')}
              stroke={stroke}
              strokeWidth={sw}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dashArray}
            />
          )}

          {/* Line, Arrow, Double Arrow & Connector */}
          {(el.type === 'line' || el.type === 'arrow' || el.type === 'double-arrow' || el.type === 'connector') &&
            finalPoints &&
            finalPoints.length >= 2 &&
            (() => {
              const x1 = finalPoints[0].x - el.x;
              const y1 = finalPoints[0].y - el.y;
              const x2 = finalPoints[1].x - el.x;
              const y2 = finalPoints[1].y - el.y;
              const angle = Math.atan2(y2 - y1, x2 - x1);
              const head = (hx: number, hy: number, a: number) => {
                const s = 10;
                return `${hx},${hy} ${hx - s * Math.cos(a - 0.45)},${hy - s * Math.sin(a - 0.45)} ${
                  hx - s * Math.cos(a + 0.45)
                },${hy - s * Math.sin(a + 0.45)}`;
              };
              const hasEndHead = el.type === 'arrow' || el.type === 'double-arrow' || el.type === 'connector';
              return (
                <g>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
                  {hasEndHead && <polygon points={head(x2, y2, angle)} fill={stroke} />}
                  {el.type === 'double-arrow' && <polygon points={head(x1, y1, angle + Math.PI)} fill={stroke} />}
                  {/* Label at the midpoint (connector text like Yes / No) */}
                  {el.text && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 7}
                      textAnchor="middle"
                      fontSize={el.fontSize || 12}
                      fontWeight={600}
                      fill={el.textColor || stroke}
                      stroke={isDarkMode ? '#020617' : '#f8fafc'}
                      strokeWidth={4}
                      paintOrder="stroke"
                      style={{ fontFamily: 'system-ui, sans-serif' }}
                    >
                      {el.text}
                    </text>
                  )}
                </g>
              );
            })()}

          {/* Shapes */}
          {el.type === 'rectangle' && (
            <rect width={el.width} height={el.height} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {(el.type === 'rounded-rectangle' || el.type === 'wireframe-button') && (
            <rect width={el.width} height={el.height} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {el.type === 'circle' && (
            <ellipse cx={el.width / 2} cy={el.height / 2} rx={el.width / 2} ry={el.height / 2} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {el.type === 'triangle' && (
            <polygon
              points={`${el.width / 2},0 ${el.width},${el.height} 0,${el.height}`}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              strokeDasharray={dashArray}
            />
          )}

          {(el.type === 'diamond' || el.type === 'flowchart-decision') && (
            <polygon
              points={`${el.width / 2},0 ${el.width},${el.height / 2} ${el.width / 2},${el.height} 0,${el.height / 2}`}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              strokeDasharray={dashArray}
            />
          )}

          {/* Flowchart Start / End */}
          {el.type === 'flowchart-start' && (
            <rect width={el.width} height={el.height} rx={el.height / 2} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {/* Flowchart Process */}
          {el.type === 'flowchart-process' && (
            <rect width={el.width} height={el.height} rx={4} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {/* Sticky Note */}
          {el.type === 'sticky-note' && (
            <g>
              <rect width={el.width} height={el.height} rx={6} fill={fill} stroke={stroke} strokeWidth={1} className="shadow-lg" />
            </g>
          )}

          {/* Mind Map Node */}
          {el.type === 'mindmap-node' && (
            <rect width={el.width} height={el.height} rx={20} fill={fill} stroke={stroke} strokeWidth={sw} />
          )}

          {/* Architecture Cloud / Server / DB / Client */}
          {(el.type === 'arch-cloud' || el.type === 'arch-server' || el.type === 'arch-database' || el.type === 'arch-client') && (
            <rect width={el.width} height={el.height} rx={12} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {/* Wireframe Mobile Frame */}
          {el.type === 'wireframe-mobile' && (
            <g>
              <rect width={el.width} height={el.height} rx={24} fill={fill} stroke={stroke} strokeWidth={sw} />
              <rect x={el.width / 2 - 25} y={12} width={50} height={12} rx={6} fill={stroke} />
            </g>
          )}

          {/* Wireframe Browser Frame */}
          {el.type === 'wireframe-browser' && (
            <g>
              <rect width={el.width} height={el.height} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} />
              <line x1={0} y1={36} x2={el.width} y2={36} stroke={stroke} strokeWidth={1} />
              <circle cx={16} cy={18} r={4} fill="#ef4444" />
              <circle cx={32} cy={18} r={4} fill="#f59e0b" />
              <circle cx={48} cy={18} r={4} fill="#10b981" />
            </g>
          )}

          {/* Wireframe Card & Form */}
          {(el.type === 'wireframe-card' || el.type === 'wireframe-form') && (
            <rect width={el.width} height={el.height} rx={12} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {/* Star & Hexagon */}
          {el.type === 'star' && (
            <polygon points={starPoints(el.width, el.height)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} strokeLinejoin="round" />
          )}
          {el.type === 'hexagon' && (
            <polygon points={hexagonPoints(el.width, el.height)} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dashArray} />
          )}

          {/* Flowchart: Input (parallelogram), Database (cylinder), Document (wavy base) */}
          {el.type === 'flowchart-input' && (
            <polygon
              points={`${el.width * 0.2},0 ${el.width},0 ${el.width * 0.8},${el.height} 0,${el.height}`}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              strokeDasharray={dashArray}
            />
          )}
          {el.type === 'flowchart-db' && (
            <g>
              <path
                d={`M 0 ${el.height * 0.15} L 0 ${el.height * 0.85} A ${el.width / 2} ${el.height * 0.15} 0 0 0 ${el.width} ${el.height * 0.85} L ${el.width} ${el.height * 0.15}`}
                fill={fill}
                stroke={stroke}
                strokeWidth={sw}
              />
              <ellipse cx={el.width / 2} cy={el.height * 0.15} rx={el.width / 2} ry={el.height * 0.15} fill={fill} stroke={stroke} strokeWidth={sw} />
            </g>
          )}
          {el.type === 'flowchart-doc' && (
            <path
              d={`M 0 0 L ${el.width} 0 L ${el.width} ${el.height * 0.82} Q ${el.width * 0.75} ${el.height * 1.02} ${el.width * 0.5} ${el.height * 0.87} Q ${el.width * 0.25} ${el.height * 0.72} 0 ${el.height * 0.87} Z`}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              strokeDasharray={dashArray}
            />
          )}

          {/* UML Class & ERD */}
          {(el.type === 'uml-class' || el.type === 'erd-entity') && (
            <g>
              <rect width={el.width} height={el.height} rx={4} fill={fill} stroke={stroke} strokeWidth={sw} />
              {el.type === 'uml-class' && (
                <>
                  <line x1={0} y1={el.height * 0.3} x2={el.width} y2={el.height * 0.3} stroke={stroke} strokeWidth={1} />
                  <line x1={0} y1={el.height * 0.65} x2={el.width} y2={el.height * 0.65} stroke={stroke} strokeWidth={1} />
                </>
              )}
            </g>
          )}
          {el.type === 'erd-relation' && (
            <polygon
              points={`${el.width / 2},0 ${el.width},${el.height / 2} ${el.width / 2},${el.height} 0,${el.height / 2}`}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
            />
          )}

          {/* Wireframe kit */}
          {el.type === 'wireframe-navbar' && (
            <g>
              <rect width={el.width} height={el.height} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} />
              <circle cx={el.height / 2} cy={el.height / 2} r={el.height * 0.22} fill={stroke} opacity={0.7} />
              {[0.55, 0.7, 0.85].map((fx, i) => (
                <line
                  key={i}
                  x1={el.width * fx}
                  y1={el.height * 0.35}
                  x2={el.width * fx + Math.min(28, el.width * 0.1)}
                  y2={el.height * 0.35}
                  stroke={stroke}
                  strokeWidth={el.height * 0.28}
                  opacity={0.45}
                />
              ))}
            </g>
          )}
          {el.type === 'wireframe-sidebar' && (
            <g>
              <rect width={el.width} height={el.height} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} />
              {[0.15, 0.28, 0.41, 0.54].map((fy, i) => (
                <rect key={i} x={el.width * 0.12} y={el.height * fy} width={el.width * 0.76} height={el.height * 0.06} rx={3} fill={stroke} opacity={i === 0 ? 0.7 : 0.35} />
              ))}
            </g>
          )}
          {el.type === 'wireframe-image' && (
            <g>
              <rect width={el.width} height={el.height} rx={6} fill={fill} stroke={stroke} strokeWidth={sw} />
              <line x1={0} y1={0} x2={el.width} y2={el.height} stroke={stroke} strokeWidth={1} opacity={0.6} />
              <line x1={el.width} y1={0} x2={0} y2={el.height} stroke={stroke} strokeWidth={1} opacity={0.6} />
            </g>
          )}
          {el.type === 'wireframe-input' && (
            <g>
              <rect width={el.width} height={el.height} rx={6} fill={fill} stroke={stroke} strokeWidth={sw} />
              <line x1={10} y1={el.height * 0.25} x2={10} y2={el.height * 0.75} stroke={stroke} strokeWidth={1.5} opacity={0.7} />
            </g>
          )}
          {el.type === 'wireframe-toggle' && (
            <g>
              <rect width={el.width} height={el.height} rx={el.height / 2} fill={fill} stroke={stroke} strokeWidth={sw} />
              <circle cx={el.width - el.height / 2} cy={el.height / 2} r={el.height * 0.34} fill={stroke} />
            </g>
          )}
          {el.type === 'wireframe-badge' && (
            <rect width={el.width} height={el.height} rx={el.height / 2} fill={fill} stroke={stroke} strokeWidth={sw} />
          )}
          {el.type === 'wireframe-dropdown' && (
            <g>
              <rect width={el.width} height={el.height} rx={6} fill={fill} stroke={stroke} strokeWidth={sw} />
              <polyline
                points={`${el.width - 22},${el.height * 0.42} ${el.width - 15},${el.height * 0.58} ${el.width - 8},${el.height * 0.42}`}
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Asset icon chip background */}
          {el.type === 'asset-icon' && (
            <rect width={el.width} height={el.height} rx={12} fill={fill} stroke={stroke} strokeWidth={sw} />
          )}

          {/* Asset Badge / Sticker */}
          {(el.type === 'asset-badge' || el.type === 'asset-sticker') && (
            <rect width={el.width} height={el.height} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} />
          )}
        </svg>

        {/* Asset icon glyph (lucide) */}
        {el.type === 'asset-icon' && el.iconName && ASSET_ICONS[el.iconName] && (
          <div className="absolute inset-x-0 top-0 bottom-[35%] flex items-center justify-center pointer-events-none">
            {(() => {
              const Icon = ASSET_ICONS[el.iconName!];
              const size = Math.min(el.width, el.height) * 0.38;
              return <Icon style={{ width: size, height: size, color: el.strokeColor || stroke }} />;
            })()}
          </div>
        )}

        {/* Text inside elements */}
        {el.text &&
          !isEditing &&
          !(el.type === 'line' || el.type === 'arrow' || el.type === 'double-arrow' || el.type === 'connector') && (
          <div
            className="absolute inset-0 flex justify-center p-2 text-center pointer-events-none select-none overflow-hidden"
            style={{
              // Asset icon chips draw their glyph in the top part — text sits below it
              alignItems: el.type === 'asset-icon' ? 'flex-end' : 'center',
              fontSize: el.type === 'asset-icon' ? Math.min(el.fontSize || 12, 12) : el.fontSize || 14,
              fontFamily: el.fontFamily === 'serif' ? 'Georgia, serif' : el.fontFamily === 'mono' ? 'monospace' : 'system-ui, sans-serif',
              color: el.textColor || (el.type === 'sticky-note' ? '#854d0e' : isDarkMode ? '#f8fafc' : '#0f172a'),
              fontWeight: el.fontWeight || 'normal',
              textAlign: el.textAlign || 'center',
            }}
          >
            {el.text}
          </div>
        )}

        {/* Inline Text Area Editor */}
        {isEditing && (
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={saveEditingText}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && el.type !== 'sticky-note') {
                e.preventDefault();
                saveEditingText();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                saveEditingText();
              }
            }}
            className="absolute inset-0 w-full h-full p-2 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border-2 border-indigo-500 rounded-lg focus:outline-none resize-none text-center text-sm font-medium z-30"
            autoFocus
          />
        )}

        {/* Handles when selected */}
        {isSelected && !el.locked && (
          <>
            {/* Rotate handle */}
            <div
              onMouseDown={(e) => startResize('rotate', e)}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-full cursor-grab hover:scale-125 transition-transform shadow-xs"
              title="Rotate Shape"
            />
            {/* Corner Resize Handles */}
            <div
              onMouseDown={(e) => startResize('nw', e)}
              className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-full cursor-nwse-resize"
            />
            <div
              onMouseDown={(e) => startResize('ne', e)}
              className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-full cursor-nesw-resize"
            />
            <div
              onMouseDown={(e) => startResize('se', e)}
              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-full cursor-nwse-resize"
            />
            <div
              onMouseDown={(e) => startResize('sw', e)}
              className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-full cursor-nesw-resize"
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none cursor-${
        activeTool === 'pan' ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair'
      } ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F8F9FA] text-slate-900'}`}
    >
      {/* Background Grid Pattern */}
      {renderGridPattern()}

      {/* Transform Container for Infinite Canvas */}
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
        }}
      >
        {/* Design-mode artboard — the fixed canvas drawn behind all elements */}
        {artboard && (
          <>
            <div
              className="absolute font-mono text-[11px] tracking-wider text-slate-400 dark:text-slate-500 select-none pointer-events-none"
              style={{ left: 0, top: -24 }}
            >
              {artboard.label} · {artboard.width} × {artboard.height}
            </div>
            <div
              className="absolute pointer-events-none rounded-sm ring-1 ring-slate-300/70 dark:ring-slate-600/70 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.35)]"
              style={{
                left: 0,
                top: 0,
                width: artboard.width,
                height: artboard.height,
                background: artboard.background,
              }}
            />
          </>
        )}

        {/* Render all Mindmap Connection Lines between nodes */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          {elements
            .filter((el) => el.type === 'mindmap-node' && el.parentId)
            .map((node) => {
              const parent = elements.find((p) => p.id === node.parentId);
              if (!parent) return null;

              const x1 = parent.x + parent.width;
              const y1 = parent.y + parent.height / 2;
              const x2 = node.x;
              const y2 = node.y + node.height / 2;

              // Smooth Bezier Curve Branch
              const dx = (x2 - x1) / 2;
              const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <path
                  key={`mm_branch_${node.id}`}
                  d={path}
                  stroke={node.strokeColor || '#4f46e5'}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
        </svg>

        {/* Render Elements Stack */}
        {elements.map((el) => renderElement(el))}

        {/* Active Freehand Drawing Preview */}
        {isDrawing && currentPoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            <path
              d={currentPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              stroke={activeTool === 'highlighter' ? '#fde047' : isDarkMode ? '#cbd5e1' : '#0f172a'}
              strokeWidth={activeTool === 'highlighter' ? 16 : 2}
              opacity={activeTool === 'highlighter' ? 0.4 : 1}
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Selection Box overlay */}
        {selectionBox && (
          <div
            style={{
              position: 'absolute',
              left: Math.min(selectionBox.x1, selectionBox.x2),
              top: Math.min(selectionBox.y1, selectionBox.y2),
              width: Math.abs(selectionBox.x2 - selectionBox.x1),
              height: Math.abs(selectionBox.y2 - selectionBox.y1),
            }}
            className="bg-indigo-500/10 border border-indigo-500 pointer-events-none rounded"
          />
        )}
      </div>
    </div>
  );
};
