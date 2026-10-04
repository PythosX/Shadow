import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../../lib/env";
import { getTelegramWebhookInfo } from "../../lib/telegram";
import { json, requireSetup } from "../../lib/utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireSetup(req, res)) return;
  if (!env.botToken("B")) return json(res, 400, { ok: false, error: "Bot B token not configured" });
  try { json(res, 200, { ok: true, result: await getTelegramWebhookInfo("B") }); }
  catch (e) { console.error(e); json(res, 502, { ok: false, error: "Telegram request failed" }); }
}
