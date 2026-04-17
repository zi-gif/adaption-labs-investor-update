"use client";

import clsx from "clsx";
import type { UpdateFormData, KeyHire, PressItem } from "@/lib/types";
import { COUNTRY_OPTIONS, INTERFACES_STATUS } from "@/lib/demo-defaults";
import {
  FieldLabel,
  GhostButton,
  PrimaryButton,
  Section,
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
    <div className="reveal">
      <Section folio="01" label="Frame" title="Month, sender, headline.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Month</FieldLabel>
            <TextInput
              value={form.month}
              onChange={(e) => onChange({ ...form, month: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Sent by</FieldLabel>
            <div className="flex border-b border-rule">
              {(
                ["Sara Hooker (CEO)", "Sudip Roy (CTO)"] as const
              ).map((who) => (
                <button
                  key={who}
                  type="button"
                  onClick={() => onChange({ ...form, sender: who })}
                  className={clsx(
                    "focus-ring relative flex-1 py-2 text-left text-[13.5px] transition-colors",
                    form.sender === who
                      ? "text-ink"
                      : "text-ink-4 hover:text-ink-2",
                  )}
                >
                  {who}
                  {form.sender === who ? (
                    <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-ember draw-line" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <FieldLabel hint={`${form.tldr.length} / 280`}>
            TL;DR headline
          </FieldLabel>
          <TextArea
            rows={2}
            maxLength={280}
            placeholder="The single most important thing this month. Write it like a headline."
            value={form.tldr}
            onChange={(e) => onChange({ ...form, tldr: e.target.value })}
            className="!text-[16px] !leading-snug"
          />
        </div>
      </Section>

      <Section folio="02" label="Signals" title="Metrics that map to the thesis.">
        <p className="mb-6 max-w-prose text-[13.5px] leading-relaxed text-ink-3">
          Adaption-specific, not generic SaaS. The three product pillars,
          team density, burn, runway. Numbers are typeset in{" "}
          <span className="mono">JetBrains Mono</span> so they read
          cleanly when skimming.
        </p>
        <MetricRow
          label="Team size (current)"
          value={form.metrics.teamSize}
          unit=""
          onChange={(v) => setMetric("teamSize", v)}
        />
        <MetricRow
          label="New hires this period"
          value={form.metrics.newHires}
          unit=""
          onChange={(v) => setMetric("newHires", v)}
        />
        <MetricRow
          label="Cash on hand"
          value={form.metrics.cashOnHand}
          unit="$M"
          onChange={(v) => setMetric("cashOnHand", v)}
        />
        <MetricRow
          label="Monthly burn"
          value={form.metrics.monthlyBurn}
          unit="$K"
          onChange={(v) => setMetric("monthlyBurn", v)}
        />
        <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3 border-b border-rule py-3">
          <div className="smallcaps !text-[10.5px] text-ink-2">Runway</div>
          <div className="mono tabular text-[14px] text-ink-3">auto</div>
          <div className="mono tabular w-[140px] text-right text-[18px] text-ember-deep">
            {computeRunway(form.metrics.cashOnHand, form.metrics.monthlyBurn)}
            <span className="ml-1 text-[12px] text-ink-4">mo</span>
          </div>
        </div>
        <MetricRow
          label="Adaptive Data, customers onboarding"
          value={form.metrics.adaptiveDataCustomers}
          unit=""
          onChange={(v) => setMetric("adaptiveDataCustomers", v)}
        />
        <MetricRow
          label="Adaptive Intelligence, waitlist"
          value={form.metrics.adaptiveIntelligenceWaitlist}
          unit=""
          onChange={(v) => setMetric("adaptiveIntelligenceWaitlist", v)}
        />
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-rule py-3">
          <div className="smallcaps !text-[10.5px] text-ink-2">
            Adaptive Interfaces status
          </div>
          <div />
          <select
            value={form.metrics.adaptiveInterfacesStatus}
            onChange={(e) =>
              setMetric(
                "adaptiveInterfacesStatus",
                e.target
                  .value as UpdateFormData["metrics"]["adaptiveInterfacesStatus"],
              )
            }
            className="focus-ring mono tabular w-[180px] cursor-pointer border-none bg-transparent text-right text-[13.5px] text-ink outline-none"
          >
            {INTERFACES_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <FieldLabel hint="multi-select">New hire geographies</FieldLabel>
          <div className="flex flex-wrap gap-1">
            {COUNTRY_OPTIONS.map((c) => {
              const active = form.metrics.newHireCountries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCountry(c)}
                  className={clsx(
                    "focus-ring border px-2.5 py-1 text-[12px] transition-colors",
                    active
                      ? "border-ember bg-ember-wash text-ember-deep"
                      : "border-rule text-ink-3 hover:border-ember/70 hover:text-ink",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section folio="03" label="Narrative" title="Wins, risks, and hires.">
        <div className="grid grid-cols-1 gap-6">
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
            <FieldLabel>Challenges and risks</FieldLabel>
            <TextArea
              rows={3}
              placeholder="Be honest. Silence creates its own narrative."
              value={form.challenges}
              onChange={(e) =>
                onChange({ ...form, challenges: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="smallcaps !text-[10.5px] text-ink-2">
              Key hires spotlight
            </div>
            <GhostButton
              type="button"
              onClick={addHire}
              disabled={form.keyHires.length >= 3}
            >
              + Add hire
            </GhostButton>
          </div>
          <div className="space-y-4">
            {form.keyHires.map((h, i) => (
              <div
                key={i}
                className="border-l-2 border-ember-soft/60 pl-4 pt-1"
              >
                <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                <div className="flex gap-2">
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
              <p className="text-[12.5px] italic text-ink-4">
                No hires added. Talent density is Adaption's primary
                execution signal post-seed; most months will have at least one.
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <Section folio="04" label="Leverage" title="Asks, press, links.">
        <p className="mb-6 max-w-prose text-[13.5px] leading-relaxed text-ink-3">
          Asks are the highest-ROI section of any update. Specific beats
          generic; named roles beat vague categories.
        </p>
        <div>
          <FieldLabel>Asks</FieldLabel>
          <TextArea
            rows={3}
            placeholder="Intros, candidates, design partners, signal."
            value={form.asks}
            onChange={(e) => onChange({ ...form, asks: e.target.value })}
          />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="smallcaps !text-[10.5px] text-ink-2">
              Press and links
            </div>
            <GhostButton
              type="button"
              onClick={addPress}
              disabled={form.press.length >= 5}
            >
              + Add link
            </GhostButton>
          </div>
          <div className="space-y-3">
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
      </Section>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-6">
        <div className="text-[12px] text-ink-4">
          Draft pass + evaluation pass run sequentially.
          <br />
          Claude Sonnet 4.6, streamed to your browser.
        </div>
        <PrimaryButton
          type="button"
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Drafting…" : "Generate update"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number | null;
  unit: string;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-rule py-3">
      <label className="smallcaps !text-[10.5px] text-ink-2">{label}</label>
      <span className="mono tabular text-[11px] text-ink-4">{unit}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        className="focus-ring mono tabular w-[140px] bg-transparent px-0 py-1 text-right text-[18px] text-ink outline-none placeholder:text-ink-4"
        placeholder="..."
      />
    </div>
  );
}
