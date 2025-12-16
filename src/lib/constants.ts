export const APPLICATION_STATUSES = [
  "not_started",
  "in_progress",
  "submitted",
  "accepted",
  "rejected",
  "waitlisted",
  "deferred",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const DEADLINE_TYPES = [
  "ED",    // Early Decision
  "EDII",  // Early Decision II
  "EA",    // Early Action
  "EAII",  // Early Action II
  "REA",   // Restrictive Early Action
  "RD",    // Regular Decision
  "Rolling", // Rolling admission
] as const;

export type DeadlineType = (typeof DEADLINE_TYPES)[number];

export const ESSAY_TYPES = [
  "Personal Statement",
  "Supplemental",
  "Why Us",
  "Why Major",
  "Extracurricular",
  "Diversity",
  "Challenge",
  "Other",
] as const;

export type EssayType = (typeof ESSAY_TYPES)[number];

export const PRIORITY_LEVELS = ["low", "medium", "high"] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  not_started: "bg-gray-100 text-gray-800 border-gray-300",
  in_progress: "bg-blue-100 text-blue-800 border-blue-300",
  submitted: "bg-purple-100 text-purple-800 border-purple-300",
  accepted: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  waitlisted: "bg-yellow-100 text-yellow-800 border-yellow-300",
  deferred: "bg-orange-100 text-orange-800 border-orange-300",
};

export const DEADLINE_COLORS: Record<"overdue" | "soon" | "upcoming", string> = {
  overdue: "bg-red-100 text-red-800 border-red-300",
  soon: "bg-orange-100 text-orange-800 border-orange-300",
  upcoming: "bg-blue-100 text-blue-800 border-blue-300",
};
