import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PromoBanner, StudioPromo } from './StudioPromo';
import { LegalPage, LegalDoc } from './LegalPage';
import { WorkspaceMode } from '../types';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Play,
  PenTool,
  Presentation,
  GitBranch,
  LayoutDashboard,
  Frame,
  Palette,
  Layers,
  Map,
  Command,
  Download,
  ShieldCheck,
  Zap,
  HardDrive,
  LayoutTemplate,
  Shapes,
  Wrench,
  Gamepad2,
  Calculator,
  BookOpen,
  FileText,
  Vote,
  Terminal,
  Clapperboard,
} from 'lucide-react';

const BRAND_URL = 'https://nihmathullah.com';

interface LandingProps {
  onLaunch: (mode?: WorkspaceMode) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const WORKSPACES: { icon: typeof PenTool; name: string; desc: string; accent: string; mode: WorkspaceMode }[] = [
  { icon: LayoutDashboard, name: 'Whiteboard', desc: 'Free-form infinite canvas for sketching, brainstorming & sticky notes.', accent: 'text-violet-300 bg-violet-500/15', mode: 'whiteboard' },
  { icon: GitBranch, name: 'Diagrams', desc: 'Flowcharts, mind maps & org charts with shapes, arrows & connectors.', accent: 'text-emerald-300 bg-emerald-500/15', mode: 'diagram' },
  { icon: Frame, name: 'Wireframes', desc: 'Low-fi UI mockups with a ready-made library of interface assets.', accent: 'text-cyan-300 bg-cyan-500/15', mode: 'wireframe' },
  { icon: Palette, name: 'Design', desc: 'Fixed-size artboards with social & print presets and custom canvases.', accent: 'text-fuchsia-300 bg-fuchsia-500/15', mode: 'design' },
  { icon: Presentation, name: 'Presentations', desc: 'Build slide decks on the canvas and present them full-screen.', accent: 'text-amber-300 bg-amber-500/15', mode: 'presentation' },
];

const FEATURES = ['Infinite canvas', 'Shapes & connectors', 'Freehand pen', 'Sticky notes', 'Mind maps', 'Flowcharts', 'Slide decks', 'Templates', 'Asset library', 'Layers', 'Minimap', 'Dark mode', 'PNG · SVG · PDF export', 'Auto-save'];

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

const PILLARS = [
  { icon: Zap, title: 'Instant', body: 'No installs, no setup, no waiting. Open a tab and the canvas is ready.' },
  { icon: ShieldCheck, title: 'No sign-in', body: 'Zero accounts. Your drawings live in your browser and export anytime.' },
  { icon: HardDrive, title: 'Local-first', body: 'Everything auto-saves to IndexedDB on your device. Nothing is uploaded.' },
  { icon: Download, title: 'Export anything', body: 'PNG, JPG, vector SVG, PDF — or a re-editable .nwsdraw project file.' },
];

export const Landing: React.FC<LandingProps> = ({ onLaunch }) => {
  const [legal, setLegal] = useState<LegalDoc | null>(null);
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

      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden px-5 sm:px-8 pt-10 pb-16">
        {/* Aurora field */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="animate-drift absolute -top-[25%] left-[2%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.3),transparent_62%)] blur-3xl" />
          <div className="animate-drift-slow absolute -right-[15%] top-[2%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.28),transparent_62%)] blur-3xl" />
          <div className="animate-drift absolute bottom-[-20%] left-[30%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.14),transparent_62%)] blur-3xl [animation-delay:-9s]" />
          <div className="bp-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_40%,black_25%,transparent_75%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,transparent_35%,#0a0712_80%)]" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
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
            <Sparkles size={12} className="text-fuchsia-400" />
            <span>Infinite visual canvas</span>
          </motion.span>

          <h1 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,5.5vw,3.9rem)] font-bold leading-[1.05] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
              className="block"
            >
              Every idea deserves
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.26 }}
              className="text-aurora block pb-1"
            >
              an infinite canvas.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
            className="mt-4 max-w-xl text-balance text-sm text-zinc-400 md:text-base"
          >
            Whiteboards, flowcharts, mind maps, wireframes and slide decks — one canvas,
            five workspaces, no sign-in. Everything stays in your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.58 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => onLaunch()}
              className="group inline-flex items-center gap-2 rounded-xl bg-aurora px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.03] active:scale-95"
            >
              <Play className="w-4 h-4 fill-current stroke-none" />
              Start drawing — it&apos;s free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#workspaces"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-zinc-200 transition-all hover:border-white/25 hover:bg-white/[0.06]"
            >
              Explore the workspaces
            </a>
          </motion.div>

          {/* Canvas mock — the product, sketched in its own register */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.72 }}
            className="mt-10 w-full max-w-3xl"
          >
            <div className="glass relative overflow-hidden rounded-2xl p-4 sm:p-6">
              <div className="bp-grid absolute inset-0 opacity-60" aria-hidden />
              <div className="relative flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-2">untitled.nwsdraw — auto-saved</span>
              </div>
              <div className="relative mt-4 grid grid-cols-3 items-center gap-3 sm:gap-5 pb-2">
                <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-3 py-4 text-xs font-medium text-violet-200">Idea</div>
                <div className="flex items-center" aria-hidden>
                  <div className="h-px flex-1 bg-gradient-to-r from-violet-400/60 to-fuchsia-400/60" />
                  <ArrowRight className="w-3.5 h-3.5 -ml-1 text-fuchsia-300" />
                </div>
                <div className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/10 px-3 py-4 text-xs font-medium text-fuchsia-200">Diagram</div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-xs text-zinc-400 rotate-[-2deg]">Sticky note</div>
                <div className="flex items-center justify-center" aria-hidden>
                  <Shapes className="w-6 h-6 text-zinc-600" />
                </div>
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-4 text-xs font-medium text-emerald-200">Ship it</div>
              </div>
            </div>
          </motion.div>

          {/* Slim stat line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400"
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
      </section>

      {/* Features marquee */}
      <section className="border-y border-white/6 py-5 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-3">
          {[...FEATURES, ...FEATURES].map((f, i) => (
            <span
              key={i}
              className="shrink-0 rounded-full border border-white/8 bg-white/[0.03] px-4 py-1.5 font-mono text-xs text-zinc-400"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Workspaces grid */}
      <section id="workspaces" className="px-5 sm:px-8 py-24 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">One canvas · Five workspaces</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tight">
            From rough sketch <span className="text-aurora">to final deck</span>.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm md:text-base">
            Pick a workspace and you&apos;re in it — same canvas, tuned for the job.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSPACES.map((w, i) => {
            const Icon = w.icon;
            return (
              <motion.button
                key={w.name}
                onClick={() => onLaunch(w.mode)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.06 }}
                className="group glass glow-hover rounded-2xl p-5 flex flex-col gap-3 text-left cursor-pointer border border-transparent hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${w.accent}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-violet-300" />
                </div>
                <h3 className="font-semibold text-zinc-100">{w.name}</h3>
                <p className="text-[13px] leading-relaxed text-zinc-400">{w.desc}</p>
                <span className="mt-auto pt-1 text-[11px] font-semibold text-violet-300/0 transition-colors group-hover:text-violet-300">
                  Open this workspace
                </span>
              </motion.button>
            );
          })}

          {/* Tooling teaser card to complete the grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              {[Layers, Map, Command, LayoutTemplate].map((Icon, i) => (
                <span key={i} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center text-zinc-400">
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-zinc-100">Pro tooling everywhere</h3>
            <p className="text-[13px] leading-relaxed text-zinc-400">
              Layers, a minimap, a command palette, alignment guides, templates and a
              full asset library — in every workspace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-5 sm:px-8 py-20 max-w-6xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.06 }}
                className="rounded-2xl border border-white/8 p-5"
              >
                <Icon className="w-5 h-5 text-violet-300" />
                <h3 className="mt-3 font-semibold text-zinc-100">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">{p.body}</p>
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
            <div className="bp-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_70%)]" />
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
