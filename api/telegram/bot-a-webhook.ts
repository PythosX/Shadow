import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../../lib/env";
import { sendTelegramMessage } from "../../lib/telegram";
import { answerQuestion } from "../../lib/ai";
import { matchKeyword, matchLinkRequest } from "../../lib/rules";
import { addReview, getHistory, remember, stats } from "../../lib/conversations";
import { rateLimited, SAFE_ERROR } from "../../lib/utils";

const START = `👋 Hi! I'm Shadow Assistant.

I can answer questions about the creator, projects, skills, services and available resources.

Try asking:

• What projects has the creator built?
• What technologies does he use?
• Can I see his portfolio?
• How can I contact him?`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = env.botSecret("A");
  if (!secret || req.headers["x-telegram-bot-api-secret-token"] !== secret) return res.status(401).end();
  const msg = req.body?.message;
  if (!msg?.chat?.id) return res.status(200).json({ ok: true }); // invalid/unsupported update
  const chatId: number = msg.chat.id;
  const text = String(msg.text || "").trim().slice(0, 600);
  const username = msg.from?.username ? `@${msg.from.username}` : msg.from?.first_name || "unknown";
  try {
    if (!text) { await sendTelegramMessage("A", chatId, "Please send your question as text."); return res.status(200).json({ ok: true }); }
    if (text === "/start") { await sendTelegramMessage("A", chatId, START); return res.status(200).json({ ok: true }); }
    stats.messages++;
    if (rateLimited(`tg:${chatId}`)) { await sendTelegramMessage("A", chatId, "You're sending messages quickly. Please wait a minute and try again."); return res.status(200).json({ ok: true }); }
    const history = getHistory(chatId);
    remember(chatId, msg.from?.id || 0, username, "user", text);

    // Layer 1: fast path
    const fast = matchKeyword(text) || matchLinkRequest(text);
    if (fast) { stats.keyword++; stats.auto++; remember(chatId, 0, username, "assistant", fast); await sendTelegramMessage("A", chatId, fast); return res.status(200).json({ ok: true }); }

    // Layers 2+3: intent → retrieval → Gemini
    stats.ai++;
    const a = await answerQuestion(text, history);
    let reply = a.answer;
    if (a.resources.length && !reply.includes("http")) reply += "\n\n" + a.resources.slice(0, 3).map((r) => `${r.label}: ${r.url}`).join("\n");
    if (a.requiresReview && a.confidence !== "UNKNOWN") reply += "\n\nI've also passed this to the creator for a personal follow-up.";
    if (!a.requiresReview) stats.auto++;
    remember(chatId, 0, username, "assistant", reply);
    await sendTelegramMessage("A", chatId, reply);

    if (a.requiresReview && env.ownerChatId() && env.botToken("B")) {
      const r = addReview({ chatId, username, question: text, reason: a.reason || a.confidence, suggested: a.answer, confidence: a.confidence });
      await sendTelegramMessage("B", env.ownerChatId(), `⚠️ HUMAN REVIEW #${r.id}\n\nUser: ${username}\nQuestion: ${text}\n\nReason: ${r.reason}\nConfidence: ${a.confidence.replace("_CONFIDENCE", "")}\n\nSuggested answer:\n${a.answer.slice(0, 900)}`, {
        reply_markup: { inline_keyboard: [[{ text: "Approve", callback_data: `ok:${r.id}` }, { text: "Ignore", callback_data: `ig:${r.id}` }], [{ text: "Reply", callback_data: `rp:${r.id}` }, { text: "Edit", callback_data: `ed:${r.id}` }]] },
      });
    }
  } catch (e) {
    console.error("bot A error", e);
    try { await sendTelegramMessage("A", chatId, SAFE_ERROR); } catch {}
  }
  res.status(200).json({ ok: true });
}
