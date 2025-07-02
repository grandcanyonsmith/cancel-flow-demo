import { CancelFlow } from './CancelFlow/CancelFlow'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
          <ThemeToggle />
          <AnalyticsDashboard />
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent mb-4">
                Manage Subscription
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                We're sorry to see you go. Help us understand how we can improve
                and explore your options.
              </p>
            </div>
            <CancelFlow />
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
