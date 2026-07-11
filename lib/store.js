import { getStore } from '@netlify/blobs';

// All notes are stored as one JSON blob under a single shared key,
// since this is a small-team shared reference rather than per-user data.
const NOTES_KEY = 'notes';

function notesStore() {
  // On a deployed Netlify site this connects automatically — no config needed.
  return getStore('spec-plate');
}

export async function getNotes() {
  const store = notesStore();
  const notes = await store.get(NOTES_KEY, { type: 'json' });
  return notes || [];
}

export async function saveNotes(notes) {
  const store = notesStore();
  await store.setJSON(NOTES_KEY, notes);
}
