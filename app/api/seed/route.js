import { NextResponse } from 'next/server';
import { getNotes, saveNotes } from '../../../lib/store';
import { checkPasscode } from '../../../lib/auth';
import { SEED_NOTES } from '../../../lib/seedNotes';
import { WEBSITE_NOTES } from '../../../lib/websiteNotes';

export async function POST(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let dataset = 'starter';
  try {
    const body = await req.json();
    if (body?.dataset) dataset = body.dataset;
  } catch (e) { /* no body sent — default to starter for backwards compatibility */ }

  const source = dataset === 'website' ? WEBSITE_NOTES : SEED_NOTES;

  const notes = await getNotes();
  const existingTitles = new Set(notes.map(n => n.title));
  let added = 0;
  source.forEach(seed => {
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
