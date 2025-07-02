import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'

export const FinalComment: React.FC<{ onSubmit: () => void }> = ({
  onSubmit,
}) => {
  const [txt, setTxt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSuccess, showInfo } = useToast()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (txt.trim()) {
      showSuccess('Thank you for your detailed feedback!')
    } else {
      showInfo('Proceeding without additional comments')
    }
    
    setIsSubmitting(false)
    onSubmit()
  }

  const charCount = txt.length
  const maxChars = 500
  const isNearLimit = charCount > maxChars * 0.8

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Any final thoughts?
        </h2>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium px-2">
            Your feedback helps us improve our service for everyone
          </p>
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Textarea Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative">
            <textarea
              value={txt}
              onChange={(e) => setTxt(e.target.value.slice(0, maxChars))}
              rows={5}
              placeholder="Share any additional feedback that might help us improve..."
              disabled={isSubmitting}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/10 backdrop-blur-sm shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {/* Character counter */}
            <motion.div 
              className={`absolute bottom-4 right-4 text-xs font-medium transition-colors duration-200 ${
                isNearLimit 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              animate={{ scale: isNearLimit ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {charCount}/{maxChars}
            </motion.div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-semibold text-white shadow-stripe transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-stripe-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {/* Button background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center justify-center gap-3">
            {isSubmitting ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Complete Cancellation</span>
                <motion.svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </motion.svg>
              </>
            )}
          </div>
        </motion.button>

        {/* Feedback appreciation */}
        {txt.trim() && (
          <motion.div
            className="rounded-2xl bg-gradient-to-r from-primary-50 to-primary-100/50 p-4 border border-primary-200/50 dark:from-primary-900/20 dark:to-primary-800/10 dark:border-primary-800/50"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                Thank you for taking the time to provide feedback!
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
