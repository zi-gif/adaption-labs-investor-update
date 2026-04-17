"use client";

import clsx from "clsx";
import type {
  KeyHire,
  MetricVisibility,
  PressItem,
  SectionNotes,
  UpdateFormData,
} from "@/lib/types";
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

const VISIBILITY_TOTAL = 9;

export function UpdateForm({ form, onChange, onGenerate, generating }: Props) {
  const setMetric = <K extends keyof UpdateFormData["metrics"]>(
    key: K,
    value: UpdateFormData["metrics"][K],
  ) => onChange({ ...form, metrics: { ...form.metrics, [key]: value } });

  const setVisibility = <K extends keyof MetricVisibility>(
    key: K,
    value: boolean,
  ) =>
    onChange({
      ...form,
      metricVisibility: { ...form.metricVisibility, [key]: value },
    });

  const setAllVisibility = (value: boolean) =>
    onChange({
      ...form,
      metricVisibility: Object.fromEntries(
        Object.keys(form.metricVisibility).map((k) => [k, value]),
      ) as MetricVisibility,
    });

  const setNote = <K extends keyof SectionNotes>(key: K, value: string) =>
    onChange({
      ...form,
      sectionNotes: { ...form.sectionNotes, [key]: value },
    });

  const includedCount = Object.values(form.metricVisibility).filter(
    Boolean,
  ).length;

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

  const canRunway =
    form.metrics.cashOnHand !== null && form.metrics.monthlyBurn !== null;

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
        <SectionNotesField
          label="frame"
          value={form.sectionNotes.frame}
          onChange={(v) => setNote("frame", v)}
          placeholder="Anything else that shapes this month's framing. Context the structured fields miss; drafts will fold it in naturally."
        />
      </Section>

      <Section
        folio="02"
        label="Signals"
        title="Metrics that map to the thesis."
        aside={
          <div className="flex items-center gap-3 text-[11px] text-ink-3">
            <span className="mono tabular">
              {String(includedCount).padStart(2, "0")} / 0{VISIBILITY_TOTAL}{" "}
              <span className="text-ink-4">included</span>
            </span>
            {includedCount === VISIBILITY_TOTAL ? (
              <button
                type="button"
                onClick={() => setAllVisibility(false)}
                className="focus-ring text-ink-3 underline decoration-rule underline-offset-[3px] transition-colors hover:text-ember-deep"
              >
                Hide all
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAllVisibility(true)}
                className="focus-ring text-ink-3 underline decoration-rule underline-offset-[3px] transition-colors hover:text-ember-deep"
              >
                Show all
              </button>
            )}
          </div>
        }
      >
        <p className="mb-6 max-w-prose text-[13.5px] leading-relaxed text-ink-3">
          Adaption-specific, not generic SaaS. The three product pillars,
          team density, burn, runway. Use the box on each row to include or
          hide that metric from the update; hidden rows are omitted from
          Claude's prompt entirely.
        </p>

        <MetricRow
          label="Team size (current)"
          value={form.metrics.teamSize}
          unit=""
          onChange={(v) => setMetric("teamSize", v)}
          included={form.metricVisibility.teamSize}
          onToggle={(v) => setVisibility("teamSize", v)}
        />
        <MetricRow
          label="New hires this period"
          value={form.metrics.newHires}
          unit=""
          onChange={(v) => setMetric("newHires", v)}
          included={form.metricVisibility.newHires}
          onToggle={(v) => setVisibility("newHires", v)}
        />
        <MetricRow
          label="Cash on hand"
          value={form.metrics.cashOnHand}
          unit="$M"
          onChange={(v) => setMetric("cashOnHand", v)}
          included={form.metricVisibility.cashOnHand}
          onToggle={(v) => setVisibility("cashOnHand", v)}
        />
        <MetricRow
          label="Monthly burn"
          value={form.metrics.monthlyBurn}
          unit="$K"
          onChange={(v) => setMetric("monthlyBurn", v)}
          included={form.metricVisibility.monthlyBurn}
          onToggle={(v) => setVisibility("monthlyBurn", v)}
        />

        <RunwayRow
          cashM={form.metrics.cashOnHand}
          burnK={form.metrics.monthlyBurn}
          included={form.metricVisibility.runway}
          canCompute={canRunway}
          onToggle={(v) => setVisibility("runway", v)}
        />

        <MetricRow
          label="Adaptive Data, customers onboarding"
          value={form.metrics.adaptiveDataCustomers}
          unit=""
          onChange={(v) => setMetric("adaptiveDataCustomers", v)}
          included={form.metricVisibility.adaptiveDataCustomers}
          onToggle={(v) => setVisibility("adaptiveDataCustomers", v)}
        />
        <MetricRow
          label="Adaptive Intelligence, waitlist"
          value={form.metrics.adaptiveIntelligenceWaitlist}
          unit=""
          onChange={(v) => setMetric("adaptiveIntelligenceWaitlist", v)}
          included={form.metricVisibility.adaptiveIntelligenceWaitlist}
          onToggle={(v) => setVisibility("adaptiveIntelligenceWaitlist", v)}
        />

        <div
          className={clsx(
            "grid grid-cols-[18px_1fr_auto_auto] items-center gap-3 border-b border-rule py-3 transition-opacity",
            !form.metricVisibility.adaptiveInterfacesStatus && "opacity-30",
          )}
        >
          <MetricToggle
            on={form.metricVisibility.adaptiveInterfacesStatus}
            onChange={(v) => setVisibility("adaptiveInterfacesStatus", v)}
            label="Adaptive Interfaces status"
          />
          <label
            className={clsx(
              "smallcaps !text-[10.5px] text-ink-2",
              !form.metricVisibility.adaptiveInterfacesStatus &&
                "line-through decoration-ink-4/60",
            )}
          >
            Adaptive Interfaces status
          </label>
          <div />
          <select
            disabled={!form.metricVisibility.adaptiveInterfacesStatus}
            value={form.metrics.adaptiveInterfacesStatus}
            onChange={(e) =>
              setMetric(
                "adaptiveInterfacesStatus",
                e.target
                  .value as UpdateFormData["metrics"]["adaptiveInterfacesStatus"],
              )
            }
            className="focus-ring mono tabular w-[180px] cursor-pointer border-none bg-transparent text-right text-[13.5px] text-ink outline-none disabled:cursor-not-allowed"
          >
            {INTERFACES_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Countries multi-select, with block-level toggle */}
        <div
          className={clsx(
            "mt-6 transition-opacity",
            !form.metricVisibility.newHireCountries && "opacity-30",
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            <MetricToggle
              on={form.metricVisibility.newHireCountries}
              onChange={(v) => setVisibility("newHireCountries", v)}
              label="New hire geographies"
            />
            <span
              className={clsx(
                "smallcaps !text-[10.5px] text-ink-2",
                !form.metricVisibility.newHireCountries &&
                  "line-through decoration-ink-4/60",
              )}
            >
              New hire geographies
            </span>
            <span className="mono tabular text-[10.5px] text-ink-4">
              multi-select
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pl-6">
            {COUNTRY_OPTIONS.map((c) => {
              const active = form.metrics.newHireCountries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  disabled={!form.metricVisibility.newHireCountries}
                  onClick={() => toggleCountry(c)}
                  className={clsx(
                    "focus-ring border px-2.5 py-1 text-[12px] transition-colors disabled:cursor-not-allowed",
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

        <SectionNotesField
          label="signals"
          value={form.sectionNotes.signals}
          onChange={(v) => setNote("signals", v)}
          placeholder="Context that the metric rows can't carry. A benchmark result, a research paper acceptance, a latency number, anything numeric or technical worth surfacing."
        />
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

        <SectionNotesField
          label="narrative"
          value={form.sectionNotes.narrative}
          onChange={(v) => setNote("narrative", v)}
          placeholder="A team moment, a board exchange, an internal decision that shaped the month. Anything that belongs in the narrative arc but doesn't fit 'wins' or 'risks'."
        />
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

        <SectionNotesField
          label="leverage"
          value={form.sectionNotes.leverage}
          onChange={(v) => setNote("leverage", v)}
          placeholder="Specific investor requests, a thesis angle to weave in, a strategic partner to name-check. Anything that sharpens the asks or press."
        />
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

/**
 * Editorial include/hide indicator. Filled square when included,
 * hairline square when hidden. Small click target but clearly tappable.
 */
function MetricToggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? `Hide ${label} from update` : `Include ${label} in update`}
      onClick={() => onChange(!on)}
      className={clsx(
        "focus-ring relative inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center border transition-colors",
        on
          ? "border-ember bg-ember hover:bg-ember-deep"
          : "border-rule bg-transparent hover:border-ink-3",
      )}
    >
      {on ? (
        <svg
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 text-canvas"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="2.5,6.2 4.8,8.5 9.5,3.8" />
        </svg>
      ) : null}
    </button>
  );
}

function MetricRow({
  label,
  value,
  unit,
  onChange,
  included,
  onToggle,
}: {
  label: string;
  value: number | null;
  unit: string;
  onChange: (v: number | null) => void;
  included: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-[18px_1fr_auto_auto] items-center gap-3 border-b border-rule py-3 transition-opacity",
        !included && "opacity-30",
      )}
    >
      <MetricToggle on={included} onChange={onToggle} label={label} />
      <label
        className={clsx(
          "smallcaps !text-[10.5px] text-ink-2",
          !included && "line-through decoration-ink-4/60",
        )}
      >
        {label}
      </label>
      <span className="mono tabular text-[11px] text-ink-4">{unit}</span>
      <input
        type="number"
        inputMode="decimal"
        disabled={!included}
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        className={clsx(
          "focus-ring mono tabular w-[140px] bg-transparent px-0 py-1 text-right text-[18px] text-ink outline-none placeholder:text-ink-4",
          "disabled:cursor-not-allowed",
        )}
        placeholder="..."
      />
    </div>
  );
}

function RunwayRow({
  cashM,
  burnK,
  included,
  canCompute,
  onToggle,
}: {
  cashM: number | null;
  burnK: number | null;
  included: boolean;
  canCompute: boolean;
  onToggle: (v: boolean) => void;
}) {
  const value = computeRunway(cashM, burnK);
  return (
    <div
      className={clsx(
        "grid grid-cols-[18px_1fr_auto_auto] items-center gap-3 border-b border-rule py-3 transition-opacity",
        !included && "opacity-30",
      )}
    >
      <MetricToggle
        on={included}
        onChange={onToggle}
        label="Runway (auto-computed)"
      />
      <label
        className={clsx(
          "smallcaps !text-[10.5px] text-ink-2",
          !included && "line-through decoration-ink-4/60",
        )}
      >
        Runway
      </label>
      <span className="mono tabular text-[11px] text-ink-4">
        {canCompute ? "auto" : "needs cash + burn"}
      </span>
      <div className="mono tabular w-[140px] text-right text-[18px] text-ember-deep">
        {value}
        <span className="ml-1 text-[12px] text-ink-4">mo</span>
      </div>
    </div>
  );
}

/**
 * Per-section "Additional notes" textarea. Styled as an editorial
 * footnote block so it reads as supplemental, not primary.
 */
function SectionNotesField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mt-8 border-t border-rule pt-5">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="display-italic text-[13px] text-ember-deep">
          Addenda,
        </span>
        <span className="smallcaps !text-[10px] text-ink-3">
          {label}
        </span>
        <span className="ml-auto mono tabular text-[10.5px] text-ink-4">
          optional, free-form
        </span>
      </div>
      <TextArea
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="!text-[13.5px]"
      />
    </div>
  );
}
