import { NextResponse } from 'next/server';
import { getNotes } from '../../../lib/store';
import { checkPasscode } from '../../../lib/auth';

function scoreNote(note, words) {
  const hay = (note.title + ' ' + note.content + ' ' + note.model + ' ' + note.topic).toLowerCase();
  let score = 0;
  words.forEach(w => { if (w.length > 2 && hay.includes(w)) score++; });
  return score;
}

function getRelevantNotes(notes, query, scopeModel, scopeTopic) {
  let pool = notes.filter(n => {
    if (scopeModel && n.model !== scopeModel) return false;
    if (scopeTopic && n.topic !== scopeTopic) return false;
    return true;
  });

  if (scopeModel || scopeTopic) {
    return pool.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 15);
  }

  const words = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = pool.map(n => ({ n, s: scoreNote(n, words) }));
  scored.sort((a, b) => b.s - a.s || (b.n.updatedAt || 0) - (a.n.updatedAt || 0));
  const withHits = scored.filter(x => x.s > 0).slice(0, 10);
  if (withHits.length > 0) return withHits.map(x => x.n);
  return pool.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 8);
}

function buildContext(relevant) {
  let ctx = '';
  let budget = 7000;
  for (const n of relevant) {
    const block = `### ${n.title}\nModel: ${n.model || '—'} | Topic: ${n.topic || '—'}\n${n.content}\n\n`;
    if (budget - block.length < 0) break;
    ctx += block;
    budget -= block.length;
  }
  return ctx;
}

export async function POST(req) {
  if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set on this deployment. Add it in your Netlify site\'s environment variables.' }, { status: 500 });
  }

  const { question, scopeModel, scopeTopic, mode, existingModels, existingTopics } = await req.json();
  const notes = await getNotes();

  if (mode === 'note') {
    // Parse a raw note into structured fields
    const systemPrompt = `You extract a structured note from a caravan drafter's raw, informal input. Respond with ONLY a JSON object, no markdown fences, no commentary, in this exact shape:
{"title": "short descriptive title", "model": "caravan model this applies to, or empty string if unclear", "topic": "one topic/category word or short phrase, or empty string if unclear", "content": "cleaned-up, complete version of the note, preserving all facts and numbers exactly as given"}

Existing models in use: ${(existingModels || []).join(', ') || '(none yet)'}
Existing topics in use: ${(existingTopics || []).join(', ') || '(none yet)'}
Prefer reusing an existing model/topic if the input clearly matches one, otherwise create a sensible new short tag. Never invent facts not present in the input.`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }]
      })
    });
    const data = await r.json();
    const textBlocks = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    const cleaned = textBlocks.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    let parsed;
    try { parsed = JSON.parse(cleaned); }
    catch (e) { return NextResponse.json({ parseError: true }); }
    return NextResponse.json({ parsed });
  }

  // Ask mode
  const relevant = getRelevantNotes(notes, question, scopeModel, scopeTopic);
  const context = buildContext(relevant);

  const systemPrompt = `You are a working reference assistant for a caravan drafter/planner. Answer ONLY using the notes provided below. Be concise and practical — this person is busy on the drafting floor.
Rules:
- If the notes contain a direct answer, give it clearly and mention which note(s) it came from (by title).
- If notes conflict (e.g. an older note vs a newer one), point out the conflict and prefer the note that seems most recently updated, but flag it so they can double check.
- If the notes don't cover the question, say so plainly — don't guess or use outside knowledge about caravans in general.
- Keep answers short and skimmable. Use short lists when helpful.

NOTES:
${context || '(no matching notes found)'}`;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }]
    })
  });
  const data = await r.json();
  const textBlocks = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
  return NextResponse.json({ answer: textBlocks || "I couldn't generate an answer — please try again." });
}
