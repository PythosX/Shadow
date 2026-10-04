import type { VercelRequest, VercelResponse } from "@vercel/node";
import { answerQuestion } from "../../lib/ai";
import { json, rateLimited, SAFE_ERROR } from "../../lib/utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const question = String(req.body?.question || "").trim().slice(0, 600);
  if (!question) return json(res, 400, { error: "Empty question" });
  const ip = String(req.headers["x-forwarded-for"] || "web").split(",")[0];
  if (rateLimited(`web:${ip}`)) return json(res, 429, { error: "Too many requests. Please wait a minute." });
  try { json(res, 200, await answerQuestion(question, req.body?.history || [])); }
  catch (e) { console.error("answer failed", e); json(res, 500, { error: SAFE_ERROR }); }
}
