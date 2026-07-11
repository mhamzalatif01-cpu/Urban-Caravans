'use client';
import { useEffect, useState, useRef } from 'react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root{
  --bg:#F5F3EC; --panel:#FFFFFF; --ink:#1E2733; --ink-soft:#6B7680; --line:#DEDACB;
  --blue:#2E5F8A; --blue-dark:#1F425F; --rust:#C1622D; --green:#4B7B4E; --amber:#D9822B; --danger:#B0463C;
  --paper-line: rgba(46,95,138,0.055);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  background:
    linear-gradient(var(--paper-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--paper-line) 1px, transparent 1px),
    var(--bg);
  background-size: 28px 28px, 28px 28px, auto;
  color:var(--ink); font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
}
.wrap{max-width:1180px;margin:0 auto;padding:32px 20px 60px;}

.masthead{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:18px;margin-bottom:26px;flex-wrap:wrap;position:relative;}
.masthead::after{content:'';position:absolute;left:0;right:0;bottom:0;height:3px;
  background:repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 16px);}
.brand{display:flex;align-items:center;gap:12px;}
.plate-icon{width:42px;height:42px;flex-shrink:0;}
.masthead h1{font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;margin:0;letter-spacing:-0.2px;}
.sub{font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1.4px;margin-top:3px;}

.layout{display:grid;grid-template-columns:370px 1fr;gap:22px;}
@media (max-width:880px){.layout{grid-template-columns:1fr;}}

.panel{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:20px;
  box-shadow:0 1px 2px rgba(30,39,51,0.04), 0 8px 24px -16px rgba(30,39,51,0.12);}
.panel h2{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15.5px;margin:0 0 14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}

.btn{font-weight:600;font-size:13px;border:none;border-radius:7px;padding:8px 14px;cursor:pointer;
  transition:transform .1s ease, box-shadow .15s ease, background .15s ease, opacity .15s ease;}
