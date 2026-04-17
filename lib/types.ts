export type KeyHire = {
  name: string;
  role: string;
  location: string;
  bio: string;
};

export type PressItem = {
  title: string;
  url: string;
};

export type MetricVisibility = {
  teamSize: boolean;
  newHires: boolean;
  newHireCountries: boolean;
  cashOnHand: boolean;
  monthlyBurn: boolean;
  runway: boolean;
  adaptiveDataCustomers: boolean;
  adaptiveIntelligenceWaitlist: boolean;
  adaptiveInterfacesStatus: boolean;
};

export type SectionNotes = {
  frame: string;
  signals: string;
  narrative: string;
  leverage: string;
};

export type UpdateFormData = {
  month: string;
  sender: "Sara Hooker (CEO)" | "Sudip Roy (CTO)";
  tldr: string;
  metrics: {
    teamSize: number | null;
    newHires: number | null;
    newHireCountries: string[];
    cashOnHand: number | null;
    monthlyBurn: number | null;
    adaptiveDataCustomers: number | null;
    adaptiveIntelligenceWaitlist: number | null;
    adaptiveInterfacesStatus:
      | "Not yet launched"
      | "In design"
      | "Early prototype";
  };
  metricVisibility: MetricVisibility;
  wins: string;
  challenges: string;
  keyHires: KeyHire[];
  asks: string;
  press: PressItem[];
  sectionNotes: SectionNotes;
};

export type PriorUpdateDoc = {
  month: string;
  sender: string;
  body: string;
  source: "seed" | "user";
};

export type DriftType =
  | "silence"
  | "contradiction"
  | "softened language"
  | "thread resolved"
  | "positive overshoot";

export type Priority = "high" | "medium" | "low";

export type ConsistencyFlag = {
  excerpt: string;
  source_month: string;
  drift_type: DriftType;
  priority: Priority;
  suggested_addition: string;
  relevant_investors: string[];
};

export type EvaluationResult = {
  flags: ConsistencyFlag[];
};
