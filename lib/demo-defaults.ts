import type { UpdateFormData } from "./types";

export const DEMO_FORM: UpdateFormData = {
  month: "April 2026",
  sender: "Sara Hooker (CEO)",
  tldr:
    "Shipped v0.1 of Adaptive Data to our first three enterprise design partners and grew the team to 18 across four countries.",
  metrics: {
    teamSize: 18,
    newHires: 4,
    newHireCountries: ["San Francisco", "Toronto", "London", "Nairobi"],
    cashOnHand: 44,
    monthlyBurn: 850,
    adaptiveDataCustomers: 3,
    adaptiveIntelligenceWaitlist: 127,
    adaptiveInterfacesStatus: "In design",
  },
  wins: [
    "First external deployment of Adaptive Data with a Fortune 500 financial services partner. Early signal: 40% reduction in retraining cost vs. their current fine-tuning pipeline.",
    "Hired Dr. Amara Okonkwo, ex-DeepMind, as Research Lead in London. First senior research hire outside North America.",
    "Sara keynoted at RAISE Summit London. 30+ enterprise inquiries the following week.",
  ].join("\n"),
  challenges: [
    "Senior ML infrastructure hiring remains competitive. Two final-round candidates accepted counteroffers. Adjusting comp bands and sourcing strategy.",
    "Navigating employment law across four jurisdictions simultaneously. Legal coordination with Wilson Sonsini ongoing.",
  ].join("\n"),
  keyHires: [
    {
      name: "Dr. Amara Okonkwo",
      role: "Research Lead",
      location: "London",
      bio: "Ex-DeepMind, 8 years in efficient inference. Led pruning research at scale.",
    },
  ],
  asks: [
    "Intros to Head of AI or CTO-level contacts at mid-market financial services firms (Series C+) exploring custom model adaptation.",
    "Referrals for senior ML infra engineers, especially candidates with distributed systems experience open to Toronto or London.",
  ].join("\n"),
  press: [
    {
      title: "Adaption Labs secures $50 million seed round",
      url: "https://fortune.com",
    },
    {
      title:
        "Why Cohere's ex-AI research lead is betting against the scaling race",
      url: "https://techcrunch.com",
    },
  ],
};

export const COUNTRY_OPTIONS = [
  "San Francisco",
  "New York",
  "Toronto",
  "London",
  "Warsaw",
  "São Paulo",
  "Bengaluru",
  "Nairobi",
  "Remote (Americas)",
  "Remote (EMEA)",
  "Remote (APAC)",
];

export const INTERFACES_STATUS = [
  "Not yet launched",
  "In design",
  "Early prototype",
] as const;
