import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../../lib/env";
import { answerCallback, sendTelegramMessage } from "../../lib/telegram";
import { getReview, recentChats, reviews, stats } from "../../lib/conversations";
import { loadCreatorKnowledge } from "../../lib/knowledge";
import { KEYWORD_RULES } from "../../lib/rules";

const HELP = `Shadow Assistant Owner Console

You're connected to the creator assistant.

Available commands:

/status
/inbox
/stats
/knowledge
/rules
/pending
/help

Reply to a user: /reply <review id> <message>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = env.botSecret("B");
  if (!secret || req.headers["x-telegram-bot-api-secret-token"] !== secret) return res.status(401).end();
  const body = req.body || {};
  const chat = body.message?.chat?.id ?? body.callback_query?.message?.chat?.id;
  if (!chat) return res.status(200).json({ ok: true });
  const send = (t: string, extra = {}) => sendTelegramMessage("B", chat, t, extra);
  try {
    const owner = env.ownerChatId();
    const text = String(body.message?.text || "").trim();
    if (text === "/start" && !owner) { await send(`Your chat id is ${chat}.\nSet TELEGRAM_OWNER_CHAT_ID to this value in Vercel, redeploy, then send /start again.`); return res.status(200).json({ ok: true }); }
    if (String(chat) !== owner) { await send("This console is private."); return res.status(200).json({ ok: true }); }

    if (body.callback_query) {
      const cq = body.callback_query; const [act, idS] = String(cq.data).split(":"); const r = getReview(Number(idS));
      if (!r) await answerCallback("B", cq.id, "Review expired (server restarted).");
      else if (act === "ok") { await sendTelegramMessage("A", r.chatId, r.suggested); r.status = "approved"; await answerCallback("B", cq.id, "Sent to user"); }
      else if (act === "ig") { r.status = "ignored"; await answerCallback("B", cq.id, "Ignored"); }
      else { await answerCallback("B", cq.id); await send(`Send your answer with:\n/reply ${r.id} <message>${act === "ed" ? `\n\nSuggested text to edit:\n${r.suggested}` : ""}`); }
      return res.status(200).json({ ok: true });
    }
    const cmd = text.split(/\s+/)[0].split("@")[0];
    if (cmd === "/start" || cmd === "/help") await send(HELP);
    else if (cmd === "/status") await send(`Bot A: ${env.botToken("A") ? "token set" : "not configured"}\nBot B: connected\nGemini: ${env.geminiKey() ? "key set" : "not configured"}\nUse /api/health for verified status.`);
    else if (cmd === "/stats") await send(`SHADOW ASSISTANT (live, since last server start)\n\nMessages: ${stats.messages}\nAI questions: ${stats.ai}\nKeyword/link matches: ${stats.keyword}\nHuman reviews: ${stats.reviews}\nAuto replies: ${stats.auto}\n\nCounters reset on cold start (in-memory).`);
    else if (cmd === "/inbox") { const c = recentChats(); await send(c.length ? c.map(([, v], i) => `${i + 1}. ${v.username}\n"${[...v.messages].reverse().find((m) => m.role === "user")?.text || ""}"`).join("\n\n") : "No conversations yet."); }
    else if (cmd === "/pending") { const p = reviews.filter((r) => r.status === "pending"); await send(p.length ? p.map((r) => `#${r.id} ${r.username}: ${r.question}\n(${r.reason})`).join("\n\n") : "Nothing pending."); }
    else if (cmd === "/knowledge") { const k = loadCreatorKnowledge(); await send(`Knowledge sections: ${k.sections.length}\n${[...new Set(k.sections.map((s) => s.group))].join(", ")}\n\nEdit knowledge/creator.md and redeploy.`); }
    else if (cmd === "/rules") await send(KEYWORD_RULES.map((r) => `${r.enabled ? "●" : "○"} ${r.keyword} (${r.matchType})`).join("\n"));
    else if (cmd === "/reply") {
      const m = text.match(/^\/reply\s+(\d+)\s+([\s\S]+)/); const r = m && getReview(Number(m[1]));
      if (!r) await send("Usage: /reply <review id> <message> (review must still be in memory)");
      else { await sendTelegramMessage("A", r.chatId, m![2]); r.status = "replied"; await send("Sent."); }
    } else await send("Unknown command. Send /help.");
  } catch (e) { console.error("bot B error", e); }
  res.status(200).json({ ok: true });
}
