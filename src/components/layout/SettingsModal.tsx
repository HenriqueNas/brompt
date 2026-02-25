'use client'

import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/contexts/SettingsContext'
import { LLMProviderType } from '@/lib/llm/types'
import { RiCloseLine } from '@remixicon/react'
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
      <div className='w-full max-w-md rounded-lg bg-background p-6 shadow-xl dark:bg-background max-h-[90vh] overflow-y-auto border border-brand-20'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-heading-md font-semibold text-foreground'>
            {t('settings.title')}
          </h2>
          <Button onClick={onClose} variant='text' size='icon'>
            <RiCloseLine size={20} />
          </Button>
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
            <div className='p-3 bg-red-50 text-error text-sm rounded-md dark:bg-red-900/20'>
              {error}
            </div>
          )}
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <Button variant='ghost' onClick={onClose}>
            {t('settings.cancel')}
          </Button>
          <Button variant='solid' onClick={handleSave}>
            {t('settings.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
