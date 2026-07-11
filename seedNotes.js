import { NextResponse } from 'next/server';
import { getNotes, saveNotes } from '../../../lib/store';
import { checkPasscode } from '../../../lib/auth';

export async function GET(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const notes = await getNotes();
  return NextResponse.json({ notes });
}

export async function POST(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const notes = await getNotes();
  const note = {
    id: crypto.randomUUID(),
    title: body.title || 'Untitled',
    model: body.model || '',
    topic: body.topic || '',
    content: body.content || '',
    updatedAt: Date.now()
  };
  notes.push(note);
  await saveNotes(notes);
  return NextResponse.json({ note });
}

export async function PUT(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const notes = await getNotes();
  const idx = notes.findIndex(n => n.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });
  notes[idx] = { ...notes[idx], title: body.title, model: body.model, topic: body.topic, content: body.content, updatedAt: Date.now() };
  await saveNotes(notes);
  return NextResponse.json({ note: notes[idx] });
}

export async function DELETE(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  let notes = await getNotes();
  notes = notes.filter(n => n.id !== id);
  await saveNotes(notes);
  return NextResponse.json({ ok: true });
}
