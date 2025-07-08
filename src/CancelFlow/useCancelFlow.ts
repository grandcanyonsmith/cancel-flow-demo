import { useReducer, useEffect } from 'react'
import { steps, ordered, Step, Feedback, StepID, UserData, CancellationReason, OfferType, getOfferForReason } from './steps'

type State = { at: StepID; feedback: Feedback; userData: UserData }
type Action =
  | { type: 'SELECT_REASON'; reason: CancellationReason | null; otherReason?: string }
  | { type: 'ACCEPT_OFFER'; offer: OfferType; isSecondChance: boolean }
  | { type: 'REJECT_OFFER'; offer: OfferType; isSecondChance: boolean }
  | { type: 'KEEP_ACCOUNT' }
  | { type: 'FINISH_CANCELLATION' }
  | { type: 'RESET' }

const persistKey = 'cc360-cancel-flow'

// Mock user data - in a real app, this would come from an API
const mockUserData: UserData = {
  first_name: 'Sarah',
  renewal_date: 'March 15, 2024',
  is_trial: false,
  trial_days_remaining: undefined
}

/* ------------------------------- reducer --------------------------------- */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_REASON': {
      if (action.reason === null) {
        // User clicked "Continue → Cancel" from loss frame
        return { ...state, at: 'reason-survey' }
      }
      
      // User selected a reason
      const newFeedback = { 
        ...state.feedback, 
        reason: action.reason,
        other_reason: action.otherReason
      }
      
      return {
        ...state,
        at: 'tailored-offer',
        feedback: newFeedback
      }
    }

    case 'ACCEPT_OFFER': {
      const newFeedback = { 
        ...state.feedback, 
        [action.isSecondChance ? 'second_offer_taken' : 'first_offer_taken']: true
      }
      
      return {
        ...state,
        at: 'cancellation-confirmed',
        feedback: newFeedback
      }
    }

    case 'REJECT_OFFER': {
      const newFeedback = { 
        ...state.feedback, 
        [action.isSecondChance ? 'second_offer_taken' : 'first_offer_taken']: false
      }
      
      if (action.isSecondChance) {
        // Second chance offer rejected, go to goodbye
        return {
          ...state,
          at: 'goodbye',
          feedback: newFeedback
        }
      } else {
        // First offer rejected, go to second chance
        return {
          ...state,
          at: 'second-chance-offer',
          feedback: newFeedback
        }
      }
    }

    case 'KEEP_ACCOUNT': {
      // User decided to keep account from loss frame
      // In a real app, this would trigger account retention logic
      console.log('Account retained!')
      return { ...state, at: 'cancellation-confirmed' }
    }

    case 'FINISH_CANCELLATION': {
      return { ...state, at: 'cancellation-confirmed' }
    }

    case 'RESET': {
      return { 
        at: 'loss-frame', 
        feedback: {},
        userData: mockUserData
      }
    }

    default:
      return state
  }
}

/* ------------------------------- hook ------------------------------------ */
const initializer = (): State => {
  try {
    const parsed = JSON.parse(localStorage.getItem(persistKey) || '') as State
    if (parsed?.at) {
      return {
        ...parsed,
        userData: mockUserData // Always use fresh user data
      }
    }
  } catch {
    // Fall through to default
  }
  
  return { 
    at: 'loss-frame', 
    feedback: {},
    userData: mockUserData
  }
}

export function useCancelFlow() {
  const [state, dispatch] = useReducer(reducer, undefined!, initializer)

  useEffect(() => {
    // Only persist flow state, not user data
    const persistData = {
      at: state.at,
      feedback: state.feedback
    }
    localStorage.setItem(persistKey, JSON.stringify(persistData))
  }, [state.at, state.feedback])

  const current = steps[state.at]
  const idx = ordered.indexOf(state.at)

  return {
    current,
    feedback: state.feedback,
    userData: state.userData,
    progress: { current: idx + 1, total: ordered.length },
    
    // Actions
    selectReason: (reason: CancellationReason | null, otherReason?: string) => 
      dispatch({ type: 'SELECT_REASON', reason, otherReason }),
    
    acceptOffer: (offer: OfferType, isSecondChance: boolean) => 
      dispatch({ type: 'ACCEPT_OFFER', offer, isSecondChance }),
    
    rejectOffer: (offer: OfferType, isSecondChance: boolean) => 
      dispatch({ type: 'REJECT_OFFER', offer, isSecondChance }),
    
    keepAccount: () => dispatch({ type: 'KEEP_ACCOUNT' }),
    
    finishCancellation: () => dispatch({ type: 'FINISH_CANCELLATION' }),
    
    reset: () => dispatch({ type: 'RESET' })
  }
}
