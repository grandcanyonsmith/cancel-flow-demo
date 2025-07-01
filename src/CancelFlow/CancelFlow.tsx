import { motion } from 'framer-motion'
import { useCancelFlow } from './useCancelFlow'
import { Question } from './components/Question'
import { FinalComment } from './components/FinalComment'
import { FinalMessage } from './components/FinalMessage'
import { ProgressBar } from './components/ProgressBar'
import { useToast } from '../Toast'
import { useEffect, useRef } from 'react'

/* map of answers that contradict each other */
const contradictions: Record<string, string[]> = {
  'Not useful right now': ['Easy to use'],
  "Didn't see the value": ['Good value'],
  'Poor support': ['Helpful support'],
  'Missing features / hard to use': ['Easy to use'],
}

export const CancelFlow: React.FC = () => {
  const { current, feedback, progress, select, reset } = useCancelFlow()
  const toast = useToast()
  const lastFinalId = useRef<string | null>(null)

  const filtered =
    current.kind === 'question'
      ? current.options.filter((opt) => {
          const reason = feedback.reason
          return !(reason && contradictions[reason]?.includes(opt))
        })
      : []

  // fire toast on reaching a final step (canceled/paused)
  useEffect(() => {
    if (current.kind === 'final' && lastFinalId.current !== current.id) {
      toast(current.text)
      lastFinalId.current = current.id
    }
  }, [current, toast])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-10 w-full max-w-xl rounded-2xl border bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
    >
      {progress.total > 1 && <ProgressBar {...progress} />}

      {current.kind === 'question' && (
        <Question
          step={progress.current}
          {...current}
          options={filtered}
          onSelect={select}
          feedback={feedback}
        />
      )}

      {current.kind === 'comment' && (
        <FinalComment onSubmit={() => select('SUBMIT')} />
      )}

      {current.kind === 'final' && <FinalMessage text={current.text} />}

      <button
        onClick={reset}
        className="mt-6 text-sm text-zinc-400 hover:text-blue-600 hover:underline"
      >
        Never mind, I don't want to cancel.
      </button>
    </motion.div>
  )
}
