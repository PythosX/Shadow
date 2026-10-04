import { env, TelegramBot } from "./env";
async function call(bot: TelegramBot, method: string, body?: object) {
  const token = env.botToken(bot);
  if (!token) throw new Error(`Bot ${bot} token missing`);
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  const data = await r.json();
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}
export const sendTelegramMessage = (bot: TelegramBot, chatId: number | string, text: string, extra: object = {}) =>
  call(bot, "sendMessage", { chat_id: chatId, text, disable_web_page_preview: false, ...extra });
export const answerCallback = (bot: TelegramBot, id: string, text?: string) => call(bot, "answerCallbackQuery", { callback_query_id: id, text });
export const setTelegramWebhook = (bot: TelegramBot) =>
  call(bot, "setWebhook", { url: `${env.baseUrl()}/api/telegram/bot-${bot.toLowerCase()}-webhook`, secret_token: env.botSecret(bot), allowed_updates: ["message", "callback_query"] });
export const deleteTelegramWebhook = (bot: TelegramBot) => call(bot, "deleteWebhook", { drop_pending_updates: true });
export const getTelegramWebhookInfo = (bot: TelegramBot) => call(bot, "getWebhookInfo");
export const getTelegramBotInfo = (bot: TelegramBot) => call(bot, "getMe");
export async function verifyBot(bot: TelegramBot) { try { await getTelegramBotInfo(bot); return true; } catch { return false; } }
