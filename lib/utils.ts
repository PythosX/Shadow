import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "./env";

export const STOP = new Set("a an the is are was were be to of in on for and or with about what which who how can could does do did his her him he she it its me my you your tell send give show please any all i we they them this that there from at by as".split(" "));
export const tokens = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9+#.\s]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

export function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}
export function requireSetup(req: VercelRequest, res: VercelResponse): boolean {
  const s = env.setupSecret();
  const given = (req.headers["x-setup-secret"] as string) || (req.query.secret as string) || "";
  if (!s || given !== s) { json(res, 401, { ok: false, error: "Unauthorized" }); return false; }
  return true;
}
export const SAFE_ERROR = "I'm having trouble answering that right now. Please try again shortly.";

// Lightweight in-memory rate limiter (per instance; swap for Redis/Upstash in production).
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length > max;
}
