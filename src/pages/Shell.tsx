import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ask, getHealth, Health, Answer } from "../lib/api";
import { demoAutoReplies, demoConversations, demoKeywords, demoKnowledge } from "../data/demo";

const NAV = [["dashboard", "Dashboard"], ["inbox", "Inbox"], ["auto-replies", "Auto replies"], ["keyword-automations", "Keyword automations"], ["integrations", "Integrations"], ["settings", "Settings"], ["contact", "Contact"]];
const Demo = () => <span className="pill">Demo data</span>;

function useHealth() { const [h, setH] = useState<Health | null | undefined>(undefined); useEffect(() => { getHealth().then(setH); }, []); return h; }
const Status = ({ ok, loading }: { ok?: boolean; loading: boolean }) => <span className={ok ? "text-cyan" : "text-mute"}>{loading ? "Checking…" : ok ? "● Connected" : "○ Setup required"}</span>;

function Dashboard() {
  const h = useHealth();
  const tiles = [["Total messages", "128"], ["AI questions", "74"], ["Auto replies", "96"], ["Awaiting review", "3"], ["Keyword rules", String(demoKeywords.length)]];
  return (<div className="space-y-4">
    <p className="muted">Demo workspace. Counters below are sample data; real counters appear in Bot B with /stats.</p>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {tiles.map(([k, v]) => <div key={k} className="card"><p className="muted">{k}</p><p className="text-2xl font-display">{v}</p><Demo /></div>)}
      <div className="card"><p className="muted">Connected bots</p><p className="text-2xl font-display">{h === undefined ? "…" : h ? Number(h.telegramBotA) + Number(h.telegramBotB) : 0} / 2</p><span className="pill">Verified by /api/health</span></div>
    </div></div>);
}

function Inbox() {
  const [q, setQ] = useState(""); const [sel, setSel] = useState(demoConversations[0]); const [res, setRes] = useState<Answer | { error: string } | null>(null); const [busy, setBusy] = useState(false); const [draft, setDraft] = useState("");
  const list = demoConversations.filter((c) => (c.user + c.question).toLowerCase().includes(q.toLowerCase()));
  const suggest = async () => { setBusy(true); const r = await ask(sel.question); setRes(r); if ("answer" in r) setDraft(r.answer); setBusy(false); };
  useEffect(() => { setRes(null); setDraft(""); }, [sel]);
  return (<div className="grid lg:grid-cols-[320px_1fr] gap-4">
    <div className="space-y-2"><input className="input" placeholder="Search conversations" aria-label="Search conversations" value={q} onChange={(e) => setQ(e.target.value)} /><Demo />
      {list.map((c) => <button key={c.id} onClick={() => setSel(c)} className={`card w-full text-left ${sel.id === c.id ? "border-violet" : ""}`}><b className="text-sm">{c.user}</b> <span className="pill">{c.channel}</span>{c.important && <span className="pill ml-1">Important</span>}<p className="muted mt-1">{c.question}</p><p className="text-xs text-cyan mt-1">{c.status}</p></button>)}
      {!list.length && <p className="muted">No conversations match. Clear the search to see all.</p>}</div>
    <div className="card space-y-3"><div className="bubble bg-bg2 border border-line">{sel.question}</div>
      <button className="btn btn-primary" onClick={suggest} disabled={busy}>{busy ? "Analysing…" : "Generate AI suggestion"}</button>
      {res && ("error" in res ? <p role="alert" className="text-sm text-red-400">{res.error}</p> : <div className="space-y-2"><p className="muted">Intent {res.intent} · {res.confidence.replace("_CONFIDENCE", "")} · via {res.source}{res.requiresReview ? " · needs review" : ""}</p><label className="text-sm">AI suggestion<textarea className="input mt-1 h-40" value={draft} onChange={(e) => setDraft(e.target.value)} /></label>
        <div className="flex gap-2 flex-wrap"><button className="btn" onClick={suggest}>Regenerate</button><button className="btn" onClick={() => navigator.clipboard?.writeText(draft)}>Copy reply</button></div></div>)}
      <p className="muted">Sending replies happens through Telegram Bot B (Approve / Reply). The dashboard shows sample conversations.</p></div></div>);
}

