export type TelegramBot = "A" | "B";
const e = (k: string) => (process.env[k] || "").trim();
export const env = {
  geminiKey: () => e("GEMINI_API_KEY"),
  geminiModel: () => e("GEMINI_MODEL") || "gemini-2.5-flash-lite",
  botToken: (b: TelegramBot) => e(b === "A" ? "TELEGRAM_BOT_A_TOKEN" : "TELEGRAM_BOT_B_TOKEN"),
  botSecret: (b: TelegramBot) => e(b === "A" ? "TELEGRAM_BOT_A_WEBHOOK_SECRET" : "TELEGRAM_BOT_B_WEBHOOK_SECRET"),
  setupSecret: () => e("SETUP_SECRET"),
  baseUrl: () => e("PUBLIC_BASE_URL").replace(/\/$/, ""),
  ownerChatId: () => e("TELEGRAM_OWNER_CHAT_ID"),
};
