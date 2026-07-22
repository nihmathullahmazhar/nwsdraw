import React, { useState, useEffect, useRef } from 'react';
import { Slide, CanvasElement } from '../types';
import { ChevronLeft, ChevronRight, X, Pointer, Maximize2, Sparkles } from 'lucide-react';

interface PresentationViewModalProps {
  isOpen: boolean;
  slides: Slide[];
  initialSlideIndex?: number;
  onClose: () => void;
}

export const PresentationViewModal: React.FC<PresentationViewModalProps> = ({
  isOpen,
  slides,
  initialSlideIndex = 0,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialSlideIndex);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIdx(initialSlideIndex);
  }, [initialSlideIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentIdx((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'l') {
        setIsLaserActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[currentIdx] || slides[0];

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isLaserActive && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setLaserPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setLaserPos(null)}
      className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center select-none overflow-hidden"
      style={{ backgroundColor: currentSlide.backgroundColor || '#0f172a' }}
    >
      {/* Slide Rendering Area */}
      <div className="relative w-[1920px] h-[1080px] max-w-full max-h-full flex items-center justify-center p-8">
        <div className="relative w-full h-full bg-transparent overflow-hidden">
          {currentSlide.elements.map((el) => renderSlideElement(el))}
        </div>
      </div>

      {/* Laser Pointer */}
      {isLaserActive && laserPos && (
        <div
          className="pointer-events-none fixed z-50 w-6 h-6 rounded-full bg-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,1)] border-2 border-white -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ left: laserPos.x, top: laserPos.y }}
        />
      )}

      {/* Presenter Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/90 border border-slate-800 text-white px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-semibold">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(prev - 1, 0))}
          disabled={currentIdx === 0}
          className="p-1.5 hover:bg-slate-800 rounded-lg disabled:opacity-30 transition"
          title="Previous Slide (←)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-mono text-slate-300">
          Slide {currentIdx + 1} / {slides.length}
        </span>

        <button
          onClick={() => setCurrentIdx((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={currentIdx === slides.length - 1}
          className="p-1.5 hover:bg-slate-800 rounded-lg disabled:opacity-30 transition"
          title="Next Slide (→)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Laser pointer button */}
        <button
          onClick={() => setIsLaserActive(!isLaserActive)}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${
            isLaserActive ? 'bg-rose-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Toggle Laser Pointer (L)"
        >
          <Pointer className="w-4 h-4" />
          <span className="hidden sm:inline">Laser</span>
        </button>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg transition ml-1"
          title="Exit Presentation (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Helper renderer for slides elements
function renderSlideElement(el: CanvasElement) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${el.x}px`,
    top: `${el.y}px`,
    width: `${el.width}px`,
    height: `${el.height}px`,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
  };

  if (el.type === 'text') {
    return (
      <div
        key={el.id}
        style={{
          ...style,
          color: el.textColor || '#ffffff',
          fontSize: `${el.fontSize || 24}px`,
          fontWeight: el.fontWeight || 'normal',
          textAlign: el.textAlign || 'left',
          fontFamily: el.fontFamily === 'serif' ? 'serif' : 'sans-serif',
          whiteSpace: 'pre-wrap',
        }}
        className="flex items-center justify-center p-2"
      >
        {el.text}
      </div>
    );
  }

  if (el.type === 'sticky-note') {
    return (
      <div
        key={el.id}
        style={{
          ...style,
          backgroundColor: el.fillColor || '#fef08a',
          color: el.textColor || '#854d0e',
        }}
        className="rounded-xl shadow-lg p-4 flex flex-col justify-center text-center font-medium"
      >
        <p className="text-sm leading-relaxed">{el.text}</p>
      </div>
    );
  }

  return (
    <div
      key={el.id}
      style={{
        ...style,
        backgroundColor: el.fillColor || 'transparent',
        borderColor: el.strokeColor || '#3b82f6',
        borderWidth: `${el.strokeWidth || 2}px`,
        color: el.textColor || '#ffffff',
      }}
      className="rounded-2xl shadow-md p-4 flex items-center justify-center text-center font-semibold text-lg"
    >
      {el.text}
    </div>
  );
}
