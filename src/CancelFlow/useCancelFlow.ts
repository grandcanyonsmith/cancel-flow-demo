import { useReducer, useEffect } from 'react'
import { steps, ordered, Step, Feedback, StepID, QuestionStep } from './steps'
import { useToast } from '../contexts/ToastContext'
import { validateFlowPaths } from './flowValidation'

type State = { at: StepID; feedback: Feedback }
type Action = { type: 'SELECT'; answer: string } | { type: 'RESET' }

const persistKey = 'cc360-cancel-flow'

/* ------------------------------- reducer --------------------------------- */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT': {
      const step: Step = steps[state.at]

      // only QuestionStep has `.next`
      if (step.kind === 'question') {
        try {
          const nextId = (step as QuestionStep).next(
            action.answer,
            state.feedback,
          ) as StepID

          // Validate that the next step exists
          if (!steps[nextId]) {
            console.error(`Invalid next step: ${nextId}`)
            return state // Stay in current state if next step is invalid
          }

          return {
            at: nextId,
            feedback: { ...state.feedback, [step.id]: action.answer },
          }
        } catch (error) {
          console.error('Error in step transition:', error)
          return state // Stay in current state on error
        }
      }

      // if somehow SELECT is dispatched on final/comment, stay put
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
    // Validate that the stored step still exists
    if (parsed?.at && steps[parsed.at]) {
      return parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored cancel flow state:', error)
  }
  return { at: 'reason', feedback: {} }
}

export function useCancelFlow() {
  const [state, dispatch] = useReducer(reducer, undefined!, initializer)
  const { showSuccess, showError, showInfo, showLoading, dismissToast } =
    useToast()

  // Validate flow paths on initialization
  useEffect(() => {
    const validation = validateFlowPaths()

    if (!validation.isValid) {
      console.error('Flow validation errors:', validation.errors)
      showError('Flow configuration error detected')
    }

    if (validation.warnings.length > 0) {
      console.warn('Flow validation warnings:', validation.warnings)
    }
  }, [showError])

  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(state))
  }, [state])

  const current = steps[state.at]
  const idx = ordered.indexOf(state.at)

  const select = (answer: string) => {
    const currentStep = steps[state.at]

    if (!currentStep) {
      showError('Invalid step state')
      return
    }

    // Show loading state for transitions
    const loadingToast = showLoading('Processing your selection...')

    if (currentStep.kind === 'question') {
      try {
        const nextId = (currentStep as QuestionStep).next(
          answer,
          state.feedback,
        )

        // Validate next step exists
        if (!steps[nextId]) {
          dismissToast(loadingToast)
          showError('Invalid flow configuration')
          return
        }

        // Dismiss loading toast after a short delay to show progress
        setTimeout(() => {
          dismissToast(loadingToast)

          // Show contextual feedback based on the selection and next step
          if (currentStep.id === 'reason') {
            showInfo(`Feedback recorded: "${answer}"`)
          } else if (currentStep.id === 'praise') {
            if (answer === "Many things – I'll be back") {
              showInfo('Great! Let us explore pausing your subscription')
            } else if (answer === 'Helpful support') {
              showInfo('We would love to chat more about this!')
            } else {
              showInfo('Thank you for the feedback')
            }
          } else if (currentStep.id === 'pause') {
            if (answer === 'Pause my subscription') {
              showSuccess('Subscription paused for 2 months!')
            } else {
              showInfo('Proceeding with cancellation')
            }
          } else if (currentStep.id === 'chat') {
            if (answer === "Yes, let's chat") {
              showInfo('We will connect you with our support team')
            } else {
              showInfo('Proceeding with cancellation')
            }
          }

          // Show final completion toasts
          if (nextId === 'canceled') {
            setTimeout(
              () => showSuccess('Subscription canceled successfully'),
              500,
            )
          } else if (nextId === 'paused') {
            setTimeout(
              () => showSuccess('Subscription paused successfully'),
              500,
            )
          }
        }, 800)
      } catch (error) {
        dismissToast(loadingToast)
        console.error('Error processing selection:', error)
        showError('An error occurred processing your selection')
        return
      }
    } else if (currentStep.kind === 'comment') {
      // Show completion toast when submitting comment (which leads to canceled)
      setTimeout(() => {
        dismissToast(loadingToast)
        showSuccess(
          'Thank you for your feedback! Subscription canceled successfully',
        )
      }, 800)
    }

    // Dispatch the action after a short delay to allow for smooth transitions
    setTimeout(() => {
      dispatch({ type: 'SELECT', answer })
    }, 300)
  }

  const reset = () => {
    showInfo('Flow reset - starting over')
    dispatch({ type: 'RESET' })
  }

  return {
    current,
    feedback: state.feedback,
    progress: { current: idx + 1, total: ordered.length },
    select,
    reset,
  }
}
