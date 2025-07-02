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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {prompt}
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium px-3">
            Select the option that best describes your situation
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
        </div>
      </motion.div>

      {/* Options List */}
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option
          
          return (
            <motion.div
              key={option}
              variants={itemVariants}
              layout
            >
              <motion.button
                onClick={() => onSelect(option)}
                className={`group relative w-full rounded-2xl border p-6 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-900 shadow-stripe dark:border-primary-400 dark:from-primary-900/30 dark:to-primary-800/20 dark:text-primary-100'
                    : 'border-gray-200 bg-white/80 text-gray-900 hover:border-primary-300 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-white hover:shadow-medium backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 dark:hover:border-primary-500 dark:hover:from-gray-800/80 dark:hover:to-gray-700/50'
                }`}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                aria-pressed={isSelected}
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 transition-opacity duration-300 ${
                  isSelected 
                    ? 'from-primary-500/10 to-primary-600/5 opacity-100' 
                    : 'from-primary-500/5 to-transparent group-hover:opacity-100'
                }`} />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <span className="font-semibold text-base leading-relaxed">
                      {option}
                    </span>
                  </div>
                  
                  {/* Custom Radio Button */}
                  <div className="flex-shrink-0">
                    <div
                      className={`relative w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500 shadow-sm dark:border-primary-400 dark:bg-primary-400'
                          : 'border-gray-300 bg-white group-hover:border-primary-400 group-hover:shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:group-hover:border-primary-500'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30,
                            delay: 0.1 
                          }}
                        >
                          <motion.svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <motion.path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        </motion.div>
                      )}
                      
                      {/* Ripple effect */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary-400 dark:border-primary-300"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Selection indicator line */}
                {isSelected && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-l-2xl"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                )}
              </motion.button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
