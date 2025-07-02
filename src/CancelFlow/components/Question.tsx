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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {prompt}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Select the option that best describes your situation
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <motion.button
              onClick={() => onSelect(option)}
              className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-lg shadow-blue-500/20 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100 dark:shadow-blue-400/20'
                  : 'border-zinc-200 bg-white text-zinc-900 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:hover:border-blue-500 dark:hover:bg-zinc-700/50'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selectedAnswer === option}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                <div
                  className={`h-5 w-5 rounded-full border-2 transition-all ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
                      : 'border-zinc-300 group-hover:border-blue-300 dark:border-zinc-600 dark:group-hover:border-blue-500'
                  }`}
                >
                  {selectedAnswer === option && (
                    <motion.div
                      className="h-full w-full rounded-full bg-white flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="h-3 w-3 text-blue-500 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
