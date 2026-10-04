import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../../lib/env";
import { setTelegramWebhook } from "../../lib/telegram";
import { json, requireSetup } from "../../lib/utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireSetup(req, res)) return;
  if (!env.botToken("A")) return json(res, 400, { ok: false, error: "Bot A token not configured" });
  try { json(res, 200, { ok: true, result: await setTelegramWebhook("A") }); }
  catch (e) { console.error(e); json(res, 502, { ok: false, error: "Telegram request failed" }); }
}
