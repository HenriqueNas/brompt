'use client'

import { HistoryProvider } from '@/contexts/HistoryContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { ToastProvider } from '@/contexts/ToastContext'
import React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <HistoryProvider>
          <ToastProvider>{children}</ToastProvider>
        </HistoryProvider>
      </SettingsProvider>
    </LanguageProvider>
  )
}
