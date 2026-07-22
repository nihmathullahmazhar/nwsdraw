export type WorkspaceMode = 'whiteboard' | 'diagram' | 'wireframe' | 'design' | 'presentation';

export type ElementType =
  | 'pencil'
  | 'pen'
  | 'highlighter'
  | 'line'
  | 'arrow'
  | 'double-arrow'
  | 'connector'
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'diamond'
  | 'star'
  | 'hexagon'
  | 'flowchart-start'
  | 'flowchart-process'
  | 'flowchart-decision'
  | 'flowchart-input'
  | 'flowchart-db'
  | 'flowchart-doc'
  | 'uml-class'
  | 'erd-entity'
  | 'erd-relation'
  | 'arch-cloud'
  | 'arch-server'
  | 'arch-database'
  | 'arch-client'
  | 'text'
  | 'sticky-note'
  | 'mindmap-node'
  | 'wireframe-browser'
  | 'wireframe-mobile'
  | 'wireframe-button'
  | 'wireframe-input'
  | 'wireframe-card'
  | 'wireframe-navbar'
  | 'wireframe-sidebar'
  | 'wireframe-image'
  | 'wireframe-form'
  | 'wireframe-toggle'
  | 'wireframe-badge'
  | 'wireframe-dropdown'
  | 'asset-icon'
  | 'asset-badge'
  | 'asset-sticker'
  | 'image';

export type ToolType =
  | 'select'
  | 'pan'
  | 'eraser'
  | 'pencil'
  | 'pen'
  | 'highlighter'
  | 'line'
  | 'arrow'
  | 'connector'
  | 'shape'
  | 'text'
  | 'sticky-note'
  | 'mindmap'
  | 'flowchart'
  | 'diagram'
  | 'wireframe'
  | 'laser';

export type GridType = 'dots' | 'lines' | 'blank' | 'isometric';

export interface Point {
  x: number;
  y: number;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // angle in degrees
  points?: Point[]; // for pencil/pen/highlighter/line/arrow/connector
  
  // Styling
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
  
  // Text content
  text?: string;
  fontSize?: number;
  fontFamily?: 'sans' | 'serif' | 'mono' | 'handdrawn' | 'display';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  
  // Icon / Asset specific
  iconName?: string;
  badgeLabel?: string;

  // Image specific (data URL — kept local, saved with the project in IndexedDB)
  src?: string;

  // Mindmap specific
  parentId?: string;
  childrenIds?: string[];
  isRootMindmap?: boolean;

  // Connector specific
  startElementId?: string;
  endElementId?: string;
  startAnchor?: 'top' | 'bottom' | 'left' | 'right';
  endAnchor?: 'top' | 'bottom' | 'left' | 'right';

  // Grouping & State
  groupId?: string;
  locked?: boolean;
  hidden?: boolean;
  name?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Slide {
  id: string;
  title: string;
  elements: CanvasElement[];
  backgroundColor?: string;
}

export interface CanvasPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'Social' | 'Marketing' | 'Presentation' | 'Document' | 'Custom';
  aspectRatio: string;
  description: string;
}

export interface DrawingProject {
  id: string;
  name: string;
  mode: WorkspaceMode;
  elements: CanvasElement[];
  viewport: Viewport;
  gridType: GridType;
  backgroundColor: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string; // base64 data url preview
  
  // Design mode canvas dimensions
  designPreset?: string;
  canvasWidth?: number;
  canvasHeight?: number;

  // Presentation mode slides
  slides?: Slide[];
  activeSlideIndex?: number;
}

export interface Template {
  id: string;
  name: string;
  mode?: WorkspaceMode;
  category: string;
  description: string;
  iconName: string;
  elements: (Omit<CanvasElement, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: number; updatedAt?: number })[];
  slides?: Slide[];
  designPreset?: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';

