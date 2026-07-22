import { get, set, del, keys } from 'idb-keyval';
import { DrawingProject } from '../types';

const PROJECTS_INDEX_KEY = 'nws_draw_projects_index';
const CURRENT_PROJECT_ID_KEY = 'nws_draw_current_project_id';

export const createNewProject = (name: string = 'Untitled Drawing'): DrawingProject => {
  const now = Date.now();
  return {
    id: `project_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    mode: 'whiteboard',
    elements: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    gridType: 'dots',
    backgroundColor: '#f8fafc',
    createdAt: now,
    updatedAt: now,
  };
};

export async function getAllProjects(): Promise<DrawingProject[]> {
  try {
    const projectIds = (await get<string[]>(PROJECTS_INDEX_KEY)) || [];
    const projects: DrawingProject[] = [];
    for (const id of projectIds) {
      const proj = await get<DrawingProject>(`nws_proj_${id}`);
      if (proj) projects.push(proj);
    }
    // Sort by updatedAt descending
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err) {
    console.error('Failed to load projects from IndexedDB:', err);
    return [];
  }
}

export async function saveProject(project: DrawingProject): Promise<void> {
  try {
    const updated = { ...project, updatedAt: Date.now() };
    await set(`nws_proj_${updated.id}`, updated);

    // Update index list
    const projectIds = (await get<string[]>(PROJECTS_INDEX_KEY)) || [];
    if (!projectIds.includes(updated.id)) {
      projectIds.push(updated.id);
      await set(PROJECTS_INDEX_KEY, projectIds);
    }
    await set(CURRENT_PROJECT_ID_KEY, updated.id);
  } catch (err) {
    console.error('Failed to save project:', err);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await del(`nws_proj_${id}`);
    const projectIds = (await get<string[]>(PROJECTS_INDEX_KEY)) || [];
    const filtered = projectIds.filter((pId) => pId !== id);
    await set(PROJECTS_INDEX_KEY, filtered);
  } catch (err) {
    console.error('Failed to delete project:', err);
  }
}

export async function getLastActiveProjectId(): Promise<string | null> {
  try {
    return (await get<string>(CURRENT_PROJECT_ID_KEY)) || null;
  } catch {
    return null;
  }
}

export async function setLastActiveProjectId(id: string): Promise<void> {
  try {
    await set(CURRENT_PROJECT_ID_KEY, id);
  } catch (err) {
    console.error('Failed to set current project ID:', err);
  }
}
