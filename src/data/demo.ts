// All values here are DEMO / sample data and are labelled as such in the UI.
export const demoConversations = [
  { id: 1, user: "@user123", channel: "Demo", question: "What projects has the creator built?", status: "Auto-replied", important: false },
  { id: 2, user: "@user456", channel: "Demo", question: "Can I get his portfolio?", status: "Auto-replied", important: false },
  { id: 3, user: "@brandxyz", channel: "Demo", question: "Can I hire the creator for a custom website?", status: "Awaiting review", important: true },
  { id: 4, user: "@devfan", channel: "Demo", question: "Which project uses Telegram and AI?", status: "Auto-replied", important: false },
];
export const demoAutoReplies = [
  { name: "Portfolio request", pattern: "portfolio, website", response: "Here's the portfolio link from the creator profile.", review: false, enabled: true },
  { name: "Contact request", pattern: "contact, email, reach", response: "You can reach the creator at the contact address in the profile.", review: false, enabled: true },
  { name: "Business inquiry", pattern: "hire, pricing, sponsorship", response: "Thanks! The creator will review this personally.", review: true, enabled: true },
];
export const demoKeywords = [
  { keyword: "GUIDE", matchType: "CASE_INSENSITIVE", platform: "Telegram", url: "https://example.com/guide", enabled: true, triggers: 12 },
  { keyword: "TEMPLATE", matchType: "CASE_INSENSITIVE", platform: "Telegram", url: "https://example.com/template", enabled: true, triggers: 7 },
  { keyword: "COURSE", matchType: "EXACT", platform: "Telegram", url: "https://example.com/course", enabled: false, triggers: 0 },
  { keyword: "NOTES", matchType: "CASE_INSENSITIVE", platform: "Telegram", url: "https://example.com/notes", enabled: true, triggers: 3 },
];
export const demoKnowledge = ["Profile", "Projects", "Skills", "Services", "Links", "FAQs", "Resources"];
