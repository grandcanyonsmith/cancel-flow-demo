import { useReducer, useEffect } from 'react'
import { steps, ordered, Step, Feedback, StepID, QuestionStep } from './steps'

type State = { at: StepID; feedback: Feedback }
type Action =
  | { type: 'SELECT'; answer: string }
  | { type: 'RESET' }

const persistKey = 'cc360-cancel-flow'

/* ------------------------------- reducer --------------------------------- */
export function cancelFlowReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT': {
      const step: Step = steps[state.at]

      // Question step
      if (step.kind === 'question') {
        const nextId = (step as QuestionStep).next(
          action.answer,
          state.feedback
        ) as StepID
        return {
          at: nextId,
          feedback: { ...state.feedback, [step.id]: action.answer },
        }
      }

      // Comment step – we ignore the answer value and just move to next
      if (step.kind === 'comment') {
        const nextId = step.next() as StepID
        return { at: nextId, feedback: state.feedback }
      }

      // For final steps, remain (no further steps)
      return state
    }

    case 'RESET':
      return { at: 'reason', feedback: {} }

    default:
      return state
  }
}

/* ------------------------------- hook ------------------------------------ */
const initializer = (): State => {
  try {
    const parsed = JSON.parse(localStorage.getItem(persistKey) || '') as State
    return parsed?.at ? parsed : { at: 'reason', feedback: {} }
  } catch {
    return { at: 'reason', feedback: {} }
  }
}

export function useCancelFlow() {
  const [state, dispatch] = useReducer(cancelFlowReducer, undefined!, initializer)

  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(state))
  }, [state])

  const current = steps[state.at]
  const idx = ordered.indexOf(state.at)

  return {
    current,
    feedback: state.feedback,
    progress: { current: idx + 1, total: ordered.length },
    select: (answer: string) => dispatch({ type: 'SELECT', answer }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
