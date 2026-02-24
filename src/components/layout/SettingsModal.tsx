'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/contexts/SettingsContext'
import { PROVIDER_REGISTRY } from '@/lib/llm/registry'
import { LLMProviderType } from '@/lib/llm/types'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t, language, setLanguage } = useLanguage()
  const { apiKeys, setApiKey, selectedProvider, setSelectedProvider } =
    useSettings()

  const [localKeys, setLocalKeys] = useState<Record<string, string>>({})
  const [localProvider, setLocalProvider] = useState<LLMProviderType>('gemini')

  useEffect(() => {
    if (isOpen) {
      setLocalKeys(apiKeys)
      setLocalProvider(selectedProvider)
    }
  }, [isOpen, apiKeys, selectedProvider])

  const handleSave = () => {
    // Save keys
    Object.keys(localKeys).forEach((provider) => {
      if (localKeys[provider] !== apiKeys[provider]) {
        setApiKey(provider, localKeys[provider])
      }
    })

    // Save selected provider
    if (localProvider !== selectedProvider) {
      setSelectedProvider(localProvider)
    }

    onClose()
  }

  if (!isOpen) return null

  const getProviderLabelKey = (provider: string) => {
    switch (provider) {
      case 'gemini':
        return 'settings.gemini_key_label'
      case 'openai':
        return 'settings.openai_key_label'
      case 'anthropic':
        return 'settings.anthropic_key_label'
      case 'mistral':
        return 'settings.mistral_key_label'
      case 'groq':
        return 'settings.groq_key_label'
      default:
        return 'settings.api_key_placeholder'
    }
  }

  // Helper for placeholder
  const getPlaceholder = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'sk-...'
      case 'anthropic':
        return 'sk-ant-...'
      case 'gemini':
        return 'AIzaSy...'
      case 'mistral':
        return '...'
      case 'groq':
        return 'gsk_...'
      default:
        return '...'
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className='text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          >
            <X size={24} />
          </button>
        </div>

        <div className='space-y-4'>
          {/* Provider Selection */}
          <div>
            <label
              htmlFor='provider-select'
              className='mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              {t('settings.provider_label')}
            </label>
            <select
              id='provider-select'
              value={localProvider}
              onChange={(e) =>
                setLocalProvider(e.target.value as LLMProviderType)
              }
              className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
            >
              {PROVIDER_REGISTRY.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label
              htmlFor='api-key-input'
              className='mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              {t(getProviderLabelKey(localProvider))}
            </label>
            <input
              id='api-key-input'
              type='password'
              value={localKeys[localProvider] || ''}
              onChange={(e) =>
                setLocalKeys((prev) => ({
                  ...prev,
                  [localProvider]: e.target.value,
                }))
              }
              placeholder={getPlaceholder(localProvider)}
              className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
            />
          </div>

          {/* Language Selection */}
          <div>
            <label
              htmlFor='language-select'
              className='mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              {t('settings.language_label')}
            </label>
            <select
              id='language-select'
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'pt')}
              className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
            >
              <option value='en'>English</option>
              <option value='pt'>Português</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
          >
            {t('settings.cancel')}
          </button>
          <button
            onClick={handleSave}
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            {t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
