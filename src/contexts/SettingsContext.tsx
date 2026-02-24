'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

interface SettingsContextType {
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  toggleSettings: () => void
  apiKey: string
  setApiKey: (key: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')

  // Load from storage on mount
  useEffect(() => {
    const storedKey = storage.getItem<string>('gemini_api_key', '')
    if (storedKey) setApiKey(storedKey)
  }, [])

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev)

  // Update both state and storage
  const handleSetApiKey = (key: string) => {
    setApiKey(key)
    storage.setItem('gemini_api_key', key)
  }

  return (
    <SettingsContext.Provider
      value={{
        isSettingsOpen,
        openSettings,
        closeSettings,
        toggleSettings,
        apiKey,
        setApiKey: handleSetApiKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
