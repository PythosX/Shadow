import { tokens } from "./utils";
export type Intent = "PROJECT_INFORMATION" | "SKILLS" | "EXPERIENCE" | "EDUCATION" | "SERVICES" | "CONTACT" | "PORTFOLIO" | "SOCIAL_LINK" | "RESOURCE_REQUEST" | "GENERAL_CREATOR_INFORMATION" | "UNKNOWN";

const RULES: [Intent, string[]][] = [
  ["SOCIAL_LINK", ["github", "linkedin", "instagram", "youtube"]],
  ["PORTFOLIO", ["portfolio", "website", "site"]],
  ["RESOURCE_REQUEST", ["resume", "cv", "send", "link", "download"]],
  ["CONTACT", ["contact", "email", "reach", "hire", "collaborate", "collaboration"]],
  ["SERVICES", ["service", "services", "offer", "pricing", "price", "custom"]],
  ["EDUCATION", ["education", "degree", "college", "university", "study"]],
  ["EXPERIENCE", ["experience", "worked", "career", "job"]],
  ["SKILLS", ["skill", "skills", "technology", "technologies", "tech", "stack", "react", "typescript", "javascript"]],
  ["PROJECT_INFORMATION", ["project", "projects", "built", "build", "made", "app", "telegram", "ai"]],
  ["GENERAL_CREATOR_INFORMATION", ["who", "about", "bio", "creator"]],
];
export function detectIntent(q: string) {
  const t = tokens(q);
  const lower = q.toLowerCase();
  const scores = RULES.map(([i, w]) => [i, w.filter((x) => t.includes(x) || lower.includes(x)).length] as const);
  const best = [...scores].sort((a, b) => b[1] - a[1])[0];
  const intents = scores.filter((s) => s[1] > 0).map((s) => s[0]);
  return { intent: (best[1] > 0 ? best[0] : "UNKNOWN") as Intent, intents, topics: t.slice(0, 8) };
}
// Resolve "it", "that project" etc. using the last user turns.
export function resolveFollowUp(q: string, history: { role: string; text: string }[]) {
  if (!/\b(it|its|that|this|they|there|the same|more)\b/i.test(q) || tokens(q).length > 7) return q;
  const prev = [...history].reverse().find((m) => m.role === "user");
  return prev ? `${prev.text} ${q}` : q;
}
