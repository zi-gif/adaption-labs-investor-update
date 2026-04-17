export type Investor = {
  name: string;
  role: "Lead" | "Participant";
  thesis: string;
};

export const INVESTORS: Investor[] = [
  {
    name: "Emergence Capital Partners",
    role: "Lead",
    thesis:
      "Enterprise SaaS/AI. Scrutinizes product-market fit signals, burn efficiency, and enterprise willingness-to-pay. Flags about enterprise pilots and customer signal are highest priority.",
  },
  {
    name: "Mozilla Ventures",
    role: "Participant",
    thesis:
      "Mission-aligned. Cares about open, accessible AI, multilingual progress, open-source contributions, global team diversity.",
  },
  {
    name: "Fifty Years",
    role: "Participant",
    thesis:
      "Deep-tech, long-horizon. Cares about technical moat and research differentiation vs. scaling labs.",
  },
  {
    name: "Threshold Ventures",
    role: "Participant",
    thesis:
      "Enterprise infrastructure focus. Watches developer adoption metrics and go-to-market velocity.",
  },
  {
    name: "Alpha Intelligence Capital",
    role: "Participant",
    thesis:
      "AI-specialist fund. Benchmarks technical claims against the broader AI lab landscape.",
  },
  {
    name: "E14 Fund",
    role: "Participant",
    thesis:
      "MIT-connected. Research credibility, publications, and talent pipeline matter.",
  },
  {
    name: "Neo",
    role: "Participant",
    thesis:
      "Community-driven fund. Hiring velocity and founder brand matter.",
  },
];
