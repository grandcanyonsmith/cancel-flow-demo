import React, { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'

export const FinalComment: React.FC<{ onSubmit: () => void }> = ({
  onSubmit,
}) => {
  const [txt, setTxt] = useState('')
  const { showSuccess, showInfo } = useToast()

  const handleSubmit = () => {
    if (txt.trim()) {
      showSuccess('Thank you for your detailed feedback!')
    } else {
      showInfo('Proceeding without additional comments')
    }
    onSubmit()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Any final thoughts?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          Your feedback helps us improve our service for everyone
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            rows={5}
            placeholder="Share any additional feedback that might help us improve..."
            className="w-full resize-none rounded-xl border-2 border-zinc-200 bg-white p-4 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
          />
          <div className="absolute bottom-3 right-3 text-xs text-zinc-400 dark:text-zinc-500">
            {txt.length}/500
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Complete Cancellation</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </button>
        </div>

        {txt.trim() && (
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Thank you for taking the time to provide feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
