import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PromoBanner, StudioPromo } from './StudioPromo';
import { LegalPage, LegalDoc } from './LegalPage';
import { WorkspaceMode } from '../types';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  PenTool,
  Eraser,
  MousePointer2,
  Hand,
  Square,
  Circle,
  Type,
  StickyNote,
  Command,
  Presentation,
  GitBranch,
  LayoutDashboard,
  Frame,
  Palette,
  Layers,
  Map,
  Download,
  ShieldCheck,
  Zap,
  HardDrive,
  Wrench,
  Gamepad2,
  Calculator,
  BookOpen,
  FileText,
  Vote,
  Terminal,
  Clapperboard,
  ImageIcon,
} from 'lucide-react';

const BRAND_URL = 'https://nihmathullah.com';

interface LandingProps {
  onLaunch: (mode?: WorkspaceMode) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ *
 * The hero IS a canvas — visitors can doodle directly on the page.
 * ------------------------------------------------------------------ */
const DoodleCanvas: React.FC<{ api: React.MutableRefObject<{ clear: () => void } | null> }> = ({ api }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const parent = cvs.parentElement as HTMLElement;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = parent.getBoundingClientRect();
      cvs.width = Math.round(r.width * dpr);
      cvs.height = Math.round(r.height * dpr);
      cvs.style.width = `${r.width}px`;
      cvs.style.height = `${r.height}px`;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#a78bfa';
      ctx.shadowColor = 'rgba(139,92,246,0.55)';
      ctx.shadowBlur = 10;
    };
    setup();

    api.current = {
      clear: () => {
        const ctx = cvs.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, cvs.width, cvs.height);
      },
    };

    let drawing = false;
    let last: { x: number; y: number } | null = null;

    const pos = (e: PointerEvent) => {
      const r = cvs.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drawing = true;
      last = pos(e);
      cvs.setPointerCapture(e.pointerId);
      const ctx = cvs.getContext('2d');
      if (ctx && last) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x + 0.01, last.y + 0.01);
        ctx.stroke();
      }
    };
    const move = (e: PointerEvent) => {
      if (!drawing || !last) return;
      const p = pos(e);
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      last = p;
    };
    const up = () => {
      drawing = false;
      last = null;
    };

    cvs.addEventListener('pointerdown', down);
    cvs.addEventListener('pointermove', move);
    cvs.addEventListener('pointerup', up);
    cvs.addEventListener('pointercancel', up);
    window.addEventListener('resize', setup);
    return () => {
      cvs.removeEventListener('pointerdown', down);
      cvs.removeEventListener('pointermove', move);
      cvs.removeEventListener('pointerup', up);
      cvs.removeEventListener('pointercancel', up);
      window.removeEventListener('resize', setup);
    };
  }, [api]);

  return <canvas ref={ref} className="absolute inset-0 z-[5] cursor-crosshair touch-none" aria-label="Doodle canvas — draw anywhere" />;
};

/* Draggable sticky note used in the hero */
const HeroSticky: React.FC<{
  className: string;
  rotate: number;
  color: string;
  constraints: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}> = ({ className, rotate, color, constraints, children }) => (
  <motion.div
    drag
    dragConstraints={constraints as React.RefObject<HTMLElement>}
    dragMomentum={false}
    whileDrag={{ scale: 1.06, zIndex: 40 }}
    initial={{ opacity: 0, y: 16, rotate }}
    animate={{ opacity: 1, y: 0, rotate }}
    transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
    className={`pointer-events-auto absolute z-20 hidden w-40 cursor-grab select-none rounded-lg border p-3 text-left text-xs leading-relaxed shadow-xl backdrop-blur-sm active:cursor-grabbing lg:block ${color} ${className}`}
  >
    <span className="pointer-events-none absolute -top-2 left-1/2 h-3.5 w-10 -translate-x-1/2 rounded-sm bg-white/15" aria-hidden />
    {children}
  </motion.div>
);

