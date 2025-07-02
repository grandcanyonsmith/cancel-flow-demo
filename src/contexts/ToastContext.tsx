import React, { createContext, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from './ThemeContext'

type ToastContextType = {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showLoading: (message: string) => string
  dismissToast: (toastId: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme()

  const getThemeStyles = () => {
    return theme === 'dark'
      ? {
          background: '#18181b', // zinc-900
          color: '#f4f4f5', // zinc-100
          border: '1px solid #3f3f46', // zinc-700
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        }
      : {
          background: '#ffffff', // white
          color: '#18181b', // zinc-900
          border: '1px solid #e4e4e7', // zinc-200
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: theme === 'dark' ? '#22c55e' : '#16a34a',
        secondary: theme === 'dark' ? '#18181b' : '#ffffff',
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
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: theme === 'dark' ? '#f87171' : '#dc2626',
        secondary: theme === 'dark' ? '#18181b' : '#ffffff',
      },
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      duration: 2500,
      position: 'top-center',
      icon: '💡',
      style: {
        ...getThemeStyles(),
        borderLeft: `4px solid ${theme === 'dark' ? '#60a5fa' : '#2563eb'}`, // blue accent
        fontWeight: '500',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        maxWidth: '400px',
      },
    })
  }

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        ...getThemeStyles(),
        borderLeft: `4px solid ${theme === 'dark' ? '#f59e0b' : '#d97706'}`, // amber accent
        fontWeight: '500',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        maxWidth: '400px',
      },
    })
  }

  const dismissToast = (toastId: string) => {
    toast.dismiss(toastId)
  }

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showLoading,
        dismissToast,
      }}
    >
      {children}
      <Toaster
        toastOptions={{
          style: getThemeStyles(),
          duration: 3000,
        }}
        containerStyle={{
          top: 20,
        }}
      />
    </ToastContext.Provider>
  )
}

// Separate the hook export to fix React Fast Refresh warning
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
