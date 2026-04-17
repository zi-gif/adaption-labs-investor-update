"use client";

import type { PriorUpdateDoc } from "./types";

const KEY = "adaption-spl:user-updates";

export function readUserUpdates(): PriorUpdateDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is PriorUpdateDoc =>
        typeof u?.month === "string" &&
        typeof u?.sender === "string" &&
        typeof u?.body === "string",
    );
  } catch {
    return [];
  }
}

export function writeUserUpdates(updates: PriorUpdateDoc[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(updates));
}

export function addUserUpdate(u: Omit<PriorUpdateDoc, "source">) {
  const existing = readUserUpdates();
  writeUserUpdates([
    ...existing.filter((x) => x.month !== u.month),
    { ...u, source: "user" },
  ]);
}

export function removeUserUpdate(month: string) {
  const existing = readUserUpdates();
  writeUserUpdates(existing.filter((u) => u.month !== month));
}
