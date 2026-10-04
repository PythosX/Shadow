import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../lib/env";
import { verifyBot } from "../lib/telegram";
import { json } from "../lib/utils";
import { GoogleGenAI } from "@google/genai";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const [a, b] = await Promise.all([env.botToken("A") ? verifyBot("A") : false, env.botToken("B") ? verifyBot("B") : false]);
  let gemini = false;
  if (env.geminiKey()) {
    try { await new GoogleGenAI({ apiKey: env.geminiKey() }).models.generateContent({ model: env.geminiModel(), contents: "ping", config: { maxOutputTokens: 5 } }); gemini = true; } catch { gemini = false; }
  }
  json(res, 200, { ok: true, telegramBotA: a, telegramBotB: b, gemini });
}
