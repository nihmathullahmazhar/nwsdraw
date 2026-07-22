import { CanvasPreset } from '../types';

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    category: 'Social',
    aspectRatio: '1:1',
    description: 'Square post for feed (1080 x 1080 px)',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story / Reel',
    width: 1080,
    height: 1920,
    category: 'Social',
    aspectRatio: '9:16',
    description: 'Vertical story format (1080 x 1920 px)',
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    category: 'Social',
    aspectRatio: '16:9',
    description: 'HD video thumbnail (1280 x 720 px)',
  },
  {
    id: 'twitter-header',
    name: 'Twitter / X Header',
    width: 1500,
    height: 500,
    category: 'Social',
    aspectRatio: '3:1',
    description: 'Profile banner (1500 x 500 px)',
  },
  {
    id: 'presentation-16-9',
    name: 'Presentation Slide (16:9)',
    width: 1920,
    height: 1080,
    category: 'Presentation',
    aspectRatio: '16:9',
    description: 'Full HD slide deck frame (1920 x 1080 px)',
  },
  {
    id: 'a4-poster',
    name: 'A4 Document / Poster',
    width: 1240,
    height: 1754,
    category: 'Document',
    aspectRatio: '1:1.41',
    description: 'Standard print A4 layout (1240 x 1754 px)',
  },
  {
    id: 'event-flyer',
    name: 'Event Flyer',
    width: 1200,
    height: 1600,
    category: 'Marketing',
    aspectRatio: '3:4',
    description: 'Vertical marketing poster (1200 x 1600 px)',
  },
  {
    id: 'certificate',
    name: 'Certificate of Achievement',
    width: 1920,
    height: 1350,
    category: 'Document',
    aspectRatio: '4:3',
    description: 'Landscape award layout (1920 x 1350 px)',
  },
];

export interface AssetCategory {
  id: string;
  name: string;
  items: AssetDefinition[];
}

export interface AssetDefinition {
  id: string;
  name: string;
  type: 'icon' | 'symbol' | 'badge' | 'wireframe';
  iconName: string;
  badgeText?: string;
  fillColor?: string;
  strokeColor?: string;
  width?: number;
  height?: number;
  description?: string;
}

export const ASSET_LIBRARY: AssetCategory[] = [
  {
    id: 'tech-architecture',
    name: 'Tech & Architecture',
    items: [
      { id: 'cloud', name: 'Cloud Service', type: 'icon', iconName: 'Cloud', fillColor: '#e0e7ff', strokeColor: '#4f46e5' },
      { id: 'server', name: 'App Server', type: 'icon', iconName: 'Server', fillColor: '#e0f2fe', strokeColor: '#0284c7' },
      { id: 'database', name: 'Database DB', type: 'icon', iconName: 'Database', fillColor: '#f3e8ff', strokeColor: '#9333ea' },
      { id: 'cpu', name: 'Microprocessor / API', type: 'icon', iconName: 'Cpu', fillColor: '#fef3c7', strokeColor: '#d97706' },
      { id: 'globe', name: 'Web Gateway', type: 'icon', iconName: 'Globe', fillColor: '#ccfbf1', strokeColor: '#0d9488' },
      { id: 'shield', name: 'Firewall / Security', type: 'icon', iconName: 'Shield', fillColor: '#ffe4e6', strokeColor: '#e11d48' },
      { id: 'terminal', name: 'CLI Terminal', type: 'icon', iconName: 'Terminal', fillColor: '#f1f5f9', strokeColor: '#334155' },
      { id: 'code', name: 'Code Module', type: 'icon', iconName: 'Code', fillColor: '#ecfdf5', strokeColor: '#059669' },
    ],
  },
  {
    id: 'business-strategy',
    name: 'Business & Metrics',
    items: [
      { id: 'briefcase', name: 'Business Project', type: 'icon', iconName: 'Briefcase', fillColor: '#f1f5f9', strokeColor: '#475569' },
      { id: 'target', name: 'Target Goal', type: 'icon', iconName: 'Target', fillColor: '#ffe4e6', strokeColor: '#e11d48' },
      { id: 'trending', name: 'Growth Chart', type: 'icon', iconName: 'TrendingUp', fillColor: '#dcfce7', strokeColor: '#16a34a' },
      { id: 'award', name: 'Milestone Award', type: 'icon', iconName: 'Award', fillColor: '#fef3c7', strokeColor: '#d97706' },
      { id: 'users', name: 'Team / Users', type: 'icon', iconName: 'Users', fillColor: '#e0e7ff', strokeColor: '#4f46e5' },
      { id: 'dollar', name: 'Revenue / Money', type: 'icon', iconName: 'DollarSign', fillColor: '#dcfce7', strokeColor: '#15803d' },
      { id: 'calendar', name: 'Timeline Schedule', type: 'icon', iconName: 'Calendar', fillColor: '#fef2f2', strokeColor: '#dc2626' },
      { id: 'zap', name: 'Action / Velocity', type: 'icon', iconName: 'Zap', fillColor: '#fef9c3', strokeColor: '#ca8a04' },
    ],
  },
  {
    id: 'badges-stamps',
    name: 'Badges & Stamps',
    items: [
      { id: 'approved', name: 'APPROVED Badge', type: 'badge', iconName: 'CheckCircle', badgeText: 'APPROVED', fillColor: '#dcfce7', strokeColor: '#16a34a' },
      { id: 'draft', name: 'DRAFT Stamp', type: 'badge', iconName: 'FileText', badgeText: 'DRAFT', fillColor: '#f1f5f9', strokeColor: '#64748b' },
      { id: 'top-secret', name: 'CONFIDENTIAL', type: 'badge', iconName: 'Lock', badgeText: 'CONFIDENTIAL', fillColor: '#ffe4e6', strokeColor: '#e11d48' },
      { id: 'pro', name: 'PRO FEATURE', type: 'badge', iconName: 'Star', badgeText: 'PRO', fillColor: '#fef3c7', strokeColor: '#d97706' },
      { id: 'verified', name: 'VERIFIED', type: 'badge', iconName: 'Check', badgeText: 'VERIFIED', fillColor: '#e0e7ff', strokeColor: '#4f46e5' },
    ],
  },
];
