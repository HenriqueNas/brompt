'use client'

import { Button } from '@/components/ui/Button'
import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiInformation2Line,
} from '@remixicon/react'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted &&
        createPortal(
          <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`flex min-w-75 items-center justify-between rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right-full ${
                  toast.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200'
                    : toast.type === 'error'
                      ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'
                      : 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200'
                }`}
              >
                <div className='flex items-center gap-3'>
                  {toast.type === 'success' && (
                    <RiCheckboxCircleLine className='text-xl' />
                  )}
                  {toast.type === 'error' && (
                    <RiErrorWarningLine className='text-xl' />
                  )}
                  {toast.type === 'info' && (
                    <RiInformation2Line className='text-xl' />
                  )}
                  <p className='text-sm font-medium'>{toast.message}</p>
                </div>
                <Button onClick={() => removeToast(toast.id)} variant='ghost'>
                  <RiCloseLine className='text-base' />
                </Button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
