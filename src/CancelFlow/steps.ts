// ---------------------------------------------------------------------------
// STEP DEFINITIONS  – keyed by human‑readable IDs, never by hard‑coded index
// ---------------------------------------------------------------------------
export type Feedback = Record<string, string>;

export type QuestionStep = {
  kind: "question";
  id: "reason" | "praise" | "pause" | "chat";
  prompt: string;
  options: string[];
  next: (answer: string, fb: Feedback) => StepID;
};

export type CommentStep = {
  kind: "comment";
  id: "comment";
  next: () => StepID;
};

export type FinalStep = {
  kind: "final";
  id: "canceled" | "paused";
  text: string;
};

export type Step = QuestionStep | CommentStep | FinalStep;
export type StepID = Step["id"];

/** Ordered sequence for the progress bar */
export const ordered: StepID[] = [
  "reason",
  "praise",
  "pause",
  "chat",
  "comment",
  "canceled",
  "paused",
];

/** Maps (id → step definition) */
export const steps: Record<StepID, Step> = {
  /* 0 ────────────────────────────────────────────────────────────────────── */
  reason: {
    kind: "question",
    id: "reason",
    prompt: "How did we fall short?",
    options: [
      "Not useful right now",
      "Didn’t see the value",
      "Poor support",
      "Missing features / hard to use",
      "Other",
    ],
    next: () => "praise",
  },

  /* 1 ────────────────────────────────────────────────────────────────────── */
  praise: {
    kind: "question",
    id: "praise",
    prompt: "Did we do anything well?",
    options: [
      "Many things – I’ll be back",
      "Good value",
      "Helpful support",
      "Easy to use",
      "Other",
    ],
    next: (answer, _fb) => {
      if (answer === "Many things – I’ll be back") return "pause";
      if (answer === "Helpful support") return "chat";
      return "comment";
    },
  },

  /* 2 ────────────────────────────────────────────────────────────────────── */
  pause: {
    kind: "question",
    id: "pause",
    prompt: "Since you’ll be back, how about we pause your subscription for 2 months?",
    options: ["Pause my subscription", "No, cancel"],
    next: (answer) => (answer === "Pause my subscription" ? "paused" : "comment"),
  },

  /* 3 ────────────────────────────────────────────────────────────────────── */
  chat: {
    kind: "question",
    id: "chat",
    prompt: "Since you liked our support, can we chat a bit more about this?",
    options: ["Yes, let’s chat", "No, cancel"],
    next: (answer) => (answer === "Yes, let’s chat" ? "comment" : "canceled"),
  },

  /* 4 ────────────────────────────────────────────────────────────────────── */
  comment: {
    kind: "comment",
    id: "comment",
    next: () => "canceled",
  },

  /* 5 ────────────────────────────────────────────────────────────────────── */
  canceled: {
    kind: "final",
    id: "canceled",
    text: "Your subscription has been canceled.",
  },

  /* 6 ────────────────────────────────────────────────────────────────────── */
  paused: {
    kind: "final",
    id: "paused",
    text: "Your subscription is paused. See you soon!",
  },
};
