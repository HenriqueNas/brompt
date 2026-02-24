'use client'

import { PROVIDER_REGISTRY } from '@/lib/llm/registry'
import { LLMProviderType } from '@/lib/llm/types'
import { storage, StorageKey } from '@/lib/storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface SettingsContextType {
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  toggleSettings: () => void
  apiKeys: Record<string, string>
  setApiKey: (provider: LLMProviderType, key: string) => void
  selectedProvider: LLMProviderType
  setSelectedProvider: (provider: LLMProviderType) => void
  selectedModel: string
  setSelectedModel: (modelId: string) => void
  apiKey: string
  availableModels: { id: string; displayName: string }[]
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

const STORAGE_KEY_MAP: Record<string, StorageKey> = {
  gemini: 'gemini_api_key',
  openai: 'openai_api_key',
  anthropic: 'anthropic_api_key',
  mistral: 'mistral_api_key',
  groq: 'groq_api_key',
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedProvider, setSelectedProviderState] =
    useState<LLMProviderType>('gemini')
  const [selectedModel, setSelectedModelState] = useState<string>('')

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    gemini: '',
    openai: '',
    anthropic: '',
    mistral: '',
    groq: '',
  })

  // Load from storage on mount
  useEffect(() => {
    const gemini = storage.getItem<string>('gemini_api_key', '')
    const openai = storage.getItem<string>('openai_api_key', '')
    const anthropic = storage.getItem<string>('anthropic_api_key', '')
    const mistral = storage.getItem<string>('mistral_api_key', '')
    const groq = storage.getItem<string>('groq_api_key', '')

    const provider = storage.getItem<LLMProviderType>(
      'selected_provider',
      'gemini'
    )

    // Get stored model or default to first model of selected provider
    const storedModel = storage.getItem<string>('selected_model', '')

    setApiKeys({ gemini, openai, anthropic, mistral, groq })
    setSelectedProviderState(provider)

    // Validate or set default model
    const providerConfig = PROVIDER_REGISTRY.find((p) => p.id === provider)
    if (providerConfig) {
      const isValidModel = providerConfig.models.some(
        (m) => m.id === storedModel
      )
      if (isValidModel) {
        setSelectedModelState(storedModel)
      } else {
        setSelectedModelState(providerConfig.models[0]?.id || '')
      }
    }
  }, [])

  // Validate and default model when provider changes
  useEffect(() => {
    const providerConfig = PROVIDER_REGISTRY.find(
      (p) => p.id === selectedProvider
    )
    if (providerConfig) {
      const isValidModel = providerConfig.models.some(
        (m) => m.id === selectedModel
      )
      if (!isValidModel && providerConfig.models.length > 0) {
        const defaultModel = providerConfig.models[0].id
        setSelectedModelState(defaultModel)
        storage.setItem('selected_model', defaultModel)
      } else if (!isValidModel) {
        setSelectedModelState('')
        storage.setItem('selected_model', '')
      }
    }
  }, [selectedProvider, selectedModel])

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev)

  // Update both state and storage
  const handleSetApiKey = (provider: LLMProviderType, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }))
    if (STORAGE_KEY_MAP[provider]) {
      storage.setItem(STORAGE_KEY_MAP[provider], key)
    }
  }

  const handleSetSelectedProvider = (provider: LLMProviderType) => {
    setSelectedProviderState(provider)
    storage.setItem('selected_provider', provider)
  }

  const handleSetSelectedModel = (modelId: string) => {
    setSelectedModelState(modelId)
    storage.setItem('selected_model', modelId)
  }

  // Derived state
  const currentProviderConfig = PROVIDER_REGISTRY.find(
    (p) => p.id === selectedProvider
  )
  const availableModels = currentProviderConfig?.models || []

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
        selectedModel,
        setSelectedModel: handleSetSelectedModel,
        apiKey: apiKeys[selectedProvider as string] || '',
        availableModels,
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
