import React, { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

type ToastContextType = {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
      },
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
      },
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      duration: 2500,
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
      },
    })
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}