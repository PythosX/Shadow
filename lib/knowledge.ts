import fs from "fs";
import path from "path";
import { tokens } from "./utils";

export type Section = { id: string; group: string; title: string; body: string };
let cache: { sections: Section[]; raw: string; mtime: number } | null = null;

export function loadCreatorKnowledge() {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), "knowledge", "creator.md"), "utf8");
  const sections: Section[] = [];
  let group = "", cur: Section | null = null;
  for (const line of raw.split("\n")) {
    const h2 = line.match(/^## (.+)/), h3 = line.match(/^### (.+)/);
    if (h2) { group = h2[1].trim(); cur = { id: `${sections.length}`, group, title: group, body: "" }; sections.push(cur); }
    else if (h3) { cur = { id: `${sections.length}`, group, title: h3[1].trim(), body: "" }; sections.push(cur); }
    else if (cur) cur.body += line + "\n";
  }
  cache = { sections: sections.filter((s) => s.body.trim()), raw, mtime: Date.now() };
  return cache;
}

const SYN: Record<string, string[]> = {
  projects: ["project", "built", "build", "made", "work", "website", "app", "portfolio"],
  skills: ["skill", "technology", "technologies", "tech", "stack", "language", "tools", "react", "typescript"],
  contact: ["contact", "email", "reach", "hire", "phone"],
  services: ["service", "offer", "hire", "pricing", "custom"],
  "social links": ["github", "linkedin", "instagram", "youtube", "social"],
  resources: ["resume", "cv", "portfolio", "link", "send"],
};

export function searchCreatorKnowledge(query: string, limit = 5) {
  const { sections } = loadCreatorKnowledge();
  const q = tokens(query);
  const scored = sections.map((s) => {
    const hay = tokens(s.title + " " + s.group + " " + s.body);
    const set = new Set(hay);
    let score = 0;
    for (const t of q) {
      if (set.has(t)) score += 2;
      else if (hay.some((h) => h.startsWith(t) || t.startsWith(h))) score += 1;
    }
    for (const [g, words] of Object.entries(SYN))
      if (s.group.toLowerCase() === g && q.some((t) => words.includes(t) || g.includes(t))) score += 3;
    if (q.some((t) => s.title.toLowerCase().includes(t))) score += 3;
    return { s, score };
  });
  return scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => ({ ...x.s, score: x.score }));
}
export const findRelevantSections = searchCreatorKnowledge;

export function findLinks(): { label: string; url: string }[] {
  const { raw } = loadCreatorKnowledge();
  const out: { label: string; url: string }[] = [];
  for (const m of raw.matchAll(/^([A-Za-z ]+):\s*(https?:\/\/\S+)/gm)) out.push({ label: m[1].trim(), url: m[2] });
  return out;
}
