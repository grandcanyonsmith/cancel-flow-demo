import React, { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from './ThemeContext'

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

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme()

  const getThemeStyles = () => {
    return theme === 'dark'
      ? {
          background: '#27272a', // zinc-800
          color: '#f4f4f5', // zinc-100
          border: '1px solid #3f3f46', // zinc-700
        }
      : {
          background: '#ffffff', // white
          color: '#18181b', // zinc-900
          border: '1px solid #e4e4e7', // zinc-200
        }
  }

  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        ...getThemeStyles(),
        borderLeft: `4px solid ${theme === 'dark' ? '#22c55e' : '#16a34a'}`, // green accent
        fontWeight: '500',
      },
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        ...getThemeStyles(),
        borderLeft: `4px solid ${theme === 'dark' ? '#f87171' : '#dc2626'}`, // red accent
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
        ...getThemeStyles(),
        borderLeft: `4px solid ${theme === 'dark' ? '#60a5fa' : '#2563eb'}`, // blue accent
        fontWeight: '500',
      },
    })
  }

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Toaster
        toastOptions={{
          style: getThemeStyles(),
        }}
      />
    </ToastContext.Provider>
  )
}
