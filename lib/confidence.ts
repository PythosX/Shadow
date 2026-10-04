export type Confidence = "HIGH_CONFIDENCE" | "MEDIUM_CONFIDENCE" | "LOW_CONFIDENCE" | "UNKNOWN";
export function classify(topScore: number, modelSays?: string): Confidence {
  if (modelSays === "UNKNOWN" || topScore === 0) return "UNKNOWN";
  if (modelSays === "LOW" || topScore < 3) return "LOW_CONFIDENCE";
  if (modelSays === "MEDIUM" || topScore < 6) return "MEDIUM_CONFIDENCE";
  return "HIGH_CONFIDENCE";
}
export const needsReview = (c: Confidence) => c === "LOW_CONFIDENCE" || c === "UNKNOWN";
export const BUSINESS = /\b(hire|pricing|price|quote|sponsor|sponsorship|collaborat\w*|custom|budget|invoice)\b/i;
