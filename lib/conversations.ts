// In-memory store. Resets on cold start — replace with Supabase/Redis for persistence.
export type Msg = { role: "user" | "assistant"; text: string; at: number };
export type Review = { id: number; chatId: number; username: string; question: string; reason: string; suggested: string; confidence: string; status: "pending" | "approved" | "ignored" | "replied"; at: number };
const convos = new Map<number, { userId: number; username: string; messages: Msg[]; last: number }>();
export const reviews: Review[] = [];
export const stats = { messages: 0, ai: 0, keyword: 0, reviews: 0, auto: 0, since: Date.now() };
let rid = 1;

export function getHistory(chatId: number) { return convos.get(chatId)?.messages.slice(-8) || []; }
export function remember(chatId: number, userId: number, username: string, role: Msg["role"], text: string) {
  const c = convos.get(chatId) || { userId, username, messages: [], last: 0 };
  c.messages.push({ role, text, at: Date.now() }); c.messages = c.messages.slice(-20); c.last = Date.now();
  convos.set(chatId, c);
}
export function recentChats() { return [...convos.entries()].sort((a, b) => b[1].last - a[1].last).slice(0, 10); }
export function addReview(r: Omit<Review, "id" | "status" | "at">) { const rev: Review = { ...r, id: rid++, status: "pending", at: Date.now() }; reviews.push(rev); stats.reviews++; return rev; }
export const getReview = (id: number) => reviews.find((r) => r.id === id);
