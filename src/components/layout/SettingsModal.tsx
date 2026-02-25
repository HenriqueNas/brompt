'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/contexts/SettingsContext'
import { LLMProviderType } from '@/lib/llm/types'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApiKeyField } from '../settings/ApiKeyField'
import { LanguageSelect } from '../settings/LanguageSelect'
import { ProviderSelect } from '../settings/ProviderSelect'
import { SecuritySection } from '../settings/SecuritySection'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t, language, setLanguage } = useLanguage()
  const {
    apiKeys,
    setApiKey,
    selectedProvider,
    setSelectedProvider,
    hasEncryptedKeys,
    resetKeys,
  } = useSettings()

  const [localKeys, setLocalKeys] = useState<Record<string, string>>({})
  const [localProvider, setLocalProvider] = useState<LLMProviderType>('gemini')

  const [newPassphrase, setNewPassphrase] = useState('')
  const [confirmPassphrase, setConfirmPassphrase] = useState('')
  const [error, setError] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLocalKeys(apiKeys)
      setLocalProvider(selectedProvider)
      setNewPassphrase('')
      setConfirmPassphrase('')
      setError('')
      setShowResetConfirm(false)
    }
  }, [isOpen, apiKeys, selectedProvider])

  const handleSave = async () => {
    setError('')

    // Validation
    if (!hasEncryptedKeys) {
      const anyKeySet = Object.values(localKeys).some((k) => k && k.length > 0)

      if (anyKeySet) {
        if (!newPassphrase) {
          setError(
            t('settings.passphrase_required') ||
              'Passphrase is required to secure your keys'
          )
          return
        }
        if (newPassphrase !== confirmPassphrase) {
          setError(
            t('settings.passphrase_mismatch') || 'Passphrases do not match'
          )
          return
        }
        if (newPassphrase.length < 4) {
          setError(
            t('settings.passphrase_too_short') ||
              'Passphrase must be at least 4 characters'
          )
          return
        }
      }
    }

    // Save keys
    const providers = Object.keys(localKeys) as LLMProviderType[]
    const pass = newPassphrase || undefined

    // If setting up encryption for the first time, re-save all non-empty keys
    if (!hasEncryptedKeys && pass) {
      for (const provider of providers) {
        if (localKeys[provider]) {
          await setApiKey(provider, localKeys[provider], pass)
        }
      }
    } else {
      // Otherwise only save changed keys
      for (const provider of providers) {
        if (localKeys[provider] !== apiKeys[provider]) {
          await setApiKey(provider, localKeys[provider])
        }
      }
    }

    // Save selected provider
    if (localProvider !== selectedProvider) {
      setSelectedProvider(localProvider)
    }

    onClose()
  }

  const handleReset = () => {
    resetKeys()
    setLocalKeys({})
    setShowResetConfirm(false)
    // Don't close, let them start over
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
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className='text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          >
            <X size={24} />
          </button>
        </div>

        <div className='space-y-6'>
          <ProviderSelect
            value={localProvider}
            onChange={(v) => setLocalProvider(v)}
            label={t('settings.provider_label')}
          />

          <ApiKeyField
            label={t(getProviderLabelKey(localProvider))}
            value={localKeys[localProvider] || ''}
            onChange={(v) =>
              setLocalKeys((prev) => ({
                ...prev,
                [localProvider]: v,
              }))
            }
            placeholder={getPlaceholder(localProvider)}
          />

          <SecuritySection
            hasEncryptedKeys={hasEncryptedKeys}
            newPassphrase={newPassphrase}
            setNewPassphrase={setNewPassphrase}
            confirmPassphrase={confirmPassphrase}
            setConfirmPassphrase={setConfirmPassphrase}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
            handleReset={handleReset}
            t={t}
          />

          <LanguageSelect
            value={language}
            onChange={(v) => setLanguage(v)}
            label={t('settings.language_label')}
          />

          {error && (
            <div className='p-3 bg-red-50 text-red-600 text-sm rounded-md dark:bg-red-900/20 dark:text-red-400'>
              {error}
            </div>
          )}
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
