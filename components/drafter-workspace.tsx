"use client";

import { useCallback, useMemo, useState } from "react";
import { DEMO_FORM } from "@/lib/demo-defaults";
import type {
  ConsistencyFlag,
  PriorUpdateDoc,
  UpdateFormData,
} from "@/lib/types";
import { readUserUpdates } from "@/lib/user-updates";
import { UpdateForm } from "./update-form";
import { GeneratedUpdate } from "./generated-update";
import {
  ConsistencyFlags,
  type FlagStatus,
} from "./consistency-flags";

type Props = {
  seedUpdates: PriorUpdateDoc[];
};

export function DrafterWorkspace({ seedUpdates }: Props) {
  const [form, setForm] = useState<UpdateFormData>(DEMO_FORM);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [rateLimited, setRateLimited] = useState<string | null>(null);
  const [flagStatus, setFlagStatus] = useState<FlagStatus>({ kind: "idle" });

  const priorUpdatesForEval = useMemo<PriorUpdateDoc[]>(() => {
    const user = readUserUpdates();
    const merged = new Map<string, PriorUpdateDoc>();
    for (const u of seedUpdates) merged.set(u.month, u);
    for (const u of user) merged.set(u.month, u);
    return Array.from(merged.values());
  }, [seedUpdates]);

  const runEvaluation = useCallback(
    async (finalDraft: string) => {
      setFlagStatus({ kind: "loading" });
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            draft: finalDraft,
            priorUpdates: priorUpdatesForEval,
            currentMonth: form.month,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setFlagStatus({
            kind: "error",
            message:
              body?.error === "rate_limited"
                ? "Daily evaluation limit reached. Try again tomorrow."
                : (body?.message ?? `HTTP ${res.status}`),
          });
          return;
        }
        const json = (await res.json()) as { flags: ConsistencyFlag[] };
        setFlagStatus({ kind: "ready", flags: json.flags });
      } catch (err) {
        setFlagStatus({
          kind: "error",
          message: err instanceof Error ? err.message : "Network error",
        });
      }
    },
    [form.month, priorUpdatesForEval],
  );

  const onGenerate = useCallback(async () => {
    setStreaming(true);
    setDraft("");
    setFlagStatus({ kind: "idle" });
    setRateLimited(null);
    try {
      const res = await fetch("/api/generate-update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ form }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setRateLimited(
            body?.message ??
              "Daily generation limit reached. Resets in 24 hours.",
          );
        } else {
          setDraft(
            `> **Generation failed.** ${
              body?.message ?? `HTTP ${res.status}`
            }`,
          );
        }
        setStreaming(false);
        return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          acc += chunk;
          setDraft(acc);
        }
      }
      setStreaming(false);
      if (acc.trim().length > 0) {
        await runEvaluation(acc);
      }
    } catch (err) {
      setStreaming(false);
      setDraft(
        `> **Generation failed.** ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      );
    }
  }, [form, runEvaluation]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div>
        <UpdateForm
          form={form}
          onChange={setForm}
          onGenerate={onGenerate}
          generating={streaming}
        />
      </div>
      <div className="space-y-5 lg:sticky lg:top-[72px] lg:self-start">
        {rateLimited ? (
          <div className="rounded-2xl border border-flag-border bg-flag-bg px-4 py-3 text-[13px] text-flag-ink">
            {rateLimited}
          </div>
        ) : null}
        <GeneratedUpdate
          month={form.month}
          text={draft}
          streaming={streaming}
        />
        <ConsistencyFlags
          status={flagStatus}
          onRetry={() => {
            if (draft.trim().length > 0) runEvaluation(draft);
          }}
        />
      </div>
    </div>
  );
}
