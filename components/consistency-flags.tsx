"use client";

import clsx from "clsx";
import type { ConsistencyFlag } from "@/lib/types";
import { Card, GhostButton, SectionHeading } from "./ui";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; flags: ConsistencyFlag[] }
  | { kind: "error"; message: string };

type Props = {
  status: Status;
  onRetry: () => void;
};

const DRIFT_LABEL: Record<string, string> = {
  silence: "Silence",
  contradiction: "Contradiction",
  "softened language": "Softened",
  "thread resolved": "Resolved",
  "positive overshoot": "Positive overshoot",
};

const PRIORITY_TONE: Record<string, string> = {
  high: "bg-accent-wash text-accent-deep border-accent/40",
  medium: "bg-flag-bg text-flag-ink border-flag-border",
  low: "bg-line-soft/50 text-ink-soft border-line",
};

const DRIFT_TONE: Record<string, string> = {
  "thread resolved": "bg-positive-bg text-positive-ink",
  "positive overshoot": "bg-positive-bg text-positive-ink",
};

export function ConsistencyFlags({ status, onRetry }: Props) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Consistency engine"
          title="What investors will notice"
          description="Drift across prior months (silence, contradiction, resolved threads). The eval pass runs after the draft and is read-only."
        />
      </div>

      {status.kind === "idle" ? (
        <p className="text-[13px] text-ink-faint">
          Generate an update to run the consistency engine.
        </p>
      ) : null}

      {status.kind === "loading" ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-line-soft/70"
            />
          ))}
        </div>
      ) : null}

      {status.kind === "error" ? (
        <div className="rounded-xl border border-line bg-line-soft/40 p-4">
          <p className="text-[13px] font-medium text-ink">
            Flags unavailable.
          </p>
          <p className="mt-1 max-w-[46ch] text-[12.5px] text-ink-soft">
            The evaluation pass couldn't be parsed. Your draft is intact. You
            can retry the eval without regenerating the draft.
            <span className="block pt-1 text-ink-faint">
              Reason: {status.message}
            </span>
          </p>
          <div className="mt-3">
            <GhostButton type="button" onClick={onRetry}>
              Retry evaluation
            </GhostButton>
          </div>
        </div>
      ) : null}

      {status.kind === "ready" ? (
        status.flags.length === 0 ? (
          <div className="rounded-xl border border-line bg-positive-bg/60 p-4">
            <p className="text-[13px] font-medium text-positive-ink">
              No drift detected.
            </p>
            <p className="mt-1 text-[12.5px] text-ink-soft">
              The draft is consistent with every thread in prior updates. Rare,
              worth sanity-checking against the prior-updates tab before
              sending.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {status.flags.map((f, i) => (
              <li
                key={i}
                className={clsx(
                  "rounded-xl border p-4",
                  DRIFT_TONE[f.drift_type] ??
                    "border-line/80 bg-line-soft/30",
                )}
              >
                <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.06em]">
                  <span
                    className={clsx(
                      "rounded-full border px-2 py-0.5 font-medium",
                      PRIORITY_TONE[f.priority] ?? PRIORITY_TONE.low,
                    )}
                  >
                    {f.priority}
                  </span>
                  <span className="rounded-full bg-surface/80 px-2 py-0.5 text-ink-soft">
                    {DRIFT_LABEL[f.drift_type] ?? f.drift_type}
                  </span>
                  <span className="text-ink-faint">{f.source_month}</span>
                </div>
                <blockquote className="mb-2 border-l-2 border-accent-soft/70 pl-3 text-[13px] italic text-ink-soft">
                  {f.excerpt}
                </blockquote>
                <p className="text-[13.5px] leading-relaxed text-ink">
                  {f.suggested_addition}
                </p>
                {f.relevant_investors.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {f.relevant_investors.map((inv) => (
                      <span
                        key={inv}
                        className="rounded-full bg-teal-wash/80 px-2 py-0.5 text-[11px] text-teal"
                      >
                        {inv}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )
      ) : null}
    </Card>
  );
}

export type { Status as FlagStatus };
