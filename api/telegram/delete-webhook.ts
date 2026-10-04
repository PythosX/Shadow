import type { VercelRequest, VercelResponse } from "@vercel/node";
import { deleteTelegramWebhook } from "../../lib/telegram";
import { json, requireSetup } from "../../lib/utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireSetup(req, res)) return;
  const bot = String(req.query.bot || "A").toUpperCase() === "B" ? "B" : "A";
  try { json(res, 200, { ok: true, result: await deleteTelegramWebhook(bot) }); }
  catch (e) { console.error(e); json(res, 502, { ok: false, error: "Telegram request failed" }); }
}
