import React from 'react'
import { motion } from 'framer-motion'
import { QuestionStep } from '../steps'

type Props = QuestionStep & {
  step: number
  onSelect: (option: string) => void
  feedback: Record<string, string>
}

export const Question: React.FC<Props> = ({
  prompt,
  options,
  onSelect,
  feedback,
  id,
}) => {
  const selectedAnswer = feedback[id]

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {prompt}
      </h2>
      <ul className="space-y-3">
        {options.map((o) => (
          <motion.li
            key={o}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button
              onClick={() => onSelect(o)}
              className={`w-full rounded-lg border p-3 text-left transition-all duration-200 ${
                selectedAnswer === o
                  ? 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-100'
                  : 'bg-zinc-50 text-zinc-900 hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-blue-400 dark:hover:bg-zinc-700'
              }`}
              aria-pressed={selectedAnswer === o}
            >
              {o}
            </button>
          </motion.li>
        ))}
      </ul>
    </>
  )
}
