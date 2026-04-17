import { NextRequest } from "next/server";
import { getAnthropic, DRAFT_MODEL } from "@/lib/anthropic";
import {
  buildDraftSystemPrompt,
  buildDraftUserPrompt,
} from "@/lib/prompts";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { UpdateFormData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit(`gen:${ip}`);
  if (!rl.success) {
    return Response.json(
      {
        error: "rate_limited",
        message:
          "Daily generation limit reached. Resets in 24 hours. This is a demo tool, so the cap is intentionally low.",
        reset: rl.reset,
      },
      { status: 429 },
    );
  }

  let body: { form: UpdateFormData };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const system = buildDraftSystemPrompt();
  const user = buildDraftUserPrompt(body.form);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropic = getAnthropic();
        const resp = await anthropic.messages.stream({
          model: DRAFT_MODEL,
          max_tokens: 1500,
          system,
          messages: [{ role: "user", content: user }],
        });
        for await (const event of resp) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        controller.enqueue(
          encoder.encode(`\n\n[generation error: ${message}]`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(rl.remaining),
      "X-RateLimit-Backend": rl.backend,
    },
  });
}
