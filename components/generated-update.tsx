"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, GhostButton, SectionHeading } from "./ui";

type Props = {
  month: string;
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
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

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
        `<h${level} style="font-weight:600;margin-top:1em;margin-bottom:0.4em;">${escape(
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
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;color:#1a1718;font-size:15px;">${html.join(
    "\n",
  )}</div>`;
}

export function GeneratedUpdate({ month, text, streaming }: Props) {
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
      <Card className="flex h-full min-h-[320px] flex-col items-center justify-center p-10 text-center">
        <div className="mb-3 inline-block h-2 w-2 rounded-full bg-accent-soft" />
        <p className="text-[14px] font-medium text-ink">
          Your draft will appear here.
        </p>
        <p className="mt-1 max-w-[36ch] text-[13px] text-ink-soft">
          Fill the form, then hit Generate. Claude will stream the update in real
          time; the consistency engine runs on completion.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-7">
      <div className="mb-4 flex items-center justify-between">
        <SectionHeading eyebrow={month} title="Draft" />
        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={copyText} disabled={streaming}>
            {copied === "text" ? "Copied" : "Copy text"}
          </GhostButton>
          <GhostButton type="button" onClick={copyHtml} disabled={streaming}>
            {copied === "html" ? "Copied HTML" : "Copy HTML"}
          </GhostButton>
          <GhostButton type="button" onClick={downloadMd} disabled={streaming}>
            Download .md
          </GhostButton>
        </div>
      </div>
      <div className="prose-update">
        <ReactMarkdown>{clean}</ReactMarkdown>
        {streaming ? (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-accent align-middle" />
        ) : null}
      </div>
    </Card>
  );
}
