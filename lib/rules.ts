import { findLinks } from "./knowledge";
export type KeywordRule = { keyword: string; matchType: "EXACT" | "CASE_INSENSITIVE"; response: string; resourceUrl?: string; enabled: boolean };
// Edit these rules or load from a database later.
export const KEYWORD_RULES: KeywordRule[] = [
  { keyword: "GUIDE", matchType: "CASE_INSENSITIVE", response: "Here is the guide you requested:", resourceUrl: "https://example.com/guide", enabled: true },
  { keyword: "TEMPLATE", matchType: "CASE_INSENSITIVE", response: "Here is the template:", resourceUrl: "https://example.com/template", enabled: true },
  { keyword: "NOTES", matchType: "CASE_INSENSITIVE", response: "Here are the notes:", resourceUrl: "https://example.com/notes", enabled: true },
];
export function matchKeyword(text: string) {
  const t = text.trim();
  const rule = KEYWORD_RULES.find((r) => r.enabled && (r.matchType === "EXACT" ? t === r.keyword : t.toLowerCase() === r.keyword.toLowerCase()));
  return rule ? `${rule.response}${rule.resourceUrl ? "\n" + rule.resourceUrl : ""}` : null;
}
// Direct link requests (GitHub, LinkedIn, Portfolio, Resume) answered from verified links only.
export function matchLinkRequest(text: string) {
  const q = text.toLowerCase();
  const wanted = ["github", "linkedin", "portfolio", "resume", "instagram", "youtube"].filter((w) => q.includes(w));
  if (!wanted.length || q.split(/\s+/).length > 10) return null;
  const links = findLinks().filter((l) => wanted.some((w) => l.label.toLowerCase().includes(w)));
  return links.length ? links.map((l) => `${l.label}: ${l.url}`).join("\n") : null;
}
