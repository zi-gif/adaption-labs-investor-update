"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { GhostButton, Panel } from "./ui";

type Props = {
  month: string;
  sender: string;
  text: string;
  streaming: boolean;
};

function stripEmDashes(s: string): string {
  return s.replace(/\u2014/g, ", ").replace(/\u2013/g, ", ");
}

function toPlainText(md: string): string {
  return md
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, (m) => m.trim() + " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toHtml(md: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split("\n");
  const html: string[] = [];
  let inUl = false;
  const close = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^#{1,3}\s+/.test(line)) {
      close();
      const level = line.match(/^#+/)![0].length;
      html.push(
        `<h${level} style="font-weight:600;margin-top:1em;margin-bottom:0.4em;font-family:Georgia,serif;">${escape(
          line.replace(/^#+\s+/, ""),
        )}</h${level}>`,
      );
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (!inUl) {
        html.push('<ul style="margin:0 0 1em 1.25rem;padding:0;">');
        inUl = true;
      }
      html.push(
        `<li style="margin-bottom:0.3em;">${escape(line.replace(/^\s*[-*]\s+/, ""))}</li>`,
      );
    } else if (line === "") {
      close();
      html.push("");
    } else {
      close();
      html.push(
        `<p style="margin:0 0 1em 0;line-height:1.6;">${escape(line)}</p>`,
      );
    }
  }
  close();
  return `<div style="font-family:'Schibsted Grotesk',Arial,sans-serif;max-width:640px;color:#1a1511;font-size:15px;">${html.join(
    "\n",
  )}</div>`;
}

export function GeneratedUpdate({ month, sender, text, streaming }: Props) {
  const [copied, setCopied] = useState<"text" | "html" | null>(null);

  const clean = stripEmDashes(text);

  const copyText = async () => {
    await navigator.clipboard.writeText(toPlainText(clean));
    setCopied("text");
    setTimeout(() => setCopied(null), 1500);
  };

  const copyHtml = async () => {
    const html = toHtml(clean);
    if (typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([toPlainText(clean)], {
            type: "text/plain",
          }),
        }),
      ]);
    } else {
      await navigator.clipboard.writeText(html);
    }
    setCopied("html");
    setTimeout(() => setCopied(null), 1500);
  };

  const downloadMd = () => {
    const blob = new Blob([clean], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${month.toLowerCase().replace(/\s+/g, "-")}-investor-update.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!text && !streaming) {
    return (
      <Panel label="Draft" aside={month} className="min-h-[420px]">
        <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-8 text-center">
          <span className="display-italic text-[48px] leading-none text-ember-soft opacity-70">
            “
          </span>
          <p
            className="display mt-3 max-w-[30ch] text-[22px] text-ink"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
          >
            The update writes itself once the signal is in.
          </p>
          <p className="mt-4 max-w-[42ch] text-[13px] leading-relaxed text-ink-3">
            Fill the form, then press <span className="text-ink">Generate</span>
            . Claude will stream the draft here; the consistency engine runs
            the moment it's done.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      label={streaming ? "Drafting" : "Draft"}
      aside={`${month}  ·  ${sender.replace(/\s*\([^)]*\)/, "")}`}
      className="reveal-fade"
    >
      {/* Action strip */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div
          className="display text-[26px] leading-none text-ink sm:text-[30px]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          Investor letter,{" "}
          <span
            className="display-italic text-ember-deep"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            {month.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <GhostButton type="button" onClick={copyText} disabled={streaming}>
            {copied === "text" ? "Copied" : "Copy text"}
          </GhostButton>
          <GhostButton type="button" onClick={copyHtml} disabled={streaming}>
            {copied === "html" ? "Copied HTML" : "Copy HTML"}
          </GhostButton>
          <GhostButton type="button" onClick={downloadMd} disabled={streaming}>
            .md
          </GhostButton>
        </div>
      </div>

      <div className="prose-update">
        <ReactMarkdown>{clean}</ReactMarkdown>
        {streaming ? (
          <span className="caret ml-0.5 inline-block h-4 w-[6px] translate-y-[2px] bg-ember align-middle" />
        ) : null}
      </div>
    </Panel>
  );
}
