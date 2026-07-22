import React from 'react';
import { X, Lock, Wrench, Gamepad2, Calculator, Briefcase, GraduationCap, PenTool, Vote, Terminal, Clapperboard, ExternalLink } from 'lucide-react';

interface EcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NWS_APPS: {
  name: string;
  desc: string;
  icon: typeof PenTool;
  color: string;
  active?: boolean;
  url?: string;
}[] = [
  {
    name: 'NWS Draw',
    desc: 'Visual drawing, mind maps, flowcharts & digital whiteboard canvas.',
    icon: PenTool,
    color: 'bg-indigo-600 text-white',
    active: true,
  },
  {
    name: 'NWS Code',
    desc: 'Browser-native IDE — write, run & learn code with zero setup.',
    icon: Terminal,
    color: 'bg-violet-600 text-white',
    url: 'https://nwscode.vercel.app',
  },
  {
    name: 'NWS Tools',
    desc: 'Everyday fast digital utilities, image compressors, converters & privacy tools.',
    icon: Wrench,
    color: 'bg-emerald-600 text-white',
    url: 'https://nwstools.vercel.app',
  },
  {
    name: 'NWS CV',
    desc: 'Professional career resume builder, portfolio generator & cover letters.',
    icon: Briefcase,
    color: 'bg-indigo-600 text-white',
    url: 'https://nwscv.vercel.app',
  },
  {
    name: 'NWS Games',
    desc: 'Fun, lightweight, interactive puzzle and educational games.',
    icon: Gamepad2,
    color: 'bg-rose-600 text-white',
    url: 'https://nwsgames.vercel.app',
  },
  {
    name: 'Live Ballot',
    desc: 'Secure, real-time elections, pollings, and community voting.',
    icon: Vote,
    color: 'bg-cyan-600 text-white',
    url: 'https://live-ballot.vercel.app',
  },
  {
    name: 'NWS Calc',
    desc: 'Advanced mathematical, scientific, financial & engineering calculators.',
    icon: Calculator,
    color: 'bg-violet-600 text-white',
  },
  {
    name: 'NWS Study',
    desc: 'Student productivity, flashcards, study notes & pomodoro timers.',
    icon: GraduationCap,
    color: 'bg-amber-600 text-white',
  },
  {
    name: 'NWS Media',
    desc: 'Image, video & audio tools in one connected workspace.',
    icon: Clapperboard,
    color: 'bg-fuchsia-600 text-white',
  },
];

export const EcosystemModal: React.FC<EcosystemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              NWS
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">NWS Ecosystem</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A connected suite of free, private, no-signup web applications.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6 max-h-[60vh] overflow-y-auto pr-1">
          {NWS_APPS.map((app) => {
            const Icon = app.icon;
            const inner = (
              <>
                <div className={`p-2.5 rounded-lg ${app.color} shrink-0 shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                      {app.name}
                      {app.active && (
                        <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          Active App
                        </span>
                      )}
                      {!app.active && !app.url && (
                        <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          Soon
                        </span>
                      )}
                    </h3>
                    {app.url && <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {app.desc}
                  </p>
                </div>
              </>
            );

            const cls = `p-4 rounded-xl border transition-all flex gap-3 items-start ${
              app.active
                ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-800'
                : app.url
                ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-70'
            }`;

            return app.url ? (
              <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <div key={app.name} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            All NWS apps are local-first &amp; require no sign up.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
