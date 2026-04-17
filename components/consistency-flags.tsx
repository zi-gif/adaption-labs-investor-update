"use client";

import clsx from "clsx";
import type { ConsistencyFlag } from "@/lib/types";
import { GhostButton, Panel } from "./ui";

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
  "positive overshoot": "Overshoot",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-ember",
  medium: "bg-gold",
  low: "bg-ink-4",
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "high priority",
  medium: "medium",
  low: "low",
};

const DRIFT_TONE: Record<string, string> = {
  "thread resolved": "border-gold/50 bg-gold-wash/40",
  "positive overshoot": "border-teal-soft/60 bg-teal-wash/40",
  silence: "border-ember/30 bg-ember-wash/30",
  contradiction: "border-claret/40 bg-claret-wash/30",
  "softened language": "border-rule bg-paper/60",
};

export function ConsistencyFlags({ status, onRetry }: Props) {
  const aside =
    status.kind === "ready"
      ? `${status.flags.length} flag${status.flags.length === 1 ? "" : "s"}`
      : status.kind === "loading"
        ? "reading…"
        : undefined;

  return (
    <Panel label="Consistency engine" aside={aside}>
      <div className="mb-5 border-b border-rule pb-4">
        <div
          className="display text-[22px] leading-tight text-ink"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          What an investor will{" "}
          <span
            className="display-italic text-ember-deep"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            notice.
          </span>
        </div>
        <p className="mt-2 max-w-[52ch] text-[12.5px] leading-relaxed text-ink-3">
          A second read-only pass over the draft and every prior month.
          Priority is weighted by the lead investor's thesis.
        </p>
      </div>

      {status.kind === "idle" ? (
        <p className="text-[13px] text-ink-4">
          Generate an update to run the consistency engine.
        </p>
      ) : null}

      {status.kind === "loading" ? (
        <ul className="space-y-3">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="border border-rule bg-paper/40 px-4 py-4"
              style={{ animation: `reveal 800ms ease-out ${i * 120}ms both` }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-4 pulse-dot" />
                <div className="h-2.5 w-24 bg-rule-soft" />
              </div>
              <div className="mb-2 h-3 w-3/4 bg-rule-soft" />
              <div className="h-3 w-1/2 bg-rule-soft" />
            </li>
          ))}
        </ul>
      ) : null}

      {status.kind === "error" ? (
        <div className="border border-claret/30 bg-claret-wash/30 p-5">
          <div className="smallcaps mb-1 text-claret">
            Flags unavailable
          </div>
          <p className="max-w-[48ch] text-[13px] leading-relaxed text-ink-2">
            The evaluation pass couldn't be parsed. The draft is intact, and
            you can retry the eval without regenerating.
          </p>
          <p className="mt-2 text-[11.5px] text-ink-4">
            Reason, {status.message}
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
          <div className="border border-teal-soft/60 bg-teal-wash/40 p-5">
            <div className="smallcaps mb-1 text-teal">
              No drift detected
            </div>
            <p className="max-w-[48ch] text-[13px] leading-relaxed text-ink-2">
              The draft is consistent with every thread in prior updates.
              Worth a quick sanity pass against the prior-issues tab before
              sending.
            </p>
          </div>
        ) : (
          <ol className="space-y-3">
            {status.flags.map((f, i) => (
              <li
                key={i}
                className={clsx(
                  "reveal border p-5",
                  DRIFT_TONE[f.drift_type] ?? "border-rule bg-paper/50",
                )}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {/* Head: priority dot, drift pill, source */}
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="mono tabular text-ink-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={clsx(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      PRIORITY_DOT[f.priority] ?? PRIORITY_DOT.low,
                    )}
                    aria-label={PRIORITY_LABEL[f.priority] ?? ""}
                    title={PRIORITY_LABEL[f.priority] ?? ""}
                  />
                  <span className="smallcaps !text-[10px] text-ink-2">
                    {DRIFT_LABEL[f.drift_type] ?? f.drift_type}
                  </span>
                  <span className="h-px flex-1 bg-rule/60" />
                  <span className="mono tabular text-[10.5px] uppercase text-ink-4">
                    {f.source_month}
                  </span>
                </div>

                {/* Excerpt with call-out quote */}
                <blockquote
                  className="display-italic mb-3 pl-3 text-[15px] leading-snug text-ink-2"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
                >
                  <span className="mr-1 text-ember-deep">“</span>
                  {f.excerpt}
                  <span className="ml-0.5 text-ember-deep">”</span>
                </blockquote>

                {/* Suggested addition */}
                <p className="text-[13.5px] leading-relaxed text-ink">
                  <span className="smallcaps mr-2 !text-[9.5px] text-ember-deep">
                    Suggested
                  </span>
                  {f.suggested_addition}
                </p>

                {f.relevant_investors.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {f.relevant_investors.map((inv) => (
                      <span
                        key={inv}
                        className="border border-teal/30 bg-teal-wash/60 px-2 py-0.5 text-[10.5px] text-teal"
                      >
                        {inv}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        )
      ) : null}
    </Panel>
  );
}

export type { Status as FlagStatus };
