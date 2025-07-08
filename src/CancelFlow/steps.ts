// ---------------------------------------------------------------------------
// TYPES AND INTERFACES
// ---------------------------------------------------------------------------

export type UserData = {
  first_name: string;
  renewal_date: string;
  is_trial: boolean;
  trial_days_remaining?: number;
};

export type OfferType = 
  | 'done-for-you-buildout'
  | '30-day-extension'
  | '50-percent-off'
  | 'park-protect'
  | 'done-with-you-setup'
  | 'priority-support';

export type CancellationReason = 
  | 'no-time'
  | 'just-testing'
  | 'hard-to-learn'
  | 'no-sales-costly'
  | 'bugs-performance'
  | 'poor-service'
  | 'missing-feature'
  | 'other';

export type Feedback = {
  reason?: CancellationReason;
  other_reason?: string;
  first_offer_taken?: boolean;
  second_offer_taken?: boolean;
  [key: string]: string | boolean | undefined;
};

export type LossFrameStep = {
  kind: "loss-frame";
  id: "loss-frame";
  next: () => StepID;
};

export type ReasonSurveyStep = {
  kind: "reason-survey";
  id: "reason-survey";
  next: (reason: CancellationReason, other?: string) => StepID;
};

export type TailoredOfferStep = {
  kind: "tailored-offer";
  id: "tailored-offer";
  offer: OfferType;
  next: (accepted: boolean) => StepID;
};

export type SecondChanceOfferStep = {
  kind: "second-chance-offer";
  id: "second-chance-offer";
  offer: OfferType;
  next: (accepted: boolean) => StepID;
};

export type GoodbyeStep = {
  kind: "goodbye";
  id: "goodbye";
  next: () => StepID;
};

export type CancellationConfirmedStep = {
  kind: "cancellation-confirmed";
  id: "cancellation-confirmed";
};

export type Step = 
  | LossFrameStep
  | ReasonSurveyStep
  | TailoredOfferStep
  | SecondChanceOfferStep
  | GoodbyeStep
  | CancellationConfirmedStep;

export type StepID = Step["id"];

// ---------------------------------------------------------------------------
// OFFER CONFIGURATIONS
// ---------------------------------------------------------------------------

export const offerConfig: Record<OfferType, {
  title: string;
  description: string;
  cta: string;
  rejectCta: string;
}> = {
  'done-for-you-buildout': {
    title: "Too busy to build? We'll do it for you—funnels, emails, automations, and more",
    description: "Submit a project request. Receive a quote within 48 hours (on average).",
    cta: "Get My Free Quote",
    rejectCta: "Continue To Cancel"
  },
  '30-day-extension': {
    title: "Feeling overwhelmed? Here's more time + step-by-step guidance",
    description: "Use the extra month and bite-size checklist to get launched without the overwhelm.",
    cta: "Claim My Free 30 Days",
    rejectCta: "Continue To Cancel"
  },
  '50-percent-off': {
    title: "Half price until you start seeing returns",
    description: "Reduce your overhead by 50% while you build momentum and see results.",
    cta: "Get 2 Months 50% Off",
    rejectCta: "Continue To Cancel"
  },
  'park-protect': {
    title: "Pause your account for $29 and keep everything safe.",
    description: "Enjoy a complete 1-month subscription suspension on us. By parking your CC360 account, you can take a break from building your business on our platform without canceling your subscription. Rest assured, all your valuable information and progress on your site will be preserved for as long as you require it.",
    cta: "Park & Protect for $29",
    rejectCta: "Continue To Cancel"
  },
  'done-with-you-setup': {
    title: "Let's start over—personal 30-minute setup call with our best agent",
    description: "A senior specialist will set up funnels, emails, automations (& more) live with you for FREE. (Normally $100)",
    cta: "Claim My Free 1-on-1 (Normally $100)",
    rejectCta: "Continue To Cancel"
  },
  'priority-support': {
    title: "Last chance: 30 days free with guaranteed VIP support",
    description: "Experience our priority support for 30-days free that jumps every queue.",
    cta: "Claim My Free 30 Days",
    rejectCta: "Continue To Cancel"
  }
};

// ---------------------------------------------------------------------------
// REASON TO OFFER MAPPINGS
// ---------------------------------------------------------------------------

export const firstOfferMapping: Record<CancellationReason, OfferType> = {
  'no-time': 'done-for-you-buildout',
  'hard-to-learn': '30-day-extension',
  'no-sales-costly': '50-percent-off',
  'bugs-performance': '30-day-extension',
  'poor-service': 'done-with-you-setup',
  'missing-feature': '50-percent-off',
  'just-testing': '30-day-extension',
  'other': 'park-protect'
};

export const secondOfferMapping: Record<CancellationReason, OfferType> = {
  'no-time': '30-day-extension',
  'hard-to-learn': 'done-for-you-buildout',
  'no-sales-costly': 'park-protect',
  'bugs-performance': 'park-protect',
  'poor-service': 'priority-support',
  'missing-feature': '30-day-extension',
  'just-testing': 'done-for-you-buildout',
  'other': '30-day-extension'
};

// ---------------------------------------------------------------------------
// CANCELLATION REASONS
// ---------------------------------------------------------------------------

export const cancellationReasons: Array<{
  key: CancellationReason;
  label: string;
  requiresInput?: boolean;
}> = [
  { key: 'no-time', label: 'No time to use it' },
  { key: 'just-testing', label: 'I was just testing the platform' },
  { key: 'hard-to-learn', label: 'Hard To Learn / Too Complicated' },
  { key: 'no-sales-costly', label: 'No sales yet / too costly' },
  { key: 'bugs-performance', label: 'Bugs or performance issues' },
  { key: 'poor-service', label: 'Poor customer service' },
  { key: 'missing-feature', label: 'Missing a feature I need' },
  { key: 'other', label: 'Other (type in box)', requiresInput: true }
];

// ---------------------------------------------------------------------------
// STEP DEFINITIONS
// ---------------------------------------------------------------------------

export const steps: Record<StepID, Step> = {
  'loss-frame': {
    kind: 'loss-frame',
    id: 'loss-frame',
    next: () => 'reason-survey'
  },
  
  'reason-survey': {
    kind: 'reason-survey',
    id: 'reason-survey',
    next: (reason: CancellationReason) => 'tailored-offer'
  },
  
  'tailored-offer': {
    kind: 'tailored-offer',
    id: 'tailored-offer',
    offer: 'done-for-you-buildout', // Will be set dynamically
    next: (accepted: boolean) => accepted ? 'cancellation-confirmed' : 'second-chance-offer'
  },
  
  'second-chance-offer': {
    kind: 'second-chance-offer',
    id: 'second-chance-offer',
    offer: '30-day-extension', // Will be set dynamically
    next: (accepted: boolean) => accepted ? 'cancellation-confirmed' : 'goodbye'
  },
  
  'goodbye': {
    kind: 'goodbye',
    id: 'goodbye',
    next: () => 'cancellation-confirmed'
  },
  
  'cancellation-confirmed': {
    kind: 'cancellation-confirmed',
    id: 'cancellation-confirmed'
  }
};

// ---------------------------------------------------------------------------
// UTILITIES
// ---------------------------------------------------------------------------

export const ordered: StepID[] = [
  'loss-frame',
  'reason-survey',
  'tailored-offer',
  'second-chance-offer',
  'goodbye',
  'cancellation-confirmed'
];

export function getOfferForReason(reason: CancellationReason, isSecondChance: boolean): OfferType {
  return isSecondChance ? secondOfferMapping[reason] : firstOfferMapping[reason];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
