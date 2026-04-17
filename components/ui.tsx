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
      <label className="text-[13px] font-medium text-ink">{children}</label>
      {hint ? (
        <span className="text-[11.5px] text-ink-faint">{hint}</span>
      ) : null}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "focus-ring w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-ink-faint",
        "transition-colors hover:border-line-soft focus:border-accent",
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
        "focus-ring w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] leading-relaxed text-ink placeholder:text-ink-faint",
        "transition-colors hover:border-line-soft focus:border-accent",
        props.className,
      )}
    />
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white shadow-[0_1px_0_rgba(0,0,0,0.06)]",
        "transition-[background-color,transform,box-shadow] hover:bg-accent-deep active:translate-y-[1px]",
        "disabled:cursor-not-allowed disabled:bg-accent/50 disabled:hover:bg-accent/50 disabled:active:translate-y-0",
        props.className,
      )}
    />
  );
}

export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink",
        "transition-colors hover:border-accent/50 hover:text-accent-deep",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:text-ink",
        props.className,
      )}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-line/80 bg-surface shadow-[0_1px_0_rgba(26,23,24,0.03)]",
        className,
      )}
    >
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
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-accent-deep">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[20px] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-prose text-[14px] text-ink-soft">
          {description}
        </p>
      ) : null}
    </div>
  );
}
