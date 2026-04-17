import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const DAILY_GENERATION_LIMIT = 10;

let upstash: Ratelimit | null = null;
function getUpstash(): Ratelimit | null {
  if (upstash) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  upstash = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(DAILY_GENERATION_LIMIT, "1 d"),
    prefix: "aliu:rl",
    analytics: false,
  });
  return upstash;
}

type Bucket = { count: number; resetAt: number };
const memory = new Map<string, Bucket>();
const DAY_MS = 24 * 60 * 60 * 1000;

function memoryLimit(key: string): {
  success: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const existing = memory.get(key);
  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + DAY_MS };
    memory.set(key, bucket);
    return {
      success: true,
      remaining: DAILY_GENERATION_LIMIT - 1,
      reset: bucket.resetAt,
    };
  }
  if (existing.count >= DAILY_GENERATION_LIMIT) {
    return { success: false, remaining: 0, reset: existing.resetAt };
  }
  existing.count += 1;
  return {
    success: true,
    remaining: DAILY_GENERATION_LIMIT - existing.count,
    reset: existing.resetAt,
  };
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  backend: "upstash" | "memory";
}> {
  const ups = getUpstash();
  if (ups) {
    const r = await ups.limit(identifier);
    return {
      success: r.success,
      remaining: r.remaining,
      reset: r.reset,
      backend: "upstash",
    };
  }
  const r = memoryLimit(identifier);
  return { ...r, backend: "memory" };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "anon";
}
