import React, { useEffect } from 'react';
import { ArrowLeft, PenTool, ArrowUpRight } from 'lucide-react';

export type LegalDoc = 'terms' | 'privacy';

interface LegalPageProps {
  doc: LegalDoc;
  onBack: () => void;
  onSwitch: (doc: LegalDoc) => void;
}

const BRAND_URL = 'https://nihmathullah.com';
const UPDATED = '23 July 2026';

export const LegalPage: React.FC<LegalPageProps> = ({ doc, onBack, onSwitch }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doc]);

  return (
    <div className="min-h-screen w-screen overflow-y-auto bg-[#0a0712] text-zinc-100 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-8 h-16 backdrop-blur-md bg-[#0a0712]/70 border-b border-white/5">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to NWS Draw
        </button>
        <div className="flex items-center gap-2.5">
          <img src="/nws-draw-logo.png" alt="NWS Draw" className="w-7 h-7 object-contain" />
          <span className="font-bold tracking-tight text-sm hidden sm:inline">NWS Draw</span>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14">
        {/* Doc switcher */}
        <div className="flex items-center gap-2 mb-8">
          {(['terms', 'privacy'] as LegalDoc[]).map((d) => (
            <button
              key={d}
              onClick={() => onSwitch(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                doc === d
                  ? 'bg-violet-500/15 text-violet-200 border border-violet-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {d === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </button>
          ))}
        </div>

        {doc === 'terms' ? <Terms /> : <Privacy />}

        <div className="mt-14 pt-6 border-t border-white/8 flex items-center justify-between text-sm">
          <span className="text-zinc-500">Questions?</span>
          <a href={BRAND_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-300 hover:text-violet-200 transition-colors">
            nihmathullah.com <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
};

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-8 mb-2 text-lg font-bold text-zinc-100">{children}</h2>
);
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[15px] leading-relaxed text-zinc-400">{children}</p>
);

const DocHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-start gap-3">
    <span className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
      <PenTool className="w-5 h-5 text-violet-300" />
    </span>
    <div>
      <h1 className="text-[clamp(1.6rem,4vw,2.25rem)] font-bold tracking-tight leading-tight">{title}</h1>
      <p className="eyebrow mt-1.5">Last updated {UPDATED}</p>
    </div>
  </div>
);

const Terms: React.FC = () => (
  <article className="space-y-1">
    <DocHeader title="Terms & Conditions" />

    <Heading>1. Acceptance of these terms</Heading>
    <P>
      By accessing or using NWS Draw (the “Service”), you agree to these Terms &amp; Conditions. If
      you do not agree, please do not use the Service. We may update these terms from time to time;
      the version published here, with the date above, is the one that applies.
    </P>

    <Heading>2. What NWS Draw is</Heading>
    <P>
      NWS Draw is a free, browser-based visual workspace for drawing, diagramming, wireframing,
      designing and presenting on an infinite canvas. It runs entirely in your browser and no
      account is required to use it.
    </P>

    <Heading>3. Acceptable use</Heading>
    <P>You may use NWS Draw for personal, educational and commercial work at no cost. In return, you agree not to:</P>
    <ul className="mt-2 space-y-1.5 text-[15px] text-zinc-400 list-disc pl-5">
      <li>use the Service to break the law or infringe the rights of others;</li>
      <li>use it to create or distribute content that is unlawful, deceptive or harmful;</li>
      <li>attempt to disrupt, overload or gain unauthorised access to the Service or its hosting;</li>
      <li>scrape, copy or redistribute the Service wholesale, or present it as your own product.</li>
    </ul>

    <Heading>4. Your drawings and projects</Heading>
    <P>
      You keep all rights to the drawings, diagrams and projects you create. Projects are stored
      locally in your own browser (IndexedDB) and are not uploaded to us. Clearing your browser
      storage will delete them, so export anything important — as an image, PDF or a
      .nwsdraw project file. You are solely responsible for the content you create.
    </P>

    <Heading>5. No warranty</Heading>
    <P>
      The Service is provided on an “as is” and “as available” basis. We make no warranty that it
      will be uninterrupted or error-free, or that exported files will be fit for a particular
      purpose. You are responsible for keeping backups of work that matters to you.
    </P>

    <Heading>6. Limitation of liability</Heading>
    <P>
      To the fullest extent permitted by law, NWS Draw, NWS Digital Services (nihmathullah.com) and
      their authors accept no liability for any loss or damage — direct, indirect or consequential —
      arising from your use of, or reliance on, the Service, including loss of locally stored work.
    </P>

    <Heading>7. Third-party services and links</Heading>
    <P>
      NWS Draw loads fonts from a third-party CDN and links to other products in the NWS family and
      to external sites. We do not control those services and are not responsible for their content,
      accuracy or availability; your use of them is subject to their own terms.
    </P>

    <Heading>8. Intellectual property</Heading>
    <P>
      The design, branding, text and code of NWS Draw belong to NWS Digital Services. Your projects
      are yours; the Service itself may not be copied or resold as a whole.
    </P>

    <Heading>9. Changes</Heading>
    <P>
      Features may be added, changed or removed at any time, and the Service may be unavailable
      without notice. Continued use after a change to these terms means you accept the updated terms.
    </P>
  </article>
);

const Privacy: React.FC = () => (
  <article className="space-y-1">
    <DocHeader title="Privacy Policy" />

    <Heading>1. Our approach</Heading>
    <P>
      NWS Draw is built to be private by default. There are no accounts, no sign-up and no tracking
      profiles. This policy explains the little data that is involved and how it is handled.
    </P>

    <Heading>2. Your work stays on your device</Heading>
    <P>
      The drawings, diagrams and projects you create are stored locally in your browser (IndexedDB /
      localStorage). They are not uploaded to or stored on our servers. We cannot see them, and
      clearing your browser data removes them permanently.
    </P>

    <Heading>3. Everything runs in your browser</Heading>
    <P>
      The canvas, exports and templates are processed entirely on your device. Exporting to PNG,
      JPG, SVG, PDF or a .nwsdraw file happens locally — your work never leaves your machine.
    </P>

    <Heading>4. What we don’t collect</Heading>
    <P>
      We do not require your name, email or any account. We do not sell data, and we do not build
      advertising profiles. Any basic, aggregate hosting logs exist only to keep the Service running
      and secure.
    </P>

    <Heading>5. Cookies</Heading>
    <P>
      NWS Draw does not use advertising or tracking cookies. Browser storage is used only to keep
      your projects and preferences (like the theme) on your own device.
    </P>

    <Heading>6. Fonts</Heading>
    <P>
      The interface loads the Geist typeface from Google Fonts, which involves a standard request to
      that CDN. No other third-party requests are made during normal use.
    </P>

    <Heading>7. Contact</Heading>
    <P>
      For any privacy question, reach NWS Digital Services at nihmathullah.com.
    </P>
  </article>
);
