// import React from "react";
import { CancelFlow } from './CancelFlow/CancelFlow'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-zinc-100 p-8 dark:bg-zinc-950">
          <h1 className="mb-8 text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100">
            Manage Subscription
          </h1>
          <CancelFlow />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
