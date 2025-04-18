export type QuestionStep = {
  kind: "question";
  id: string;
  prompt: string;
  options: string[];
  transition: (option: string, fb: Record<string, string>) => number;
};
export type CommentStep = { kind: "comment"; id: string; transition: () => number };
export type FinalStep = { kind: "final"; id: string; text: string };
export type Step = QuestionStep | CommentStep | FinalStep;

export const steps: Step[] = [
  {
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
    transition: () => 1,
  },
  {
    kind: "question",
    id: "praise",
    prompt: "Did we do anything well?",
    options: [
      "Many things – I’ll be back",
      "Good value",
      "Helpful support",
      "Easy to use",
      "Other",
    ],
    transition: (option, fb) => {
      const exclude = {
        "Not useful right now": ["Easy to use"],
        "Didn’t see the value": ["Good value"],
        "Poor support": ["Helpful support"],
        "Missing features / hard to use": ["Easy to use"],
      }[fb.reason] || [];
      if (exclude.includes(option)) return 1;
      if (option === "Many things – I’ll be back") return 2;
      if (option === "Helpful support") return 3;
      return 4;
    },
  },
  {
    kind: "question",
    id: "pause",
    prompt: "Since you’ll be back, how about we pause your subscription for 2 months?",
    options: ["Pause my subscription", "No, cancel"],
    transition: (opt) => (opt === "Pause my subscription" ? 8 : 4),
  },
  {
    kind: "question",
    id: "chat",
    prompt: "Since you liked our support, can we chat a bit more about this?",
    options: ["Yes, let’s chat", "No, cancel"],
    transition: (opt) => (opt === "Yes, let’s chat" ? 6 : 4),
  },
  { kind: "comment", id: "comment", transition: () => 7 },
  { kind: "final", id: "canceled", text: "Your subscription has been canceled." },
  { kind: "final", id: "paused", text: "Your subscription is paused. See you soon!" },
];
