import { useReducer, useEffect } from "react";
import { steps, Step } from "./steps";

type State = { idx: number; feedback: Record<string, string> };
type Action =
  | { type: "SELECT"; payload: string }
  | { type: "RESET" };

const persistKey = "cc360-cancel-flow";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT": {
      const step = steps[state.idx] as any;
      const nextIdx = step.transition(action.payload, state.feedback);
      return { idx: nextIdx, feedback: { ...state.feedback, [step.id]: action.payload } };
    }
    case "RESET":
      return { idx: 0, feedback: {} };
    default:
      return state;
  }
}

export function useCancelFlow() {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      return JSON.parse(localStorage.getItem(persistKey) || "") as State;
    } catch {
      return { idx: 0, feedback: {} };
    }
  });

  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(state));
  }, [state]);

  const current: Step = steps[state.idx];

  return {
    current,
    step: state.idx + 1,
    progress: { current: state.idx + 1, total: steps.length },
    feedback: state.feedback,
    select: (opt: string) => dispatch({ type: "SELECT", payload: opt }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