const TOOL_STRIP = [MousePointer2, Hand, PenTool, Eraser, Square, Circle, ArrowUpRight, Type, StickyNote, ImageIcon, Layers, Map];

type EcoStatus = 'current' | 'live' | 'soon';
const ECOSYSTEM: { icon: typeof PenTool; name: string; desc: string; url?: string; status: EcoStatus }[] = [
  { icon: PenTool, name: 'NWS Draw', desc: 'Whiteboards, diagrams & presentations on an infinite canvas.', status: 'current' },
  { icon: Terminal, name: 'NWS Code', desc: 'Write, run & learn code straight from the browser.', url: 'https://nwscode.vercel.app', status: 'live' },
  { icon: Wrench, name: 'NWS Tools', desc: '100+ privacy-first utilities, right in your browser.', url: 'https://nwstools.vercel.app', status: 'live' },
  { icon: FileText, name: 'NWS CV', desc: 'AI resume, cover-letter & career tools — private by design.', url: 'https://nwscv.vercel.app', status: 'live' },
  { icon: Gamepad2, name: 'NWS Games', desc: 'Create & host live multiplayer games in seconds.', url: 'https://nwsgames.vercel.app', status: 'live' },
  { icon: Vote, name: 'Live Ballot', desc: 'Run clean, transparent elections end to end.', url: 'https://live-ballot.vercel.app', status: 'live' },
  { icon: Calculator, name: 'NWS Calc', desc: '154 fast, accurate calculators for every job.', status: 'soon' },
  { icon: BookOpen, name: 'NWS Study', desc: 'Flashcards, notes & focus tools for students.', status: 'soon' },
  { icon: Clapperboard, name: 'NWS Media', desc: 'Image, video & audio tools in one workspace.', status: 'soon' },
];

const STICKY_PILLARS = [
  { icon: Zap, title: 'Instant', body: 'No installs, no setup, no waiting. Open a tab and the canvas is ready.', tint: 'border-violet-400/30 bg-violet-500/10 text-violet-100', rotate: '-rotate-2' },
  { icon: ShieldCheck, title: 'No sign-in', body: 'Zero accounts. Your drawings live in your browser and export anytime.', tint: 'border-amber-400/30 bg-amber-500/10 text-amber-100', rotate: 'rotate-1' },
  { icon: HardDrive, title: 'Local-first', body: 'Everything auto-saves to IndexedDB on your device. Nothing is uploaded.', tint: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100', rotate: '-rotate-1' },
  { icon: Download, title: 'Export anything', body: 'PNG, JPG, vector SVG, PDF — or a re-editable .nwsdraw project file.', tint: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100', rotate: 'rotate-2' },
];

/* ------------------------------------------------------------------ *
 * Mini artboard mocks — each workspace drawn as a tiny live-looking
 * frame instead of an icon card.
 * ------------------------------------------------------------------ */
const MockWhiteboard: React.FC = () => (
  <div className="relative h-full w-full">
    <svg viewBox="0 0 200 90" className="absolute inset-0 h-full w-full" aria-hidden>
      <path d="M15 65 C 40 15, 70 15, 90 50 S 140 80, 185 30" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <circle cx="15" cy="65" r="3.5" fill="#e879f9" />
    </svg>
    <div className="absolute right-3 top-3 rotate-3 rounded-sm border border-amber-400/30 bg-amber-500/15 px-2 py-1.5 text-[9px] text-amber-200">idea!</div>
  </div>
);

const MockDiagram: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center gap-2 px-3">
    <div className="rounded-md border border-violet-400/40 bg-violet-500/10 px-2.5 py-2 text-[9px] text-violet-200">Start</div>
    <div className="flex items-center" aria-hidden>
      <div className="h-px w-5 bg-violet-400/60" />
      <ArrowRight className="-ml-1 h-2.5 w-2.5 text-violet-300" />
    </div>
    <div className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-2 text-[9px] text-emerald-200">Decide</div>
    <div className="flex flex-col gap-1.5" aria-hidden>
      <div className="flex items-center">
        <div className="h-px w-4 bg-emerald-400/60" />
        <ArrowRight className="-ml-1 h-2.5 w-2.5 text-emerald-300" />
      </div>
      <div className="flex items-center">
        <div className="h-px w-4 bg-emerald-400/60" />
        <ArrowRight className="-ml-1 h-2.5 w-2.5 text-emerald-300" />
      </div>
    </div>
    <div className="flex flex-col gap-1.5">
      <div className="rounded-md border border-white/15 bg-white/[0.04] px-2 py-1 text-[9px] text-zinc-300">Ship</div>
      <div className="rounded-md border border-white/15 bg-white/[0.04] px-2 py-1 text-[9px] text-zinc-300">Iterate</div>
    </div>
  </div>
);

const MockWireframe: React.FC = () => (
  <div className="flex h-full w-full flex-col gap-1.5 p-3">
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-8 rounded-sm bg-white/15" />
      <div className="ml-auto flex gap-1">
        <div className="h-2 w-5 rounded-sm bg-white/10" />
        <div className="h-2 w-5 rounded-sm bg-white/10" />
      </div>
    </div>
    <div className="relative flex-1 rounded-sm border border-white/15">
      <svg className="absolute inset-0 h-full w-full text-white/15" aria-hidden>
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" />
      </svg>
    </div>
    <div className="h-2 w-3/4 rounded-sm bg-white/12" />
    <div className="h-2 w-1/2 rounded-sm bg-white/8" />
  </div>
);

const MockDesign: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-fuchsia-400/50 bg-fuchsia-500/[0.07]">
      <span className="font-mono text-[8px] tracking-wider text-fuchsia-300">1080 × 1080</span>
    </div>
  </div>
);

