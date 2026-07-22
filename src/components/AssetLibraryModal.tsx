import React, { useState } from 'react';
import { X, Search, Shapes, Plus, Sparkles } from 'lucide-react';
import { ASSET_LIBRARY, AssetDefinition } from '../data/presetsAndAssets';
import { CanvasElement } from '../types';

interface AssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (asset: AssetDefinition) => void;
}

export const AssetLibraryModal: React.FC<AssetLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddAsset,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const allItems = ASSET_LIBRARY.flatMap((cat) => cat.items);

  const filtered = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.badgeText && item.badgeText.toLowerCase().includes(search.toLowerCase()));
    
    if (activeCategory === 'all') return matchesSearch;
    const cat = ASSET_LIBRARY.find((c) => c.id === activeCategory);
    return matchesSearch && cat?.items.some((i) => i.id === item.id);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Shapes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Asset & Symbol Library</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reusable cloud symbols, tech icons, stamps, and UI elements.
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

        {/* Search & Categories */}
        <div className="py-3 flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons, symbols, or stamps..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Assets ({allItems.length})
            </button>
            {ASSET_LIBRARY.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pr-1">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => {
                onAddAsset(asset);
                onClose();
              }}
              className="group p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition cursor-pointer flex flex-col items-center justify-between text-center min-h-[110px]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center my-1 transition-transform group-hover:scale-110 shadow-xs"
                style={{ backgroundColor: asset.fillColor || '#f1f5f9' }}
              >
                {asset.type === 'badge' ? (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ color: asset.strokeColor }}
                  >
                    {asset.badgeText}
                  </span>
                ) : (
                  <Sparkles className="w-6 h-6" style={{ color: asset.strokeColor || '#4f46e5' }} />
                )}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                  {asset.name}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  + Add to Canvas
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
