import React from 'react';
import { Slide } from '../types';
import { Plus, Play, Copy, Trash2, ChevronLeft, ChevronRight, Presentation } from 'lucide-react';

interface PresentationSlidesBarProps {
  slides: Slide[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (index: number, direction: 'left' | 'right') => void;
  onStartPresentationMode: () => void;
}

export const PresentationSlidesBar: React.FC<PresentationSlidesBarProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  onStartPresentationMode,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 gap-3 text-xs select-none max-w-[90vw] overflow-x-auto">
      {/* Presentation Mode Trigger */}
      <button
        onClick={onStartPresentationMode}
        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition"
        title="Start Fullscreen Slide Deck Presentation"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Present</span>
      </button>

      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

      {/* Slide Thumbnails List */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 pr-1">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;

          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(idx)}
              className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border cursor-pointer transition-all shrink-0 w-28 h-16 ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 ring-2 ring-indigo-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {idx + 1}. {slide.title || 'Slide'}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {slide.elements.length} obj
                </span>
              </div>

              {/* Action overlay on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 rounded px-1 py-0.5 shadow-xs">
                {idx > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(idx, 'left');
                    }}
                    className="p-0.5 text-slate-600 hover:text-indigo-600"
                    title="Move Left"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateSlide(idx);
                  }}
                  className="p-0.5 text-slate-600 hover:text-indigo-600"
                  title="Duplicate Slide"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(idx);
                    }}
                    className="p-0.5 text-rose-500 hover:text-rose-700"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {idx < slides.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(idx, 'right');
                    }}
                    className="p-0.5 text-slate-600 hover:text-indigo-600"
                    title="Move Right"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Slide Button */}
        <button
          onClick={onAddSlide}
          className="w-20 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-600 transition shrink-0"
          title="Add New Blank Slide"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-bold">New Slide</span>
        </button>
      </div>
    </div>
  );
};