const MockPresentation: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center gap-2 px-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`flex h-12 w-16 flex-col justify-end gap-1 rounded-sm border p-1.5 ${
          i === 0 ? 'border-amber-400/50 bg-amber-500/10' : 'border-white/12 bg-white/[0.03]'
        }`}
      >
        <div className={`h-1.5 w-3/4 rounded-full ${i === 0 ? 'bg-amber-300/60' : 'bg-white/15'}`} />
        <div className={`h-1 w-1/2 rounded-full ${i === 0 ? 'bg-amber-300/40' : 'bg-white/10'}`} />
      </div>
    ))}
    <Play className="h-3.5 w-3.5 fill-current stroke-none text-amber-300" />
  </div>
);

const ARTBOARDS: { icon: typeof PenTool; name: string; desc: string; accent: string; mode: WorkspaceMode; Mock: React.FC }[] = [
  { icon: LayoutDashboard, name: 'Whiteboard', desc: 'Free-form infinite canvas for sketching, brainstorming & sticky notes.', accent: 'text-violet-300', mode: 'whiteboard', Mock: MockWhiteboard },
  { icon: GitBranch, name: 'Diagrams', desc: 'Flowcharts, mind maps & org charts with shapes, arrows & connectors.', accent: 'text-emerald-300', mode: 'diagram', Mock: MockDiagram },
  { icon: Frame, name: 'Wireframes', desc: 'Low-fi UI mockups with a ready-made library of interface assets.', accent: 'text-cyan-300', mode: 'wireframe', Mock: MockWireframe },
  { icon: Palette, name: 'Design', desc: 'Fixed-size artboards with social & print presets and custom canvases.', accent: 'text-fuchsia-300', mode: 'design', Mock: MockDesign },
  { icon: Presentation, name: 'Presentations', desc: 'Build slide decks on the canvas and present them full-screen.', accent: 'text-amber-300', mode: 'presentation', Mock: MockPresentation },
];

