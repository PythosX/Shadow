export type Health = { ok: boolean; telegramBotA: boolean; telegramBotB: boolean; gemini: boolean };
export async function getHealth(): Promise<Health | null> {
  try { const r = await fetch("/api/health"); if (!r.ok) return null; return await r.json(); } catch { return null; }
}
export type Answer = { intent: string; confidence: string; topics: string[]; relevantSections: string[]; answer: string; resources: { label: string; url: string }[]; requiresReview: boolean; source: string };
export async function ask(question: string, history: { role: string; text: string }[] = []): Promise<Answer | { error: string }> {
  try {
    const r = await fetch("/api/ai/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, history }) });
    return await r.json();
  } catch { return { error: "Backend not reachable. Run with `vercel dev` or deploy to Vercel." }; }
}
export const isAuthed = () => sessionStorage.getItem("sa-demo") === "1";
