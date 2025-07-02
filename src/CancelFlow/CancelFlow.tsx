import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCancelFlow } from './useCancelFlow'
import { Question } from './components/Question'
import { FinalComment } from './components/FinalComment'
import { FinalMessage } from './components/FinalMessage'
import { ProgressBar } from './components/ProgressBar'
import { ConfettiEffect } from '../components/ConfettiEffect'
import { AnalyticsTracker, useAnalytics } from '../components/AnalyticsTracker'

/* map of answers that contradict each other */
const contradictions: Record<string, string[]> = {
  'Not useful right now': ['Easy to use'],
  "Didn't see the value": ['Good value'],
  'Poor support': ['Helpful support'],
  'Missing features / hard to use': ['Easy to use'],
}

export const CancelFlow: React.FC = () => {
  const { current, feedback, progress, select, reset } = useCancelFlow()
  const { track } = useAnalytics()
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSelect = (option: string) => {
    track('option_select', {
      stepId: current.kind === 'question' ? current.id : current.kind,
      option,
      stepType: current.kind,
    })

    select(option)

    // Show confetti for successful completion
    if (
      current.kind === 'question' &&
      current.id === 'pause' &&
      option === 'Pause my subscription'
    ) {
      setShowConfetti(true)
    }
  }

  const handleReset = () => {
    track('flow_reset', {
      currentStep: current.kind === 'question' ? current.id : current.kind,
      progress: progress.current,
    })
    reset()
  }

  const filtered =
    current.kind === 'question'
      ? current.options.filter((opt) => {
          const reason = feedback.reason
          return !(reason && contradictions[reason]?.includes(opt))
        })
      : []

  return (
    <>
      <AnalyticsTracker
        stepId={current.kind === 'question' ? current.id : current.kind}
        stepType={current.kind}
      />

      <ConfettiEffect
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-sm shadow-2xl dark:border-zinc-700/50 dark:bg-zinc-900/80 dark:shadow-2xl dark:shadow-black/20">
          {progress.total > 1 && (
            <div className="mb-8">
              <ProgressBar {...progress} />
            </div>
          )}

          <motion.div
            key={current.kind + (current.kind === 'question' ? current.id : '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {current.kind === 'question' && (
              <Question
                step={progress.current}
                {...current}
                options={filtered}
                onSelect={handleSelect}
                feedback={feedback}
              />
            )}

            {current.kind === 'comment' && (
              <FinalComment onSubmit={() => handleSelect('SUBMIT')} />
            )}

            {current.kind === 'final' && <FinalMessage text={current.text} />}
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleReset}
              className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-all duration-200 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Never mind, I don't want to cancel
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