export const Landing: React.FC<LandingProps> = ({ onLaunch }) => {
  const [legal, setLegal] = useState<LegalDoc | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const doodleApi = useRef<{ clear: () => void } | null>(null);

  if (legal) {
    return <LegalPage doc={legal} onBack={() => setLegal(null)} onSwitch={setLegal} />;
  }

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-[#0a0712] text-zinc-100 font-sans">
      {/* Studio strip — same routing the rest of the NWS family uses */}
      <PromoBanner />

      {/* Top nav */}
      <nav className="sticky top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-8 h-16 backdrop-blur-md bg-[#0a0712]/60 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <img src="/nws-draw-logo.png" alt="NWS Draw" className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(124,92,240,0.5)]" />
          <div className="leading-none">
            <span className="font-bold tracking-tight text-sm">NWS Draw</span>
            <p className="eyebrow mt-0.5">Draw · Diagram · Present</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#ecosystem" className="hidden sm:inline text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
            Ecosystem
          </a>
          <a
            href={BRAND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Studio <ArrowUpRight className="w-3 h-3" />
          </a>
          <button
            onClick={() => onLaunch()}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#0a0712] text-xs font-bold transition-all hover:scale-[1.03] active:scale-95 shadow-lg"
          >
            Open the canvas
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </nav>

      {/* Hero — the page itself is a drawable canvas */}
      <section ref={heroRef} className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden px-5 sm:px-8 pt-10 pb-20">
        {/* Canvas-dot field, like the workspace itself */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute inset-0 opacity-70"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.13) 1.1px, transparent 1.1px)', backgroundSize: '26px 26px' }}
          />
          <div className="animate-drift absolute -top-[25%] left-[0%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.26),transparent_62%)] blur-3xl" />
          <div className="animate-drift-slow absolute -right-[18%] bottom-[-15%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(216,70,239,0.18),transparent_62%)] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,transparent_30%,#0a0712_85%)]" />
        </div>

        {/* Live doodle layer */}
        <DoodleCanvas api={doodleApi} />

        {/* Draggable stickies — real canvas objects, on the landing page */}
        <HeroSticky className="left-[8%] top-[16%]" rotate={-4} color="border-amber-400/30 bg-amber-500/10 text-amber-100" constraints={heroRef}>
          <span className="font-semibold">Drag me around.</span>
          <br />
          Sticky notes work here too.
        </HeroSticky>
        <HeroSticky className="right-[9%] top-[22%]" rotate={3} color="border-violet-400/30 bg-violet-500/10 text-violet-100" constraints={heroRef}>
          <span className="font-semibold">Five workspaces.</span>
          <br />
          Whiteboard to slide deck.
        </HeroSticky>
        <HeroSticky className="bottom-[18%] right-[14%]" rotate={-2} color="border-emerald-400/30 bg-emerald-500/10 text-emerald-100" constraints={heroRef}>
          <span className="font-semibold">Nothing uploads.</span>
          <br />
          It all stays in your browser.
        </HeroSticky>

        {/* Content sits above the dots but lets strokes pass through the gaps */}
        <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="glass inline-flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              NWS
            </span>
            <PenTool size={12} className="text-fuchsia-400" />
            <span>This page is a canvas</span>
          </motion.span>

          <h1 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,5.5vw,3.9rem)] font-bold leading-[1.05] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
              className="block"
            >
              Don&apos;t describe it.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.26 }}
              className="text-aurora block pb-1"
            >
              Draw it.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
            className="mt-4 max-w-xl text-balance text-sm text-zinc-400 md:text-base"
          >
            Grab your mouse and scribble on this very page — that&apos;s the pen tool.
            Inside: whiteboards, flowcharts, wireframes and slide decks on one infinite
            canvas. No sign-in, nothing leaves your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.58 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => onLaunch()}
              className="pointer-events-auto group inline-flex items-center gap-2 rounded-xl bg-aurora px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.03] active:scale-95"
            >
              <Play className="w-4 h-4 fill-current stroke-none" />
              Start drawing — it&apos;s free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#workspaces"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-zinc-200 transition-all hover:border-white/25 hover:bg-white/[0.06]"
            >
              Explore the workspaces
            </a>
          </motion.div>

          {/* Slim stat line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400"
          >
            <span><b className="text-zinc-100">5</b> workspaces</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span><b className="text-zinc-100">0</b> sign-ups</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span><b className="text-zinc-100">100%</b> in your browser</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span>an <b className="text-zinc-100">NWS</b> product</span>
          </motion.div>
        </div>

        {/* Doodle hint + clear — pinned to the hero floor */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
          <div className="glass pointer-events-auto flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <PenTool className="h-3 w-3 text-violet-300" />
              Draw anywhere on this screen
            </span>
            <button
              onClick={() => doodleApi.current?.clear()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 font-medium text-zinc-200 transition-colors hover:bg-white/[0.12]"
            >
              <Eraser className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* Toolbar strip — the app's own toolbox, laid flat */}
      <section className="border-y border-white/6 py-6 px-5">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
          <div className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl p-2 scrollbar-none">
            {TOOL_STRIP.map((Icon, i) => (
              <span
                key={i}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
                  i === 2 ? 'bg-violet-500/20 text-violet-200' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300'
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
            <span className="mx-1 h-6 w-px bg-white/10" aria-hidden />
            <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 font-mono text-[11px] text-zinc-500">
              <Command className="h-3.5 w-3.5" />K
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Select, pan, pen, shapes, connectors, text, stickies, layers, minimap — and a command palette one keystroke away.
          </p>
        </div>
      </section>

      {/* Workspaces as artboards */}
      <section id="workspaces" className="px-5 sm:px-8 py-24 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">One canvas · Five workspaces</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tight">
            From rough sketch <span className="text-aurora">to final deck</span>.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm md:text-base">
            Every workspace is an artboard below — click one and you&apos;re drawing in it.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTBOARDS.map((a, i) => {
            const Icon = a.icon;
            const Mock = a.Mock;
            return (
              <motion.button
                key={a.name}
                onClick={() => onLaunch(a.mode)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.06 }}
                className="group glow-hover cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] text-left transition-colors hover:border-violet-500/30"
              >
                {/* Artboard frame */}
                <div className="relative m-3 h-28 overflow-hidden rounded-xl border border-white/10 bg-[#0d0918]">
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    aria-hidden
                  />
                  <div className="absolute left-2 top-1.5 font-mono text-[8px] uppercase tracking-widest text-zinc-600">{a.name}.nwsdraw</div>
                  <div className="absolute inset-0 pt-4">
                    <Mock />
                  </div>
                </div>
                <div className="flex items-start gap-3 px-5 pb-5 pt-1">
                  <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${a.accent}`} />
                  <div>
                    <h3 className="font-semibold text-zinc-100">{a.name}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">{a.desc}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-300/0 transition-colors group-hover:text-violet-300">
                      Open this workspace <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Tooling teaser card to complete the grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-white/12 bg-transparent p-6"
          >
            <div className="flex items-center gap-2">
              {[Layers, Map, Command, StickyNote].map((Icon, i) => (
                <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/[0.04] text-zinc-400">
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-zinc-100">Pro tooling everywhere</h3>
            <p className="text-[13px] leading-relaxed text-zinc-400">
              Layers, a minimap, alignment guides, templates and a full asset library —
              the same kit in every workspace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars — as sticky notes on the wall */}
      <section className="px-5 sm:px-8 py-20 max-w-6xl mx-auto">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STICKY_PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.06 }}
                className={`relative rounded-lg border p-5 shadow-lg ${p.tint} ${p.rotate} transition-transform hover:rotate-0`}
              >
                <span className="absolute -top-2 left-1/2 h-3.5 w-12 -translate-x-1/2 rounded-sm bg-white/15" aria-hidden />
                <Icon className="w-5 h-5 opacity-90" />
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed opacity-75">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* NWS Ecosystem — cross-promote the wider family */}
      <section id="ecosystem" className="px-5 sm:px-8 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 max-w-3xl">
          <div>
            <p className="eyebrow">More from NWS</p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-tight">
              One studio, <span className="text-aurora">a whole toolkit</span>.
            </h2>
            <p className="mt-4 text-zinc-400 text-sm md:text-base">
              NWS Draw is one of a growing family of fast, private, no-signup products from
              NWS Digital Services.
            </p>
          </div>
          <a
            href={BRAND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:text-violet-200 transition-colors"
          >
            Visit the studio <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map((app, i) => {
            const Icon = app.icon;
            const isLive = app.status === 'live';
            const isCurrent = app.status === 'current';

            const card = (
              <>
                <span
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCurrent
                      ? 'bg-violet-500/15 text-violet-200 border-violet-500/30'
                      : app.status === 'soon'
                      ? 'bg-white/[0.03] text-zinc-500 border-white/8'
                      : 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-100 truncate">{app.name}</h3>
                    {isCurrent && (
                      <span className="eyebrow rounded bg-violet-500/15 px-1.5 py-0.5 text-violet-300">You're here</span>
                    )}
                    {app.status === 'soon' && (
                      <span className="eyebrow rounded bg-white/5 px-1.5 py-0.5 text-zinc-500">Soon</span>
                    )}
                    {isLive && <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 ml-auto" />}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">{app.desc}</p>
                </div>
              </>
            );

            const base = 'relative rounded-2xl border p-5 flex items-start gap-4 transition-all';
            const cls = isCurrent
              ? `${base} border-violet-500/40 bg-violet-500/[0.06]`
              : app.status === 'soon'
              ? `${base} border-white/8 bg-white/[0.02] opacity-70`
              : `${base} border-white/8 bg-white/[0.02] glow-hover hover:bg-white/[0.04]`;

            return (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.06 }}
              >
                {isLive && app.url ? (
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className={`${cls} group`}>
                    {card}
                  </a>
                ) : (
                  <div className={cls}>{card}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Studio promo — the hire-us pitch carried across the NWS family */}
      <StudioPromo />

      {/* CTA band */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="animate-drift absolute -top-[40%] left-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(124,92,240,0.35),transparent_62%)] blur-3xl" />
            <div
              className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_70%)]"
              style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tight">
            Your next idea is <span className="text-aurora">one canvas away</span>.
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-zinc-400 text-sm md:text-base">
            No download. No account. Just open the canvas and start drawing.
          </p>
          <button
            onClick={() => onLaunch()}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#0a0712] transition-all hover:scale-[1.03] active:scale-95 shadow-xl"
          >
            <Play className="w-4 h-4 fill-current stroke-none" />
            Launch NWS Draw
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-5 sm:px-8 pt-12 pb-10">
        <div className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/nws-draw-logo.png" alt="NWS Draw" className="w-8 h-8 object-contain" />
              <span className="font-bold tracking-tight">NWS Draw</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-400 max-w-xs">
              A free visual workspace by NWS Digital Services. Draw. Diagram. Present — no sign-in.
            </p>
          </div>

          <div>
            <p className="eyebrow">Live products</p>
            <ul className="mt-3 space-y-2 text-sm">
              {ECOSYSTEM.filter((a) => a.status === 'live').map((a) => (
                <li key={a.name}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1">
                    {a.name} <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Coming soon</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              {ECOSYSTEM.filter((a) => a.status === 'soon').map((a) => (
                <li key={a.name}>{a.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Studio &amp; legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={BRAND_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1">
                  nihmathullah.com <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button onClick={() => setLegal('terms')} className="text-zinc-400 hover:text-violet-300 transition-colors">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => setLegal('privacy')} className="text-zinc-400 hover:text-violet-300 transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} NWS Digital Services. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <button onClick={() => setLegal('terms')} className="hover:text-zinc-300 transition-colors">Terms</button>
            <button onClick={() => setLegal('privacy')} className="hover:text-zinc-300 transition-colors">Privacy</button>
            <span className="eyebrow">Draw · Diagram · Present</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
