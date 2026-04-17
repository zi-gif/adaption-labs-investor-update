import { NextRequest } from "next/server";
import { getAnthropic, EVAL_MODEL } from "@/lib/anthropic";
import {
  buildEvaluationSystemPrompt,
  buildEvaluationUserPrompt,
} from "@/lib/prompts";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type {
  ConsistencyFlag,
  EvaluationResult,
  PriorUpdateDoc,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeParseJson(raw: string): EvaluationResult | null {
  const trimmed = raw.trim();
  // Strip accidental code fences
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(unfenced);
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { flags?: unknown }).flags)
    ) {
      const flags: ConsistencyFlag[] = (
        parsed as { flags: ConsistencyFlag[] }
      ).flags
        .filter(
          (f) =>
            typeof f.excerpt === "string" &&
            typeof f.source_month === "string" &&
            typeof f.drift_type === "string" &&
            typeof f.priority === "string" &&
            typeof f.suggested_addition === "string",
        )
        .map((f) => ({
          excerpt: f.excerpt,
          source_month: f.source_month,
          drift_type: f.drift_type,
          priority: f.priority,
          suggested_addition: f.suggested_addition,
          relevant_investors: Array.isArray(f.relevant_investors)
            ? f.relevant_investors
            : [],
        }));
      return { flags };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit(`eval:${ip}`);
  if (!rl.success) {
    return Response.json(
      {
        error: "rate_limited",
        message:
          "Daily evaluation limit reached. Resets in 24 hours.",
        reset: rl.reset,
      },
      { status: 429 },
    );
  }

  let body: {
    draft: string;
    priorUpdates: PriorUpdateDoc[];
    currentMonth: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const system = buildEvaluationSystemPrompt();
  const user = buildEvaluationUserPrompt(
    body.priorUpdates,
    body.draft,
    body.currentMonth,
  );

  try {
    const anthropic = getAnthropic();
    const resp = await anthropic.messages.create({
      model: EVAL_MODEL,
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: user }],
    });
    const textBlock = resp.content.find((c) => c.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const parsed = safeParseJson(raw);
    if (!parsed) {
      return Response.json(
        { error: "parse_failed", raw },
        { status: 502 },
      );
    }
    return Response.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: "upstream", message }, { status: 502 });
  }
}