.btn:active{transform:scale(0.96);}
.btn:disabled{opacity:0.5;cursor:default;}
.btn-primary{background:var(--blue);color:#fff;box-shadow:0 1px 2px rgba(46,95,138,0.3);}
.btn-primary:hover:not(:disabled){background:var(--blue-dark);box-shadow:0 2px 8px rgba(46,95,138,0.35);}
.btn-ghost{background:transparent;color:var(--blue);border:1px solid var(--blue);}
.btn-ghost:hover{background:#EAF1F7;}
.btn-danger{background:transparent;color:var(--danger);border:1px solid var(--danger);}
.btn-danger:hover{background:#FBEBE9;}
.btn-small{padding:5px 11px;font-size:12px;}

input,select,textarea{font-size:13px;padding:9px 11px;border:1px solid var(--line);border-radius:7px;background:#FCFBF7;color:var(--ink);width:100%;font-family:inherit;transition:border-color .15s ease, box-shadow .15s ease;}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px rgba(46,95,138,0.12);}
label{font-family:'IBM Plex Mono',monospace;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.7px;color:var(--ink-soft);display:block;margin-bottom:6px;}
.field{margin-bottom:13px;}
.filters{display:flex;gap:8px;margin-bottom:12px;}
.filters select{flex:1;}
.search-box{margin-bottom:14px;}

.note-list{display:flex;flex-direction:column;gap:9px;max-height:440px;overflow-y:auto;padding-right:2px;}
.note-card{position:relative;border:1px solid var(--line);border-radius:8px;padding:11px 13px 11px 16px;cursor:pointer;background:#FCFBF7;
  transition:transform .12s ease, box-shadow .15s ease, border-color .15s ease;}
.note-card::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:2px;background:var(--accent, var(--blue));}
.note-card:hover{transform:translateX(2px);box-shadow:0 4px 14px -8px rgba(30,39,51,0.25);border-color:#CFC9B6;}
.note-card .title{font-weight:600;font-size:13.5px;margin-bottom:7px;line-height:1.3;}
.tags{display:flex;gap:6px;flex-wrap:wrap;}
.tag{font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;padding:3px 7px;border-radius:4px;letter-spacing:0.2px;}
.tag-model{background:#F5E4D8;color:var(--rust);}
.tag-topic{background:#E2ECE2;color:var(--green);}
.empty-state{font-size:13px;color:var(--ink-soft);text-align:center;padding:34px 14px;border:1px dashed var(--line);border-radius:8px;line-height:1.6;}

.chat-panel{display:flex;flex-direction:column;min-height:580px;}
.mode-toggle{display:flex;gap:6px;margin-bottom:12px;}
.mode-btn{font-family:'IBM Plex Mono',monospace;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
  padding:7px 13px;border-radius:6px;border:1px solid var(--line);background:transparent;color:var(--ink-soft);cursor:pointer;
  display:flex;align-items:center;gap:6px;transition:all .15s ease;}
.mode-btn:hover:not(.active){border-color:var(--ink-soft);}
.mode-btn.active.mode-ask{background:var(--blue);color:#fff;border-color:var(--blue);box-shadow:0 1px 3px rgba(46,95,138,0.3);}
.mode-btn.active.mode-note{background:var(--rust);color:#fff;border-color:var(--rust);box-shadow:0 1px 3px rgba(193,98,45,0.3);}
.chat-scope{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
.chat-scope select{flex:1;min-width:140px;}

.chat-log{flex:1;overflow-y:auto;padding:6px 4px 10px;display:flex;flex-direction:column;gap:14px;min-height:380px;}
.msg{max-width:82%;animation:msgIn .25s ease both;}
@keyframes msgIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.msg.user{align-self:flex-end;}
.msg.assistant{align-self:flex-start;display:flex;gap:8px;align-items:flex-start;}
.avatar{width:24px;height:24px;flex-shrink:0;border-radius:6px;background:var(--blue);display:flex;align-items:center;justify-content:center;margin-top:2px;}
.bubble{padding:11px 14px;border-radius:10px;font-size:13.5px;line-height:1.55;white-space:pre-wrap;}
.msg.user .bubble{background:var(--blue);color:#fff;border-bottom-right-radius:3px;}
.msg.assistant .bubble{background:#F1EFE6;border:1px solid var(--line);border-bottom-left-radius:3px;}

.chat-input-row{display:flex;gap:8px;margin-top:12px;border-top:1px solid var(--line);padding-top:14px;}
.chat-input-row textarea{resize:none;height:46px;flex:1;}
.thinking{display:flex;align-items:center;gap:8px;color:var(--ink-soft);font-size:12.5px;padding-left:32px;}
.dot-pulse{display:flex;gap:3px;}
.dot-pulse span{width:5px;height:5px;border-radius:50%;background:var(--ink-soft);animation:dotPulse 1.1s infinite ease-in-out;}
.dot-pulse span:nth-child(2){animation-delay:.15s;}
.dot-pulse span:nth-child(3){animation-delay:.3s;}
@keyframes dotPulse{0%,60%,100%{opacity:0.25;transform:scale(0.85);}30%{opacity:1;transform:scale(1);}}

.hint{font-size:12px;color:var(--ink-soft);margin-top:8px;line-height:1.6;}
.modal-backdrop{position:fixed;inset:0;background:rgba(30,39,51,0.5);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:50;animation:fadeIn .15s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--panel);border-radius:12px;padding:24px;width:480px;max-width:90vw;border:1px solid var(--line);
  box-shadow:0 24px 60px -20px rgba(30,39,51,0.4);animation:modalIn .18s ease;}
@keyframes modalIn{from{opacity:0;transform:scale(0.97) translateY(6px);}to{opacity:1;transform:scale(1) translateY(0);}}
.modal h3{font-family:'Space Grotesk',sans-serif;margin:0 0 16px;font-size:17px;}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px;}

.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;}
.gate-box{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:32px;width:340px;
  box-shadow:0 24px 60px -20px rgba(30,39,51,0.35);text-align:center;}
.gate-box .plate-icon{margin:0 auto 14px;}
.gate-box h2{font-family:'Space Grotesk',sans-serif;margin:0 0 4px;font-size:20px;}

::-webkit-scrollbar{width:8px;height:8px;}
::-webkit-scrollbar-thumb{background:var(--line);border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:#CFC9B6;}
`;

const TOPIC_COLORS = {
  Electrical: '#2E5F8A', Plumbing: '#3A7CA5', 'Chassis/Suspension': '#C1622D',
  'Colours/Finishes': '#8A5FB0', Layout: '#4B7B4E', 'Layout/Furniture': '#4B7B4E',
  Dimensions: '#B08A2E', Reference: '#6B7680', Suppliers: '#2E5F8A', Weight: '#B0463C',
  Appliances: '#3A7CA5', External: '#C1622D', Process: '#4B7B4E', 'Model-specific': '#8A5FB0'
};
function topicAccent(topic) { return TOPIC_COLORS[topic] || '#2E5F8A'; }

function PlateIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="39" height="39" rx="7" fill="#1E2733" />
      <rect x="1.5" y="1.5" width="39" height="39" rx="7" stroke="#F5F3EC" strokeOpacity="0.15" />
      <circle cx="7" cy="7" r="1.6" fill="#F5F3EC" fillOpacity="0.5" />
      <circle cx="35" cy="7" r="1.6" fill="#F5F3EC" fillOpacity="0.5" />
      <circle cx="7" cy="35" r="1.6" fill="#F5F3EC" fillOpacity="0.5" />
      <circle cx="35" cy="35" r="1.6" fill="#F5F3EC" fillOpacity="0.5" />
      <path d="M11 21h20M11 15h13M11 27h13" stroke="#F5F3EC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AssistantAvatar() {
  return (
    <div className="avatar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M4 17h16M4 12h11M4 7h16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

async function api(path, opts, passcode) {
  const res = await fetch(path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-team-passcode': passcode || '', ...(opts?.headers || {}) }
  });
  if (res.status === 401) { const e = new Error('unauthorized'); e.status = 401; throw e; }
  let data;
  try { data = await res.json(); }
  catch (e) { return { error: `Server returned an unexpected response (status ${res.status}). Check the Netlify function logs.` }; }
  if (!res.ok && !data.error) data.error = `Request failed (status ${res.status}).`;
  return data;
}

function PasscodeGate({ onUnlock }) {
  const [val, setVal] = useState('');
  return (
    <div className="gate">
      <div className="gate-box">
        <PlateIcon size={44} />
        <h2>Spec Plate</h2>
        <p className="hint">Enter the team passcode to continue.</p>
        <input type="password" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onUnlock(val); }} placeholder="Passcode" autoFocus />
        <button className="btn btn-primary" style={{ marginTop: 12, width: '100%' }} onClick={() => onUnlock(val)}>Enter</button>
      </div>
    </div>
  );
}

export default function Page() {
  const [passcode, setPasscode] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [scopeModel, setScopeModel] = useState('');
  const [scopeTopic, setScopeTopic] = useState('');
  const [mode, setMode] = useState('ask');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', model: '', topic: '', content: '' });
  const chatLogRef = useRef(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('spec-plate-passcode') : null;
    if (saved !== null) { setPasscode(saved); setUnlocked(true); }
  }, []);

  useEffect(() => { if (unlocked) loadNotes(); }, [unlocked]);
  useEffect(() => { if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; }, [chat]);

  async function loadNotes() {
    try {
      const data = await api('/api/notes', { method: 'GET' }, passcode);
      setNotes(data.notes || []);
    } catch (e) { if (e.status === 401) relock(); }
  }

  function relock() {
    localStorage.removeItem('spec-plate-passcode');
    setUnlocked(false);
  }

  function tryUnlock(val) {
    localStorage.setItem('spec-plate-passcode', val);
    setPasscode(val);
    setUnlocked(true);
  }

  const models = [...new Set(notes.map(n => n.model).filter(Boolean))].sort();
  const topics = [...new Set(notes.map(n => n.topic).filter(Boolean))].sort();

  const filteredNotes = notes.filter(n => {
    if (filterModel && n.model !== filterModel) return false;
    if (filterTopic && n.topic !== filterTopic) return false;
    if (search) {
      const hay = (n.title + ' ' + n.content + ' ' + n.model + ' ' + n.topic).toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  function openNew() {
    setEditing(null);
    setForm({ title: '', model: filterModel, topic: filterTopic, content: '' });
    setModalOpen(true);
  }
  function openEdit(n) {
    setEditing(n.id);
    setForm({ title: n.title, model: n.model, topic: n.topic, content: n.content });
    setModalOpen(true);
  }

  async function saveNoteForm() {
    if (!form.title.trim() || !form.content.trim()) { alert('Add at least a title and content.'); return; }
    try {
      if (editing) {
        await api('/api/notes', { method: 'PUT', body: JSON.stringify({ id: editing, ...form }) }, passcode);
      } else {
        await api('/api/notes', { method: 'POST', body: JSON.stringify(form) }, passcode);
      }
      setModalOpen(false);
      loadNotes();
    } catch (e) { if (e.status === 401) relock(); }
  }

  async function deleteNoteForm() {
    if (!editing || !confirm('Delete this note?')) return;
    try {
      await api(`/api/notes?id=${editing}`, { method: 'DELETE' }, passcode);
      setModalOpen(false);
      loadNotes();
    } catch (e) { if (e.status === 401) relock(); }
  }

  async function importSeed() {
    setBusy(true);
    try {
      const data = await api('/api/seed', { method: 'POST' }, passcode);
      setChat(c => [...c, { role: 'assistant', content: data.added > 0 ? `Imported ${data.added} note(s) from the starter reference set.` : 'Starter notes are already imported.' }]);
      loadNotes();
    } catch (e) { if (e.status === 401) relock(); }
    setBusy(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setChat(c => [...c, { role: 'user', content: text }]);
    setBusy(true);
    try {
      if (mode === 'note') {
        const data = await api('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ question: text, mode: 'note', existingModels: models, existingTopics: topics })
        }, passcode);
        if (data.error) { setChat(c => [...c, { role: 'assistant', content: data.error }]); setBusy(false); return; }
        if (data.parseError) {
          setChat(c => [...c, { role: 'assistant', content: "Couldn't parse that into a note — try rephrasing, or use the '+ Add note' form." }]);
          setBusy(false); return;
        }
        await api('/api/notes', { method: 'POST', body: JSON.stringify(data.parsed) }, passcode);
        const tagBits = [data.parsed.model, data.parsed.topic].filter(Boolean).join(' / ');
        setChat(c => [...c, { role: 'assistant', content: `Saved: "${data.parsed.title}"${tagBits ? ' — tagged ' + tagBits : ''}.` }]);
        loadNotes();
      } else {
        const data = await api('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ question: text, mode: 'ask', scopeModel, scopeTopic, history: chat })
        }, passcode);
        setChat(c => [...c, { role: 'assistant', content: data.error || data.answer }]);
      }
    } catch (e) {
      if (e.status === 401) { relock(); }
      else setChat(c => [...c, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setBusy(false);
  }

  if (!unlocked) return (<><style>{STYLES}</style><PasscodeGate onUnlock={tryUnlock} /></>);

  return (
    <>
      <style>{STYLES}</style>
      <div className="wrap">
        <div className="masthead">
          <div className="brand">
            <PlateIcon />
            <div>
              <h1>Spec Plate</h1>
              <div className="sub">Caravan build notes — shared with your team</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-small" onClick={relock}>Lock</button>
        </div>

        <div className="layout">
          <div className="panel">
            <h2>Notes
              <span>
                <button className="btn btn-ghost btn-small" onClick={importSeed} disabled={busy}>Import starter set</button>{' '}
                <button className="btn btn-primary btn-small" onClick={openNew}>+ Add note</button>
              </span>
            </h2>
            <div className="search-box">
              <input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filters">
              <select value={filterModel} onChange={e => setFilterModel(e.target.value)}>
                <option value="">All models</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
                <option value="">All topics</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="note-list">
              {filteredNotes.length === 0 && <div className="empty-state">No notes yet. Add one, or import the starter set.</div>}
              {filteredNotes.map(n => (
                <div className="note-card" key={n.id} onClick={() => openEdit(n)} style={{ '--accent': topicAccent(n.topic) }}>
                  <div className="title">{n.title}</div>
                  <div className="tags">
                    {n.model && <span className="tag tag-model">{n.model}</span>}
                    {n.topic && <span className="tag tag-topic">{n.topic}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel chat-panel">
            <h2>Ask <button className="btn btn-ghost btn-small" onClick={() => setChat([])}>Clear chat</button></h2>
            <div className="mode-toggle">
              <button className={`mode-btn mode-ask ${mode === 'ask' ? 'active' : ''}`} onClick={() => setMode('ask')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Ask
              </button>
              <button className={`mode-btn mode-note ${mode === 'note' ? 'active' : ''}`} onClick={() => setMode('note')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Add note
              </button>
            </div>
            {mode === 'ask' && (
              <div className="chat-scope">
                <select value={scopeModel} onChange={e => setScopeModel(e.target.value)}>
                  <option value="">Scope: all models</option>
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={scopeTopic} onChange={e => setScopeTopic(e.target.value)}>
                  <option value="">Scope: all topics</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
            <div className="chat-log" ref={chatLogRef}>
              {chat.length === 0 && <div className="empty-state">Ask a question, or switch to "Add note" to log something new.</div>}
              {chat.map((m, i) => (
                <div className={`msg ${m.role}`} key={i}>
                  {m.role === 'assistant' && <AssistantAvatar />}
                  <div className="bubble">{m.content}</div>
                </div>
              ))}
              {busy && (
                <div className="thinking">
                  <span className="dot-pulse"><span></span><span></span><span></span></span>
                  {mode === 'note' ? 'Filing that note...' : 'Checking notes...'}
                </div>
              )}
            </div>
            <div className="chat-input-row">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder={mode === 'ask' ? 'Ask a question about your notes...' : 'Type the note as it comes to you...'}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <button className="btn btn-primary" onClick={send} disabled={busy}>{mode === 'ask' ? 'Ask' : 'Save note'}</button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal">
            <h3>{editing ? 'Edit note' : 'New note'}</h3>
            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="field"><label>Model</label><input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} list="models" /></div>
            <div className="field"><label>Topic</label><input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} list="topics" /></div>
            <div className="field"><label>Content</label><textarea style={{ height: 140 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <datalist id="models">{models.map(m => <option key={m} value={m} />)}</datalist>
            <datalist id="topics">{topics.map(t => <option key={t} value={t} />)}</datalist>
            <div className="modal-actions">
              {editing && <button className="btn btn-danger btn-small" onClick={deleteNoteForm}>Delete</button>}
              <button className="btn btn-ghost btn-small" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-small" onClick={saveNoteForm}>Save note</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
