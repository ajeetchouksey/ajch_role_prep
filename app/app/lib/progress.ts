/**
 * Device-local practice progress. Signed-out practice saves here; sign-in sync
 * with api.aaryaai.dev comes later (docs/06-app-architecture.md). Every access
 * is guarded: storage can be unavailable (private mode, cleared site data).
 */
import type { LevelId } from './content';

export interface Rep {
  key: string; // topic/subtopic/moment
  level: LevelId;
  score: number; // rubric points self-scored as covered
  of: number;
  at: string;
}

const KEY = 'roleprep.reps.v1';
const LEVEL_KEY = 'roleprep.level.v1';

export function loadReps(): Rep[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}

export function saveRep(rep: Rep) {
  try { localStorage.setItem(KEY, JSON.stringify([...loadReps(), rep].slice(-500))); } catch { /* storage unavailable */ }
}

export function loadLevel(): LevelId {
  try { return (localStorage.getItem(LEVEL_KEY) as LevelId) || 'tech'; } catch { return 'tech'; }
}

export function saveLevel(level: LevelId) {
  try { localStorage.setItem(LEVEL_KEY, level); } catch { /* storage unavailable */ }
}
