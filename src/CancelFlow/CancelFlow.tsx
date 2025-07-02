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
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          staggerChildren: 0.1
        }}
        className="mx-auto w-full max-w-2xl"
      >
        {/* Main Card */}
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-25 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl transform rotate-1 opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-25 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl transform -rotate-1 opacity-30"></div>
          
          {/* Main Container */}
          <div className="relative rounded-3xl border border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-stripe-lg dark:border-gray-700/50 dark:bg-gray-900/95 dark:shadow-2xl overflow-hidden">
            {/* Header Accent */}
            <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500"></div>
            
            <div className="p-8 sm:p-10">
              {/* Progress Section */}
              {progress.total > 1 && (
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ProgressBar {...progress} />
                </motion.div>
              )}

              {/* Content Section */}
              <motion.div
                key={current.kind + (current.kind === 'question' ? current.id : '')}
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 
                }}
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

              {/* Reset Section */}
              <motion.div
                className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center">
                  <motion.button
                    onClick={handleReset}
                    className="group inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 transition-all duration-300 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.svg
                      className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </motion.svg>
                    <span>Never mind, I don't want to cancel</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
