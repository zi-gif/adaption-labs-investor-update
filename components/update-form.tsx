"use client";

import clsx from "clsx";
import type { UpdateFormData, KeyHire, PressItem } from "@/lib/types";
import { COUNTRY_OPTIONS, INTERFACES_STATUS } from "@/lib/demo-defaults";
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
  form: UpdateFormData;
  onChange: (form: UpdateFormData) => void;
  onGenerate: () => void;
  generating: boolean;
};

function computeRunway(cashM: number | null, burnK: number | null): string {
  if (!cashM || !burnK || burnK === 0) return "n/a";
  return ((cashM * 1000) / burnK).toFixed(1);
}

export function UpdateForm({ form, onChange, onGenerate, generating }: Props) {
  const setMetric = <K extends keyof UpdateFormData["metrics"]>(
    key: K,
    value: UpdateFormData["metrics"][K],
  ) => onChange({ ...form, metrics: { ...form.metrics, [key]: value } });

  const toggleCountry = (country: string) => {
    const current = form.metrics.newHireCountries;
    const next = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    setMetric("newHireCountries", next);
  };

  const setHire = (i: number, patch: Partial<KeyHire>) => {
    const next = [...form.keyHires];
    next[i] = { ...next[i], ...patch };
    onChange({ ...form, keyHires: next });
  };

  const addHire = () => {
    if (form.keyHires.length >= 3) return;
    onChange({
      ...form,
      keyHires: [
        ...form.keyHires,
        { name: "", role: "", location: "", bio: "" },
      ],
    });
  };

  const removeHire = (i: number) => {
    onChange({
      ...form,
      keyHires: form.keyHires.filter((_, idx) => idx !== i),
    });
  };

  const setPress = (i: number, patch: Partial<PressItem>) => {
    const next = [...form.press];
    next[i] = { ...next[i], ...patch };
    onChange({ ...form, press: next });
  };

  const addPress = () => {
    if (form.press.length >= 5) return;
    onChange({ ...form, press: [...form.press, { title: "", url: "" }] });
  };

  const removePress = (i: number) => {
    onChange({ ...form, press: form.press.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <SectionHeading
          eyebrow="Frame"
          title="Month and sender"
          description="Sets the voice and the time window for the consistency engine."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Month</FieldLabel>
            <TextInput
              value={form.month}
              onChange={(e) => onChange({ ...form, month: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Sent by</FieldLabel>
            <div className="flex rounded-full bg-line-soft/50 p-1 text-[13px]">
              {(
                ["Sara Hooker (CEO)", "Sudip Roy (CTO)"] as const
              ).map((who) => (
                <button
                  key={who}
                  type="button"
                  onClick={() => onChange({ ...form, sender: who })}
                  className={clsx(
                    "focus-ring flex-1 rounded-full px-3 py-1.5 transition-colors",
                    form.sender === who
                      ? "bg-surface font-medium text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {who}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <FieldLabel hint={`${form.tldr.length}/280`}>TL;DR</FieldLabel>
          <TextInput
            maxLength={280}
            placeholder="The single most important thing this month. Write it like a headline."
            value={form.tldr}
            onChange={(e) => onChange({ ...form, tldr: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading
          eyebrow="Signals"
          title="Key metrics"
          description="Adaption-specific, not generic SaaS. Maps to the three product pillars and the team-density thesis."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            label="Team size (current)"
            value={form.metrics.teamSize}
            onChange={(v) => setMetric("teamSize", v)}
          />
          <NumberField
            label="New hires this period"
            value={form.metrics.newHires}
            onChange={(v) => setMetric("newHires", v)}
          />
          <NumberField
            label="Cash on hand ($M)"
            value={form.metrics.cashOnHand}
            onChange={(v) => setMetric("cashOnHand", v)}
          />
          <NumberField
            label="Monthly burn ($K)"
            value={form.metrics.monthlyBurn}
            onChange={(v) => setMetric("monthlyBurn", v)}
          />
          <div>
            <FieldLabel hint="auto">Runway (months)</FieldLabel>
            <TextInput
              readOnly
              className="cursor-not-allowed bg-line-soft/40"
              value={computeRunway(
                form.metrics.cashOnHand,
                form.metrics.monthlyBurn,
              )}
            />
          </div>
          <NumberField
            label="Adaptive Data: customers onboarding"
            value={form.metrics.adaptiveDataCustomers}
            onChange={(v) => setMetric("adaptiveDataCustomers", v)}
          />
          <NumberField
            label="Adaptive Intelligence: waitlist"
            value={form.metrics.adaptiveIntelligenceWaitlist}
            onChange={(v) => setMetric("adaptiveIntelligenceWaitlist", v)}
          />
          <div>
            <FieldLabel>Adaptive Interfaces status</FieldLabel>
            <select
              value={form.metrics.adaptiveInterfacesStatus}
              onChange={(e) =>
                setMetric(
                  "adaptiveInterfacesStatus",
                  e.target
                    .value as UpdateFormData["metrics"]["adaptiveInterfacesStatus"],
                )
              }
              className="focus-ring w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] text-ink"
            >
              {INTERFACES_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel hint="multi-select">New hire geographies</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {COUNTRY_OPTIONS.map((c) => {
              const active = form.metrics.newHireCountries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCountry(c)}
                  className={clsx(
                    "focus-ring rounded-full px-3 py-1 text-[12.5px] transition-colors",
                    active
                      ? "border border-accent/60 bg-accent-wash text-accent-deep"
                      : "border border-line bg-surface text-ink-soft hover:border-accent/40 hover:text-ink",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading
          eyebrow="Narrative"
          title="Wins, risks, and hires"
        />
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FieldLabel>Wins this month</FieldLabel>
            <TextArea
              rows={4}
              placeholder="Research milestone, key hire, customer win, press, partnership signal."
              value={form.wins}
              onChange={(e) => onChange({ ...form, wins: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Challenges / risks</FieldLabel>
            <TextArea
              rows={3}
              placeholder="Be honest. Investors reward transparency; silence creates its own narrative."
              value={form.challenges}
              onChange={(e) =>
                onChange({ ...form, challenges: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[13px] font-medium text-ink">
              Key hires spotlight
            </label>
            <GhostButton
              type="button"
              onClick={addHire}
              disabled={form.keyHires.length >= 3}
            >
              + Add hire
            </GhostButton>
          </div>
          <div className="space-y-3">
            {form.keyHires.map((h, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-line-soft/30 p-3"
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <TextInput
                    placeholder="Name"
                    value={h.name}
                    onChange={(e) => setHire(i, { name: e.target.value })}
                  />
                  <TextInput
                    placeholder="Role"
                    value={h.role}
                    onChange={(e) => setHire(i, { role: e.target.value })}
                  />
                  <TextInput
                    placeholder="Location"
                    value={h.location}
                    onChange={(e) => setHire(i, { location: e.target.value })}
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  <TextInput
                    maxLength={100}
                    placeholder="One-line bio (100 char max)"
                    value={h.bio}
                    onChange={(e) => setHire(i, { bio: e.target.value })}
                  />
                  <GhostButton
                    type="button"
                    onClick={() => removeHire(i)}
                    className="shrink-0"
                  >
                    Remove
                  </GhostButton>
                </div>
              </div>
            ))}
            {form.keyHires.length === 0 ? (
              <p className="text-[12.5px] text-ink-faint">
                No hires added yet. Talent density is Adaption's primary
                execution signal post-seed; most months will have at least one.
              </p>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading
          eyebrow="Leverage"
          title="Asks and press"
          description="Asks are the highest-ROI section of any investor update. Be specific."
        />
        <div>
          <FieldLabel>Asks</FieldLabel>
          <TextArea
            rows={3}
            placeholder="Intros, candidates, design partners, signal."
            value={form.asks}
            onChange={(e) => onChange({ ...form, asks: e.target.value })}
          />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[13px] font-medium text-ink">
              Press and links
            </label>
            <GhostButton
              type="button"
              onClick={addPress}
              disabled={form.press.length >= 5}
            >
              + Add link
            </GhostButton>
          </div>
          <div className="space-y-2">
            {form.press.map((p, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  placeholder="Title"
                  value={p.title}
                  onChange={(e) => setPress(i, { title: e.target.value })}
                />
                <TextInput
                  placeholder="https://"
                  value={p.url}
                  onChange={(e) => setPress(i, { url: e.target.value })}
                />
                <GhostButton
                  type="button"
                  onClick={() => removePress(i)}
                  className="shrink-0"
                >
                  Remove
                </GhostButton>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <PrimaryButton
          type="button"
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Generating…" : "Generate update"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
      />
    </div>
  );
}
