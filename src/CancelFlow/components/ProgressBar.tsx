import React from 'react'
import { motion } from 'framer-motion'

export const ProgressBar: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => {
  const percentage = (current / total) * 100

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-primary-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Progress
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Step {current} of {total}
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner">
          {/* Background shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
          
          {/* Progress Bar */}
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 shadow-sm relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: 0.8, 
              ease: [0.23, 1, 0.32, 1],
              delay: 0.1 
            }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
            
            {/* Moving highlight */}
            {percentage > 0 && (
              <motion.div
                className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1 
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Progress indicators */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center h-2 pointer-events-none">
          {Array.from({ length: total }, (_, index) => (
            <motion.div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index < current
                  ? 'bg-white shadow-sm'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Percentage indicator */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {Math.round(percentage)}% complete
        </span>
      </motion.div>
    </div>
  )
}
