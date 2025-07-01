import { cancelFlowReducer } from './useCancelFlow'
import { StepID } from './steps'
import { describe, it, expect } from 'vitest'

describe('Cancel flow paths', () => {
  function runPath(answers: string[]): StepID {
    let state = { at: 'reason' as StepID, feedback: {} as Record<string, string> }

    for (const ans of answers) {
      state = cancelFlowReducer(state, { type: 'SELECT', answer: ans })
    }
    return state.at
  }

  it('pause subscription path ends at paused', () => {
    const final = runPath([
      "Not useful right now", // reason -> praise
      "Many things – I'll be back", // praise -> pause
      "Pause my subscription", // pause -> paused
    ])
    expect(final).toBe('paused')
  })

  it('pause -> cancel path ends at canceled', () => {
    const final = runPath([
      "Didn't see the value", // reason
      "Many things – I'll be back", // praise -> pause
      "No, cancel", // pause -> comment
      "SUBMIT", // comment -> canceled
    ])
    expect(final).toBe('canceled')
  })

  it('chat -> cancel path direct ends at canceled', () => {
    const final = runPath([
      "Poor support", // reason
      "Helpful support", // praise -> chat
      "No, cancel", // chat -> canceled
    ])
    expect(final).toBe('canceled')
  })

  it('chat -> comment -> canceled path', () => {
    const final = runPath([
      "Missing features / hard to use", // reason
      "Helpful support", // praise -> chat
      "Yes, let's chat", // chat -> comment
      "SUBMIT", // comment -> canceled
    ])
    expect(final).toBe('canceled')
  })

  it('simple comment path', () => {
    const final = runPath([
      "Other", // reason
      "Good value", // praise -> comment
      "SUBMIT", // comment -> canceled
    ])
    expect(final).toBe('canceled')
  })
})