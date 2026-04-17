"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import type { PriorUpdateDoc } from "@/lib/types";
import {
  addUserUpdate,
  readUserUpdates,
  removeUserUpdate,
} from "@/lib/user-updates";
import {
  FieldLabel,
  GhostButton,
  Panel,
  PrimaryButton,
  TextArea,
  TextInput,
} from "./ui";

type Props = {
  seed: (PriorUpdateDoc & { label?: string })[];
};

export function PriorUpdatesView({ seed }: Props) {
  const [user, setUser] = useState<PriorUpdateDoc[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    month: "",
    sender: "Sara Hooker",
    body: "",
  });
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  useEffect(() => {
    setUser(readUserUpdates());
  }, []);

  const all = useMemo(
    () => [
      ...seed.map((u) => ({ ...u, source: "seed" as const })),
      ...user,
    ],
    [seed, user],
  );

  useEffect(() => {
    if (all.length > 0 && !activeMonth) {
      setActiveMonth(all[0].month);
    }
  }, [all, activeMonth]);

  const active = all.find((u) => u.month === activeMonth) ?? all[0];

  const commit = () => {
    if (!draft.month.trim() || !draft.body.trim()) return;
    addUserUpdate({
      month: draft.month.trim(),
      sender: draft.sender.trim() || "Sara Hooker",
      body: draft.body.trim(),
    });
    setUser(readUserUpdates());
    setDraft({ month: "", sender: "Sara Hooker", body: "" });
    setAdding(false);
    setActiveMonth(draft.month.trim());
  };

  const remove = (month: string) => {
    removeUserUpdate(month);
    setUser(readUserUpdates());
    if (activeMonth === month) setActiveMonth(all[0]?.month ?? null);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
      {/* Table of contents */}
      <aside className="lg:sticky lg:top-[92px] lg:self-start">
        <div className="smallcaps mb-4 text-ember-deep">Contents</div>
        <ol className="space-y-1">
          {all.map((u, i) => {
            const active = activeMonth === u.month;
            return (
              <li key={`${u.source}-${u.month}`}>
                <button
                  type="button"
                  onClick={() => setActiveMonth(u.month)}
                  className={clsx(
                    "focus-ring group flex w-full items-baseline gap-3 border-b border-rule py-2 text-left transition-colors",
                    active
                      ? "text-ink"
                      : "text-ink-3 hover:text-ink",
                  )}
                >
                  <span className="mono tabular text-[11px] text-ink-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="display flex-1 text-[17px] leading-tight"
                    style={{
                      fontVariationSettings: '"opsz" 144, "SOFT" 40',
                    }}
                  >
                    {u.month}
                  </span>
                  {active ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-ember pulse-dot" />
                  ) : null}
                  {u.source === "user" ? (
                    <span className="smallcaps !text-[9.5px] text-teal">
                      You
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-5">
          <GhostButton type="button" onClick={() => setAdding((v) => !v)}>
            {adding ? "Cancel" : "+ Add a month"}
          </GhostButton>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 space-y-8">
        {adding ? (
          <Panel label="Local only" className="reveal">
            <div
              className="display mb-2 text-[26px] text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              Paste a prior month.
            </div>
            <p className="mb-5 max-w-[54ch] text-[13px] leading-relaxed text-ink-3">
              Stored in your browser via localStorage. Never sent to a server
              on its own; it's attached to the eval request the next time you
              generate.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>Month label</FieldLabel>
                <TextInput
                  placeholder="e.g. December 2025"
                  value={draft.month}
                  onChange={(e) =>
                    setDraft({ ...draft, month: e.target.value })
                  }
                />
              </div>
              <div>
                <FieldLabel>Sender</FieldLabel>
                <TextInput
                  value={draft.sender}
                  onChange={(e) =>
                    setDraft({ ...draft, sender: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-5">
              <FieldLabel>Update body, markdown</FieldLabel>
              <TextArea
                rows={12}
                placeholder="Paste the full month's update."
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </div>
            <div className="mt-5 flex justify-end">
              <PrimaryButton type="button" onClick={commit}>
                Save month
              </PrimaryButton>
            </div>
          </Panel>
        ) : null}

        {active ? (
          <Panel
            label={active.source === "seed" ? "Demo seed" : "Your addition"}
            aside={active.sender}
            className="reveal-fade"
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-rule pb-4">
              <div>
                <div className="smallcaps mb-1 text-ember-deep">
                  {active.source === "seed"
                    ? "Fabricated for consistency-engine testing"
                    : "Stored in your browser"}
                </div>
                <h3
                  className="display text-[38px] leading-none text-ink sm:text-[44px]"
                  style={{
                    fontVariationSettings: '"opsz" 144, "SOFT" 30',
                  }}
                >
                  {active.month}
                </h3>
              </div>
              {active.source === "user" ? (
                <GhostButton
                  type="button"
                  onClick={() => remove(active.month)}
                >
                  Remove
                </GhostButton>
              ) : null}
            </div>
            <div className="prose-update prose-update-compact">
              <ReactMarkdown>{active.body}</ReactMarkdown>
            </div>
          </Panel>
        ) : (
          <p className="text-[13px] text-ink-4">
            No prior updates. Add one from the sidebar.
          </p>
        )}
      </div>
    </div>
  );
}
