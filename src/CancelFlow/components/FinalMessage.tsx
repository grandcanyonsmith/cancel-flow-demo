import React from 'react'
import { motion } from 'framer-motion'

export const FinalMessage = ({ text }: { text: string }) => {
  const isPaused = text.includes('paused')

  return (
    <motion.div
      className="text-center space-y-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Icon Section */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.2, 
          duration: 0.8, 
          type: 'spring', 
          stiffness: 200,
          damping: 20
        }}
        className="relative"
      >
        <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center shadow-stripe-lg ${
          isPaused
            ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500'
            : 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-500'
        }`}>
          {/* Icon glow effect */}
          <div className={`absolute inset-0 rounded-3xl opacity-30 blur-xl ${
            isPaused ? 'bg-amber-400' : 'bg-emerald-400'
          }`}></div>
          
          <div className="relative">
            {isPaused ? (
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <motion.svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </div>
        </div>
      </motion.div>

      {/* Text Section */}
      <div className="space-y-4">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {text}
        </motion.h2>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            A confirmation email is on its way.
          </p>

          {isPaused ? (
            <motion.div 
              className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/50 shadow-soft"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-amber-800 dark:text-amber-200 font-semibold text-base">
                    Your subscription will automatically resume in 2 months
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    You can reactivate anytime from your account settings
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/50 dark:border-emerald-800/50 shadow-soft"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-emerald-800 dark:text-emerald-200 font-semibold text-base">
                    Your subscription has been successfully canceled
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                    You'll retain access until the end of your current billing period
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