function AutoReplies() { return (<div className="space-y-3"><Demo />{demoAutoReplies.map((r) => <div key={r.name} className="card"><b>{r.name}</b> <span className="pill">{r.enabled ? "Enabled" : "Off"}</span>{r.review && <span className="pill ml-1">Requires review</span>}<p className="muted mt-1">Pattern: {r.pattern}</p><p className="text-sm mt-1">{r.response}</p></div>)}<p className="muted">Live rules are defined in lib/rules.ts and read by Bot A.</p></div>); }
function Keywords() { return (<div className="space-y-3"><Demo /><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-mute"><tr><th className="p-2">Keyword</th><th>Match</th><th>Platform</th><th>Resource</th><th>Enabled</th><th>Triggers</th></tr></thead><tbody>{demoKeywords.map((k) => <tr key={k.keyword} className="border-t border-line"><td className="p-2 font-semibold">{k.keyword}</td><td>{k.matchType}</td><td>{k.platform}</td><td className="break-all">{k.url}</td><td>{k.enabled ? "Yes" : "No"}</td><td>{k.triggers}</td></tr>)}</tbody></table></div></div>); }

function Integrations() {
  const h = useHealth(); const l = h === undefined;
  const rows: [string, boolean | undefined, string][] = [["Telegram Bot A", h?.telegramBotA, "Public assistant"], ["Telegram Bot B", h?.telegramBotB, "Owner console"], ["Google Gemini", h?.gemini, "Answer generation"]];
  return (<div className="grid sm:grid-cols-2 gap-3">{rows.map(([n, ok, d]) => <div key={n} className="card"><b>{n}</b><p className="muted">{d}</p><Status ok={ok} loading={l} /></div>)}
    {["Instagram", "YouTube", "Discord", "Email"].map((n) => <div key={n} className="card"><b>{n}</b><p className="muted">Not built yet</p><span className="text-mute">Planned</span></div>)}</div>);
}

function Settings() { return (<div className="space-y-4"><Demo /><div className="card space-y-2"><b>Creator knowledge</b><p className="muted">Source of truth: knowledge/creator.md. Edit it in your repo and redeploy. A database-backed editor is on the roadmap.</p><div className="flex gap-2 flex-wrap">{demoKnowledge.map((k) => <span key={k} className="pill">{k}</span>)}</div></div><div className="card"><b>AI preferences</b><p className="muted">Tone, detail level and review thresholds are set in lib/ai.ts and lib/confidence.ts.</p></div></div>); }

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" }); const [msg, setMsg] = useState("");
  const send = async (e: React.FormEvent) => { e.preventDefault(); setMsg("Sending…"); try { const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); const d = await r.json(); setMsg(d.delivered ? "Sent to the creator on Telegram." : d.error || d.note || "Not delivered."); } catch { setMsg("Backend not reachable."); } };
  return (<form onSubmit={send} className="card max-w-lg space-y-3"><input className="input" placeholder="Name" aria-label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /><input className="input" type="email" required placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /><textarea className="input h-32" required placeholder="Message" aria-label="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /><button className="btn btn-primary">Send message</button>{msg && <p role="status" className="muted">{msg}</p>}</form>);
}

export default function Shell({ page }: { page: string }) {
  const [open, setOpen] = useState(false); const nav = useNavigate(); const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  const body = { dashboard: <Dashboard />, inbox: <Inbox />, "auto-replies": <AutoReplies />, "keyword-automations": <Keywords />, integrations: <Integrations />, settings: <Settings />, contact: <Contact /> }[page];
  const title = NAV.find((n) => n[0] === page)?.[1];
  return (<div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]">
    <aside className={`${open ? "block" : "hidden"} lg:block bg-bg2 border-r border-line p-4 fixed lg:static inset-0 z-20 lg:z-auto overflow-y-auto`}>
      <div className="flex justify-between items-center mb-4"><span className="font-display text-lg">Shadow Assistant</span><button className="lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
      <nav aria-label="Main" className="space-y-1">{NAV.map(([p, l]) => <Link key={p} to={`/${p}`} className={`block rounded-lg px-3 py-2 text-sm ${p === page ? "bg-card text-ink" : "text-mute hover:text-ink"}`}>{l}</Link>)}</nav>
      <button className="btn mt-6 w-full" onClick={() => { sessionStorage.removeItem("sa-demo"); nav("/"); }}>Sign out</button>
    </aside>
    <main className="p-4 lg:p-8 min-w-0"><div className="flex items-center gap-3 mb-4"><button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button><h1 className="font-display text-2xl">{title}</h1></div>{body}</main></div>);
}
