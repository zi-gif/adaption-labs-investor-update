"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import type { PriorUpdateDoc } from "@/lib/types";
import {
  addUserUpdate,
  readUserUpdates,
  removeUserUpdate,
} from "@/lib/user-updates";
import {
  Card,
  FieldLabel,
  GhostButton,
  PrimaryButton,
  SectionHeading,
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

  useEffect(() => {
    setUser(readUserUpdates());
  }, []);

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
  };

  const remove = (month: string) => {
    removeUserUpdate(month);
    setUser(readUserUpdates());
  };

  const all = [
    ...seed.map((u) => ({ ...u, source: "seed" as const })),
    ...user,
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-faint">
          {all.length} month{all.length === 1 ? "" : "s"} in context.
        </p>
        <GhostButton type="button" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add a month"}
        </GhostButton>
      </div>

      {adding ? (
        <Card className="p-6">
          <SectionHeading
            eyebrow="Local only"
            title="Add a prior month"
            description="Stored in your browser (localStorage). Never sent to a server on its own; only attached to the eval request when you generate."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div className="mt-4">
            <FieldLabel>Update body (markdown)</FieldLabel>
            <TextArea
              rows={12}
              placeholder="Paste the full month's update in markdown."
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <PrimaryButton type="button" onClick={commit}>
              Save month
            </PrimaryButton>
          </div>
        </Card>
      ) : null}

      <div className="space-y-5">
        {all.map((u) => (
          <Card key={`${u.source}-${u.month}`} className="p-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={clsx(
                      "rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em]",
                      u.source === "seed"
                        ? "bg-line-soft/70 text-ink-soft"
                        : "bg-teal-wash text-teal",
                    )}
                  >
                    {u.source === "seed" ? "Demo seed" : "You added"}
                  </span>
                  <span className="text-[11.5px] text-ink-faint">
                    {u.sender}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-ink">
                  {u.month}
                </h3>
              </div>
              {u.source === "user" ? (
                <GhostButton type="button" onClick={() => remove(u.month)}>
                  Remove
                </GhostButton>
              ) : null}
            </div>
            <div className="prose-update">
              <ReactMarkdown>{u.body}</ReactMarkdown>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
