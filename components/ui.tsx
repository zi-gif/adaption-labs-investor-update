"use client";

import clsx from "clsx";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <label className="smallcaps !text-[10.5px] text-ink-2">
        {children}
      </label>
      {hint ? (
        <span className="mono tabular text-[10.5px] text-ink-4">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Editorial input. Hairline underline rather than a box; focus ember underline.
 * No bg fill, no rounded-lg chrome.
 */
export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "focus-ring block w-full bg-transparent px-0 py-2 text-[14.5px] text-ink placeholder:text-ink-4",
        "border-b border-rule outline-none transition-colors",
        "hover:border-ink-3 focus:border-ember",
        props.className,
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        "focus-ring block w-full resize-y bg-transparent px-0 py-2 text-[14.5px] leading-relaxed text-ink placeholder:text-ink-4",
        "border-b border-rule outline-none transition-colors",
        "hover:border-ink-3 focus:border-ember",
        props.className,
      )}
    />
  );
}

/**
 * Primary call-to-action: underlined display text with ember ink.
 * Punchier than a pill; reads as editorial typography, not a SaaS button.
 */
export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, children, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        "focus-ring group relative inline-flex items-center gap-3 bg-ink px-6 py-3 text-[13px] font-medium tracking-[0.04em] text-canvas uppercase",
        "transition-[transform,box-shadow,background-color] duration-200",
        "hover:bg-ember-deep active:translate-y-[1px]",
        "disabled:cursor-not-allowed disabled:bg-ink-4 disabled:hover:bg-ink-4",
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-block h-[1px] w-5 translate-y-[1px] bg-canvas transition-[width] duration-300 group-hover:w-8"
      />
    </button>
  );
}

/**
 * Ghost button: pill-shaped hairline, low-chrome, for secondary actions.
 */
export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-1.5 border border-rule bg-transparent px-3.5 py-1.5 text-[12px] font-medium tracking-[0.02em] text-ink-2",
        "transition-colors",
        "hover:border-ember/70 hover:text-ember-deep hover:bg-ember-wash/40",
        "disabled:cursor-not-allowed disabled:opacity-40",
        props.className,
      )}
    />
  );
}

/**
 * Editorial container: hairline top & bottom rather than a boxed card.
 * Wraps sections with a numbered folio label, gives journal structure.
 */
export function Section({
  folio,
  label,
  title,
  children,
  aside,
  className,
}: {
  folio: string;
  label?: string;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "elevate relative grid grid-cols-[64px_1fr] gap-x-6 gap-y-5 border-t border-rule py-8 first:border-t-0 first:pt-6 sm:grid-cols-[88px_1fr]",
        className,
      )}
    >
      <div className="sticky top-[88px] self-start">
        <div
          className="display text-ember-deep"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 60',
            fontSize: "36px",
            lineHeight: "0.9",
          }}
        >
          §{folio}
        </div>
        {label ? (
          <div className="mt-2 smallcaps !text-[10px] text-ink-4">
            {label}
          </div>
        ) : null}
      </div>
      <div>
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2
            className="display text-[26px] text-ink sm:text-[28px]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
          >
            {title}
          </h2>
          {aside}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

/**
 * Journal-style panel: hairline box with a folio tab. Used for the
 * generated update & flags output where a boundary is helpful.
 */
export function Panel({
  children,
  label,
  aside,
  className,
  bare = false,
}: {
  children: React.ReactNode;
  label?: string;
  aside?: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div
      className={clsx(
        "elevate relative border border-rule bg-surface/60",
        bare ? "" : "p-6 sm:p-7",
        className,
      )}
    >
      {label ? (
        <div className="-mt-[10px] -ml-px mb-4 flex items-center gap-3">
          <span className="smallcaps bg-canvas pr-2 pl-1 !text-[10px] text-ember-deep">
            {label}
          </span>
          <span className="h-px flex-1 bg-rule/70" />
          {aside ? (
            <span className="smallcaps bg-canvas px-2 !text-[10px] text-ink-4">
              {aside}
            </span>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Legacy Card export maintained (some pages import it) */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("elevate border border-rule bg-surface/60", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      {eyebrow ? (
        <div className="smallcaps mb-2 text-ember-deep">{eyebrow}</div>
      ) : null}
      <h2
        className="display text-[24px] text-ink"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-prose text-[13.5px] leading-relaxed text-ink-3">
          {description}
        </p>
      ) : null}
    </div>
  );
}
