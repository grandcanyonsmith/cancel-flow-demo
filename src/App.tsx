import { CancelFlow } from './CancelFlow/CancelFlow'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-25 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27%23f1f5f9%27 stroke-width=%270.5%27%3e%3cpath d=%27m0 .5 32 32M32 .5 0 32%27/%3e%3c/svg%3e')] opacity-30 dark:opacity-5"></div>
          
          <div className="relative">
            <ThemeToggle />
            <AnalyticsDashboard />
            
            <div className="px-4 py-12 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-stripe">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
                    Manage Your Subscription
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                    We're sorry to see you considering leaving. Let us understand how we can improve and explore your options together.
                  </p>
                  
                  {/* Subtle decorative element */}
                  <div className="mt-8 flex justify-center">
                    <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-60"></div>
                  </div>
                </div>

                {/* Main Content */}
                <CancelFlow />
                
                {/* Trust indicators */}
                <div className="mt-16 text-center">
                  <div className="flex items-center justify-center space-x-8 text-gray-400 dark:text-gray-600">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Trusted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
