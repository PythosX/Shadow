import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../lib/env";
import { sendTelegramMessage } from "../lib/telegram";
import { json, rateLimited } from "../lib/utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "POST only" });
  const { name = "", email = "", message = "" } = req.body || {};
  if (!String(message).trim() || !/^\S+@\S+\.\S+$/.test(String(email))) return json(res, 400, { error: "Email and message are required." });
  if (rateLimited(`contact:${req.headers["x-forwarded-for"] || "x"}`, 3)) return json(res, 429, { error: "Too many requests." });
  const owner = env.ownerChatId();
  if (!owner || !env.botToken("B")) return json(res, 202, { delivered: false, note: "Saved nowhere: Bot B not configured." });
  try {
    await sendTelegramMessage("B", owner, `📩 Contact form\nFrom: ${String(name).slice(0, 80)} <${String(email).slice(0, 120)}>\n\n${String(message).slice(0, 1500)}`);
    json(res, 200, { delivered: true });
  } catch (e) { console.error(e); json(res, 502, { error: "Could not deliver your message." }); }
}
