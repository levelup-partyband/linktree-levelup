import type { WBForm } from '../data/weddingBrief';

/**
 * Brief persistence on a static site (no backend): a named library kept in
 * localStorage + JSON export/import for file backups, plus an auto-saved
 * working draft so a refresh never loses in-progress data.
 */

export type SavedBrief = {
  id: string;
  name: string;
  savedAt: number;
  archived: boolean;
  form: WBForm;
};

const LIB_KEY = 'levelup.briefs.v1';
const DRAFT_KEY = 'levelup.brief.draft.v1';

function readAll(): SavedBrief[] {
  try { return JSON.parse(localStorage.getItem(LIB_KEY) || '[]'); } catch { return []; }
}
function writeAll(list: SavedBrief[]) {
  localStorage.setItem(LIB_KEY, JSON.stringify(list));
}

/** Newest first. */
export function listBriefs(): SavedBrief[] {
  return readAll().sort((a, b) => b.savedAt - a.savedAt);
}

/** Create a new brief, or update the existing one when `id` is given. */
export function saveBrief(name: string, form: WBForm, id?: string): SavedBrief {
  const list = readAll();
  if (id) {
    const i = list.findIndex(b => b.id === id);
    if (i >= 0) {
      list[i] = { ...list[i], name, form, savedAt: Date.now() };
      writeAll(list);
      return list[i];
    }
  }
  const brief: SavedBrief = { id: 'b' + Date.now().toString(36), name, savedAt: Date.now(), archived: false, form };
  list.push(brief);
  writeAll(list);
  return brief;
}

export function deleteBrief(id: string) {
  writeAll(readAll().filter(b => b.id !== id));
}

export function setArchived(id: string, archived: boolean) {
  const list = readAll();
  const i = list.findIndex(b => b.id === id);
  if (i >= 0) { list[i].archived = archived; writeAll(list); }
}

/** Download a saved brief as a JSON file. */
export function exportBrief(b: SavedBrief) {
  const blob = new Blob([JSON.stringify(b, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brief-${(b.name || 'sposi').replace(/[^\w-]+/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Import a JSON file (a SavedBrief or a raw form) into the library. */
export async function importBriefFile(file: File): Promise<SavedBrief> {
  const data = JSON.parse(await file.text());
  const form: WBForm = data.form ?? data;
  const name: string = data.name || file.name.replace(/\.json$/i, '') || 'Brief importato';
  return saveBrief(name, form);
}

// ── Working draft (auto-save) ─────────────────────────────────────────────
export function saveDraft(form: WBForm) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch { /* quota */ }
}
export function loadDraft(): WBForm | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) as WBForm : null;
  } catch { return null; }
}
export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
