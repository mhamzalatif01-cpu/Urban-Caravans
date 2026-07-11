import { NextResponse } from 'next/server';
import { getNotes, saveNotes } from '../../../lib/store';
import { checkPasscode } from '../../../lib/auth';
import { SEED_NOTES } from '../../../lib/seedNotes';

export async function POST(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const notes = await getNotes();
  const existingTitles = new Set(notes.map(n => n.title));
  let added = 0;
  SEED_NOTES.forEach(seed => {
    if (!existingTitles.has(seed.title)) {
      notes.push({
        id: crypto.randomUUID(),
        title: seed.title,
        model: seed.model,
        topic: seed.topic,
        content: seed.content,
        updatedAt: Date.now()
      });
      added++;
    }
  });
  await saveNotes(notes);
  return NextResponse.json({ added });
}
