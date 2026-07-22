import React, { useState } from 'react';
import { X, LayoutTemplate, ArrowRight, Lightbulb, GitFork, Workflow, Layout, Grid } from 'lucide-react';
import { Template } from '../types';
import { TEMPLATES } from '../lib/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Lightbulb,
  GitFork,
  Workflow,
  Layout,
  Grid,
};

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  const [category, setCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Brainstorm', 'Flowchart', 'Mind Map', 'Wireframe', 'Planning'];

  const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Starter Templates</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kickstart your brainstorming, diagrams, or wireframes in 1-click.
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

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {filtered.map((tmpl) => {
            const IconComp = ICON_MAP[tmpl.iconName] || LayoutTemplate;

            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 bg-white dark:bg-slate-800/40 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {tmpl.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>{tmpl.elements.length} elements ready</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Use Template <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
