import { NextResponse } from 'next/server';
import { getNotes } from '../../../lib/store';
import { checkPasscode } from '../../../lib/auth';

const GEMINI_MODEL = 'gemini-3.5-flash';

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
    const source = n.title.startsWith('Public Website —') ? 'PUBLIC WEBSITE DATA' : 'INTERNAL TEAM NOTES';
    const block = `### [${source}] ${n.title}\nModel: ${n.model || '—'} | Topic: ${n.topic || '—'}\n${n.content}\n\n`;
    if (budget - block.length < 0) break;
    ctx += block;
    budget -= block.length;
  }
  return ctx;
}

// Calls Gemini's generateContent endpoint. Throws with a readable message on any failure.
async function callGemini({ systemPrompt, contents, jsonMode }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set on this deployment. Add it in your Netlify site's environment variables.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };
  if (jsonMode) body.generationConfig = { responseMimeType: 'application/json' };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  let data;
  try { data = await r.json(); }
  catch (e) { throw new Error(`Gemini returned a non-JSON response (status ${r.status}).`); }

  if (!r.ok) {
    throw new Error(`Gemini API error: ${data?.error?.message || JSON.stringify(data)}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  if (!text) {
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(`Gemini returned no text${finishReason ? ` (finishReason: ${finishReason})` : ''}.`);
  }
  return text;
}

export async function POST(req) {
  try {
    if (!checkPasscode(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { question, scopeModel, scopeTopic, mode, existingModels, existingTopics, history } = await req.json();
    const notes = await getNotes();

    if (mode === 'note') {
      const systemPrompt = `You extract a structured note from a caravan drafter's raw, informal input. Respond with ONLY a JSON object, no markdown fences, no commentary, in this exact shape:
{"title": "short descriptive title", "model": "caravan model this applies to, or empty string if unclear", "topic": "one topic/category word or short phrase, or empty string if unclear", "content": "cleaned-up, complete version of the note, preserving all facts and numbers exactly as given"}

Existing models in use: ${(existingModels || []).join(', ') || '(none yet)'}
Existing topics in use: ${(existingTopics || []).join(', ') || '(none yet)'}
Prefer reusing an existing model/topic if the input clearly matches one, otherwise create a sensible new short tag. Never invent facts not present in the input.`;

      let text;
      try {
        text = await callGemini({
          systemPrompt,
          contents: [{ role: 'user', parts: [{ text: question }] }],
          jsonMode: true
        });
      } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }

      const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch (e) { return NextResponse.json({ parseError: true }); }
      return NextResponse.json({ parsed });
    }

    // Ask mode
    const relevant = getRelevantNotes(notes, question, scopeModel, scopeTopic);
    const context = buildContext(relevant);

    const systemPrompt = `You are a knowledgeable working assistant for a caravan drafter/planner. Your reference notes come from two distinct sources, tagged in the material below: INTERNAL TEAM NOTES (the team's own build/drafting rules) and PUBLIC WEBSITE DATA (Urban Caravans' own public marketing site — useful, but customer-facing and sometimes rounded/simplified compared to internal truth).

Structure EVERY answer using exactly these three headed sections, in this order, using this exact markdown:

**1. From your notes**
Answer using ONLY the INTERNAL TEAM NOTES material. Name the specific note title(s) you drew from. If nothing in the internal notes is relevant to this question, write: "Nothing in your team notes covers this." Keep it concise.

**2. From your scraped public data**
Answer using ONLY the PUBLIC WEBSITE DATA material. Name the specific note title(s) you drew from. If nothing in the public data is relevant, write: "Nothing in the public website data covers this." Keep it concise.

**3. General technical/industry input**
Your own reasoning based on standard caravan design, manufacturing and RV industry practice — NOT drawn from either data source above. Be precise and technically accurate; if you're not confident about a specific figure or standard, say so rather than guessing a number. Keep this crisp — a few sentences or a short list, not a lecture.

Rules that apply across all three sections:
- If sections 1 and 2 disagree with each other (e.g. an internal spec doesn't match the public spec), point that out explicitly, in section 1 or 2 as relevant — don't silently pick one.
- If notes within the same source conflict (e.g. an older note vs a newer one), flag it and prefer whichever is more recently updated.
- This is a real conversation — use prior messages for context on follow-up questions ("what about the Tourer?" refers back to what was just discussed).
- Never skip a section — always include all three headers, even if a section is just one line saying nothing applies.
- Be concise throughout. This person is busy on the drafting floor, not reading a report.

REFERENCE MATERIAL:
${context || '(no closely matching notes found in either source for this question)'}`;

    const historyContents = (Array.isArray(history) ? history : [])
      .slice(-12)
      .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

    let answer;
    try {
      answer = await callGemini({
        systemPrompt,
        contents: [...historyContents, { role: 'user', parts: [{ text: question }] }],
        jsonMode: false
      });
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }

    return NextResponse.json({ answer });
  } catch (outerErr) {
    return NextResponse.json({ error: `Unexpected server error: ${outerErr.message || outerErr}` }, { status: 500 });
  }
}
