import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadCreatorKnowledge, searchCreatorKnowledge } from "../../lib/knowledge";
import { json } from "../../lib/utils";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = String(req.query.q || "");
    const k = loadCreatorKnowledge();
    json(res, 200, { sections: k.sections.length, results: q ? searchCreatorKnowledge(q) : k.sections.map((s) => ({ group: s.group, title: s.title, body: s.body.trim() })) });
  } catch (e) { console.error(e); json(res, 500, { error: "Knowledge unavailable" }); }
}
