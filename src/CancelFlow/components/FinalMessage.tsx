import React from 'react'
import { motion } from 'framer-motion'

export const FinalMessage = ({ text }: { text: string }) => {
  const isPaused = text.includes('paused')

  return (
    <motion.div
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring', bounce: 0.4 }}
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
          isPaused
            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
            : 'bg-gradient-to-br from-green-400 to-emerald-500'
        }`}
      >
        {isPaused ? (
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </motion.div>

      <div>
        <motion.h2
          className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {text}
        </motion.h2>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-zinc-600 dark:text-zinc-400">
            A confirmation email is on its way.
          </p>

          {isPaused ? (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                ⏰ Your subscription will automatically resume in 2 months
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                You can reactivate anytime from your account settings
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-medium">
                ✓ Your subscription has been successfully canceled
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                You'll retain access until the end of your current billing
                period
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
