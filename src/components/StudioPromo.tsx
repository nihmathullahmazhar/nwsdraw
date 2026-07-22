import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, ArrowRight, ArrowUpRight, Check } from 'lucide-react';

const BRAND_URL = 'https://nihmathullah.com';
const EASE = [0.16, 1, 0.3, 1] as const;

const POINTS = [
  'Marketing sites & landing pages',
  'Web apps & dashboards',
  'Custom CRMs & internal tools',
  'AI-powered products',
];

/**
 * Dismissible studio strip above the nav — the same pattern NWS Tools, NWS Code
 * and Live Ballot use to route free-product traffic to nihmathullah.com.
 */
export const PromoBanner: React.FC = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem('nws-draw-banner-dismissed') === '1');
  }, []);

  if (hidden) return null;

  return (
    <div className="relative z-50 bg-aurora text-white">
      <a
        href={BRAND_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center text-[13px] font-medium hover:brightness-110 transition-all"
      >
        <span className="hidden sm:inline opacity-90">Loving NWS Draw?</span>
        <span>nihmathullah.com builds premium sites, apps &amp; CRMs — let&apos;s build yours</span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
      </a>
      <button
        onClick={() => {
          localStorage.setItem('nws-draw-banner-dismissed', '1');
          setHidden(true);
        }}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-white/80 hover:bg-black/15 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

/**
 * Full-width "Built by nihmathullah.com" section — the studio pitch carried
 * across the NWS family, in the Draw register.
 */
export const StudioPromo: React.FC = () => (
  <section className="px-5 sm:px-8 pb-24">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12"
    >
      {/* Accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(640px 280px at 85% 0%, rgba(124,92,240,0.18), transparent 70%)',
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            Built by nihmathullah.com
          </span>
          <h2 className="mt-4 text-balance text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-tight tracking-tight">
            NWS Draw is free.{' '}
            <span className="text-aurora">Your next product doesn&apos;t have to be a compromise.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm md:text-base leading-relaxed text-zinc-400">
            nihmathullah.com designs and builds premium software — the same craft behind this
            canvas, applied to your website, app or CRM. Fast, private, and beautifully engineered.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={BRAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-aurora px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              Work with us
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={BRAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-white/25 hover:bg-white/[0.06]"
            >
              See our work
            </a>
          </div>
        </div>

        <ul className="grid gap-3">
          {POINTS.map((p) => (
            <li
              key={p}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-200"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500/15 text-violet-300">
                <Check className="h-3.5 w-3.5" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </section>
);
