'use client';
import { useEffect, useState, useRef } from 'react';

const STYLES = `
:root{
  --bg:#F6F4EE; --panel:#FFFFFF; --ink:#202A33; --ink-soft:#68737C; --line:#DEDACB;
  --blue:#2E5F8A; --blue-dark:#1F425F; --rust:#C1622D; --green:#4B7B4E; --amber:#D9822B; --danger:#B0463C;
}
*{box-sizing:border-box;}
body{background:var(--bg); color:var(--ink); font-family:Inter,system-ui,sans-serif;}
.wrap{max-width:1180px;margin:0 auto;padding:28px 20px 60px;}
.masthead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:22px;flex-wrap:wrap;}
.masthead h1{font-size:28px;font-weight:700;margin:0;}
.sub{font-size:11px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:1.2px;margin-top:4px;}
.layout{display:grid;grid-template-columns:360px 1fr;gap:20px;}
@media (max-width:880px){.layout{grid-template-columns:1fr;}}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:18px;}
.panel h2{font-size:15px;margin:0 0 12px;display:flex;align-items:center;justify-content:space-between;}
.btn{font-weight:600;font-size:13px;border:none;border-radius:6px;padding:8px 14px;cursor:pointer;}
.btn-primary{background:var(--blue);color:#fff;}
.btn-ghost{background:transparent;color:var(--blue);border:1px solid var(--blue);}
.btn-danger{background:transparent;color:var(--danger);border:1px solid var(--danger);}
.btn-small{padding:5px 10px;font-size:12px;}
input,select,textarea{font-size:13px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:#FCFBF7;color:var(--ink);width:100%;font-family:inherit;}
label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:var(--ink-soft);display:block;margin-bottom:5px;}
.field{margin-bottom:12px;}
.filters{display:flex;gap:8px;margin-bottom:12px;}
.filters select{flex:1;}
.search-box{margin-bottom:14px;}
.note-list{display:flex;flex-direction:column;gap:8px;max-height:420px;overflow-y:auto;}
.note-card{border:1px solid var(--line);border-radius:6px;padding:10px 12px;cursor:pointer;background:#FCFBF7;}
.note-card .title{font-weight:600;font-size:13.5px;margin-bottom:6px;}
.tags{display:flex;gap:6px;flex-wrap:wrap;}
.tag{font-family:monospace;font-size:10px;padding:3px 7px;border-radius:4px;}
.tag-model{background:#F5E4D8;color:var(--rust);}
.tag-topic{background:#E2ECE2;color:var(--green);}
.empty-state{font-size:13px;color:var(--ink-soft);text-align:center;padding:30px 10px;border:1px dashed var(--line);border-radius:6px;}
.chat-panel{display:flex;flex-direction:column;min-height:560px;}
.mode-toggle{display:flex;gap:6px;margin-bottom:10px;}
.mode-btn{font-family:monospace;font-size:11px;font-weight:600;text-transform:uppercase;padding:6px 12px;border-radius:5px;border:1px solid var(--line);background:transparent;color:var(--ink-soft);cursor:pointer;}
.mode-btn.active.mode-ask{background:var(--blue);color:#fff;border-color:var(--blue);}
.mode-btn.active.mode-note{background:var(--rust);color:#fff;border-color:var(--rust);}
.chat-scope{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
.chat-scope select{flex:1;min-width:140px;}
.chat-log{flex:1;overflow-y:auto;padding:6px 4px 10px;display:flex;flex-direction:column;gap:14px;min-height:360px;}
.msg{max-width:82%;}
.msg.user{align-self:flex-end;}
.msg.assistant{align-self:flex-start;}
.bubble{padding:10px 13px;border-radius:8px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;}
.msg.user .bubble{background:var(--blue);color:#fff;}
.msg.assistant .bubble{background:#F1EFE6;border:1px solid var(--line);}
.chat-input-row{display:flex;gap:8px;margin-top:12px;border-top:1px solid var(--line);padding-top:14px;}
.chat-input-row textarea{resize:none;height:46px;flex:1;}
.thinking{color:var(--ink-soft);font-size:12.5px;font-style:italic;}
.hint{font-size:12px;color:var(--ink-soft);margin-top:8px;line-height:1.5;}
.modal-backdrop{position:fixed;inset:0;background:rgba(32,42,51,0.45);display:flex;align-items:center;justify-content:center;z-index:50;}
.modal{background:var(--panel);border-radius:8px;padding:22px;width:480px;max-width:90vw;border:1px solid var(--line);}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;}
.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;}
.gate-box{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:28px;width:340px;}
`;

async function api(path, opts, passcode) {
  const res = await fetch(path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-team-passcode': passcode || '', ...(opts?.headers || {}) }
  });
  if (res.status === 401) { const e = new Error('unauthorized'); e.status = 401; throw e; }
  return res.json();
}

function PasscodeGate({ onUnlock }) {
  const [val, setVal] = useState('');
  return (
    <div className="gate">
      <div className="gate-box">
        <h2 style={{ marginTop: 0 }}>Spec Plate</h2>
        <p className="hint">Enter the team passcode to continue.</p>
        <input type="password" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onUnlock(val); }} placeholder="Passcode" />
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
          <div>
            <h1>Spec Plate</h1>
            <div className="sub">Caravan build notes — shared with your team</div>
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
                <div className="note-card" key={n.id} onClick={() => openEdit(n)}>
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
              <button className={`mode-btn mode-ask ${mode === 'ask' ? 'active' : ''}`} onClick={() => setMode('ask')}>Ask</button>
              <button className={`mode-btn mode-note ${mode === 'note' ? 'active' : ''}`} onClick={() => setMode('note')}>Add note</button>
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
              {chat.map((m, i) => <div className={`msg ${m.role}`} key={i}><div className="bubble">{m.content}</div></div>)}
              {busy && <div className="thinking">{mode === 'note' ? 'Filing that note...' : 'Checking notes...'}</div>}
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
