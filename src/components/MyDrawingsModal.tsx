import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Plus, Trash2, Copy, Edit2, Search, HardDrive, Calendar } from 'lucide-react';
import { DrawingProject } from '../types';
import { getAllProjects, createNewProject, saveProject, deleteProject } from '../lib/storage';

interface MyDrawingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onSelectProject: (project: DrawingProject) => void;
  onCreateNew: () => void;
}

export const MyDrawingsModal: React.FC<MyDrawingsModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  onSelectProject,
  onCreateNew,
}) => {
  const [projects, setProjects] = useState<DrawingProject[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const loadAll = async () => {
    const list = await getAllProjects();
    setProjects(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadAll();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleRename = async (proj: DrawingProject) => {
    if (!editName.trim()) return;
    const updated = { ...proj, name: editName.trim(), updatedAt: Date.now() };
    await saveProject(updated);
    setEditingId(null);
    loadAll();
  };

  const handleDuplicate = async (proj: DrawingProject) => {
    const dup: DrawingProject = {
      ...proj,
      id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: `${proj.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveProject(dup);
    loadAll();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (projects.length <= 1) {
      alert('You cannot delete your only drawing.');
      return;
    }
    if (confirm('Are you sure you want to delete this drawing?')) {
      await deleteProject(id);
      loadAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">My Drawings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Local-first projects saved safely on your browser storage.
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

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 my-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drawings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            New Blank Canvas
          </button>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              No drawings found. Create one to get started!
            </div>
          ) : (
            filtered.map((proj) => {
              const isActive = proj.id === currentProjectId;
              const isEditing = editingId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    onClose();
                  }}
                  className={`group relative p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Thumbnail placeholder or preview */}
                    <div className="w-full h-24 rounded-lg bg-slate-100 dark:bg-slate-800/80 mb-3 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 overflow-hidden text-slate-400 text-xs font-mono">
                      {proj.elements.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <span>{proj.elements.length} elements</span>
                        </div>
                      ) : (
                        <span>Empty canvas</span>
                      )}
                    </div>

                    {/* Name */}
                    {isEditing ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(proj);
                          }}
                          className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(proj)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                          {proj.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(proj.id);
                            setEditName(proj.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Card footer actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                    <span className="text-[11px]">
                      {isActive ? (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Currently Open</span>
                      ) : (
                        'Click to open'
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(proj);
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Storage Notice Footer */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-emerald-500" />
            Projects are stored on your device using IndexedDB (No signup required).
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-xl hover:opacity-90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
