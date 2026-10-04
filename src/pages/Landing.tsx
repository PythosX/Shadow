import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ShieldCheck, Sparkles } from "lucide-react";

const steps = ["Understanding question…", "Intent: PROJECT_INFORMATION", "Relevant knowledge found: 3 projects", "Answer ready"];
const answer = "He's built Shadow Assistant (React, TypeScript, Gemini, Telegram) and an animated restaurant website. Want links to either?";

function AiShowcase() {
  const [n, setN] = useState(0);
  useEffect(() => { const t = setInterval(() => setN((x) => (x + 1) % (steps.length + 3)), 1300); return () => clearInterval(t); }, []);
  return (
    <div className="card space-y-3" aria-live="polite">
      <p className="muted">Sample conversation (preview, not live)</p>
      <div className="bubble bg-bg2 border border-line ml-auto">What projects has the creator built using AI?</div>
      <ul className="space-y-1">{steps.slice(0, Math.min(n, steps.length)).map((s, i) => <li key={s} className={`text-sm ${i === steps.length - 1 ? "text-cyan" : "text-mute"}`}>{s}</li>)}</ul>
      {n >= steps.length && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bubble bg-violet/20 border border-violet/40">{answer}</motion.div>}
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <header className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <span className="font-display text-xl">Shadow Assistant</span>
        <Link to="/login" className="btn">Sign in</Link>
      </header>
      <main className="max-w-5xl mx-auto px-4 pb-20 space-y-24">
        <section className="pt-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">Your audience is growing. Your inbox shouldn't slow you down.</h1>
            <p className="muted mt-4 text-base max-w-prose">Meet Shadow Assistant — the AI-powered workspace that helps creators manage messages, understand questions, automate routine replies and share resources without repeating themselves.</p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link to="/login" className="btn btn-primary">Explore the demo</Link>
              <a href="#how" className="btn">See how it works</a>
            </div>
          </div>
          <AiShowcase />
        </section>
        <section id="how" className="space-y-6">
          <h2 className="font-display text-3xl">It understands the question, not just the keyword.</h2>
          <p className="muted max-w-prose">Exact keywords like GUIDE answer instantly. Everything else is analysed for intent, matched against your creator knowledge, and answered by Gemini without inventing facts.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {["Question", "Intent + retrieval", "Verified answer"].map((t, i) => <div key={t} className="card"><Sparkles className="text-cyan mb-2" size={18} /><b>{t}</b><p className="muted mt-1">{["A follower asks in plain language.", "Relevant sections of your profile are found and ranked.", "Gemini replies from that context only, or says it doesn't know."][i]}</p></div>)}
          </div>
        </section>
        <section className="space-y-6">
          <h2 className="font-display text-3xl">Two bots. One creator intelligence.</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card"><Bot className="text-cyan mb-2" /><h3 className="font-semibold">Bot A · Public assistant</h3><p className="muted mt-1">Answers audience questions from verified creator knowledge, hands out resources and remembers the conversation.</p></div>
            <div className="card"><ShieldCheck className="text-violet mb-2" /><h3 className="font-semibold">Bot B · Owner console</h3><p className="muted mt-1">Sends you the questions that need a human, with a suggested answer and Approve, Reply and Ignore buttons.</p></div>
          </div>
        </section>
      </main>
    </div>
  );
}
