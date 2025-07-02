import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalytics } from './AnalyticsTracker'

export const AnalyticsDashboard: React.FC = () => {
  const { getAnalytics, clear } = useAnalytics()
  const [isOpen, setIsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(getAnalytics())

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getAnalytics())
    }, 1000)

    return () => clearInterval(interval)
  }, [getAnalytics])

  const StatCard: React.FC<{
    title: string
    value: string | number
    icon: string
  }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
        title="Analytics Dashboard"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {/* Dashboard Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  📊 Analytics Dashboard
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      clear()
                      setAnalytics(getAnalytics())
                    }}
                    className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Clear Data
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    title="Total Events"
                    value={analytics.totalEvents}
                    icon="📈"
                  />
                  <StatCard
                    title="Step Views"
                    value={analytics.stepViews}
                    icon="👁️"
                  />
                  <StatCard
                    title="Selections"
                    value={analytics.optionSelects}
                    icon="🎯"
                  />
                  <StatCard
                    title="Completions"
                    value={analytics.flowCompletions}
                    icon="✅"
                  />
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <StatCard
                    title="Completion Rate"
                    value={`${analytics.completionRate}%`}
                    icon="🏆"
                  />
                  <StatCard
                    title="Avg Session (s)"
                    value={analytics.averageSessionDuration}
                    icon="⏱️"
                  />
                  <StatCard
                    title="Theme Toggles"
                    value={analytics.themeToggles}
                    icon="🌓"
                  />
                </div>

                {/* Most Selected Options */}
                {analytics.mostSelectedOptions.length > 0 && (
                  <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                      🎯 Most Selected Options
                    </h3>
                    <div className="space-y-3">
                      {analytics.mostSelectedOptions.map(
                        ({ option, count }, index) => (
                          <div
                            key={option}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-zinc-900 dark:text-zinc-100">
                                {option}
                              </span>
                            </div>
                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                              {count}x
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {analytics.totalEvents === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      No Analytics Data Yet
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Start using the cancel flow to see analytics data here.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
