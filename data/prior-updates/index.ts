import fs from "node:fs";
import path from "node:path";

export type PriorUpdate = {
  month: string;
  sender: string;
  label?: string;
  body: string;
};

const DIR = path.join(process.cwd(), "data", "prior-updates");

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const header = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\n/, "");
  const meta: Record<string, string> = {};
  for (const line of header.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    meta[key] = val;
  }
  return { meta, body };
}

export function getSeedPriorUpdates(): PriorUpdate[] {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(DIR, filename), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    return {
      month: meta.month ?? filename.replace(/\.md$/, ""),
      sender: meta.sender ?? "Sara Hooker",
      label: meta.label,
      body: body.trim(),
    };
  });
}
