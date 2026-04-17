import Anthropic from "@anthropic-ai/sdk";

export const DRAFT_MODEL = "claude-sonnet-4-6";
export const EVAL_MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local for local dev or to Vercel env for deployment.",
    );
  }
  client = new Anthropic({ apiKey });
  return client;
}
