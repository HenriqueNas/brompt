'use client'

import { LLMProviderType } from '@/lib/llm/types'
import { storage, StorageKey } from '@/lib/storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface SettingsContextType {
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  toggleSettings: () => void
  apiKeys: Record<LLMProviderType, string>
  setApiKey: (provider: LLMProviderType, key: string) => void
  selectedProvider: LLMProviderType
  setSelectedProvider: (provider: LLMProviderType) => void
  apiKey: string
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

const STORAGE_KEY_MAP: Record<LLMProviderType, StorageKey> = {
  gemini: 'gemini_api_key',
  openai: 'openai_api_key',
  anthropic: 'anthropic_api_key',
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedProvider, setSelectedProviderState] =
    useState<LLMProviderType>('gemini')
  const [apiKeys, setApiKeys] = useState<Record<LLMProviderType, string>>({
    gemini: '',
    openai: '',
    anthropic: '',
  })

  // Load from storage on mount
  useEffect(() => {
    const gemini = storage.getItem<string>('gemini_api_key', '')
    const openai = storage.getItem<string>('openai_api_key', '')
    const anthropic = storage.getItem<string>('anthropic_api_key', '')
    const provider = storage.getItem<LLMProviderType>(
      'selected_provider',
      'gemini'
    )

    setApiKeys({ gemini, openai, anthropic })
    setSelectedProviderState(provider)
  }, [])

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev)

  // Update both state and storage
  const handleSetApiKey = (provider: LLMProviderType, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }))
    storage.setItem(STORAGE_KEY_MAP[provider], key)
  }

  const handleSetSelectedProvider = (provider: LLMProviderType) => {
    setSelectedProviderState(provider)
    storage.setItem('selected_provider', provider)
  }

  return (
    <SettingsContext.Provider
      value={{
        isSettingsOpen,
        openSettings,
        closeSettings,
        toggleSettings,
        apiKeys,
        setApiKey: handleSetApiKey,
        selectedProvider,
        setSelectedProvider: handleSetSelectedProvider,
        apiKey: apiKeys[selectedProvider],
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
