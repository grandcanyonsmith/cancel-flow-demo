"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steps = exports.ordered = void 0;
/** Ordered sequence for the progress bar */
exports.ordered = [
    "reason",
    "praise",
    "pause",
    "chat",
    "comment",
    "canceled",
    "paused",
];
/** Maps (id → step definition) */
exports.steps = {
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
        next: function () { return "praise"; },
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
        next: function (answer, fb) {
            if (answer === "Many things – I’ll be back")
                return "pause";
            if (answer === "Helpful support")
                return "chat";
            return "comment";
        },
    },
    /* 2 ────────────────────────────────────────────────────────────────────── */
    pause: {
        kind: "question",
        id: "pause",
        prompt: "Since you’ll be back, how about we pause your subscription for 2 months?",
        options: ["Pause my subscription", "No, cancel"],
        next: function (answer) { return (answer === "Pause my subscription" ? "paused" : "comment"); },
    },
    /* 3 ────────────────────────────────────────────────────────────────────── */
    chat: {
        kind: "question",
        id: "chat",
        prompt: "Since you liked our support, can we chat a bit more about this?",
        options: ["Yes, let’s chat", "No, cancel"],
        next: function (answer) { return (answer === "Yes, let’s chat" ? "comment" : "canceled"); },
    },
    /* 4 ────────────────────────────────────────────────────────────────────── */
    comment: {
        kind: "comment",
        id: "comment",
        next: function () { return "canceled"; },
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
