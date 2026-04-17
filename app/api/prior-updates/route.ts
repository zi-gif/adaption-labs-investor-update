import { getSeedPriorUpdates } from "@/data/prior-updates";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  const updates = getSeedPriorUpdates().map((u) => ({
    month: u.month,
    sender: u.sender,
    label: u.label,
    body: u.body,
    source: "seed" as const,
  }));
  return Response.json({ updates });
}
