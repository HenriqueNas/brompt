import { PROVIDER_REGISTRY } from '@/lib/llm/registry'
import { LLMProviderType } from '@/lib/llm/types'
import { encrypt, decrypt, isEncrypted } from '@/lib/crypto'
import { storage } from '@/lib/storage'
import { STORAGE_KEY_MAP } from './constants'
import { useEffect, useState } from 'react'

export function useSettingsController() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedProvider, setSelectedProviderState] =
    useState<LLMProviderType>('gemini')
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    gemini: '',
    openai: '',
    anthropic: '',
    mistral: '',
    groq: '',
  })
  const [isLocked, setIsLocked] = useState(false)
  const [hasEncryptedKeys, setHasEncryptedKeys] = useState(false)
  const [passphrase, setPassphrase] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const gemini = storage.getItem<string>('gemini_api_key', '')
      const openai = storage.getItem<string>('openai_api_key', '')
      const anthropic = storage.getItem<string>('anthropic_api_key', '')
      const mistral = storage.getItem<string>('mistral_api_key', '')
      const groq = storage.getItem<string>('groq_api_key', '')
      const provider = storage.getItem<LLMProviderType>(
        'selected_provider',
        'gemini'
      )
      const all = { gemini, openai, anthropic, mistral, groq }
      const encrypted = Object.values(all).some((v) => isEncrypted(v))
      setHasEncryptedKeys(encrypted)
      if (encrypted) {
        setIsLocked(true)
      } else {
        setApiKeys(all)
      }
      setSelectedProviderState(provider)
    }
    load()
  }, [])

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)
  const toggleSettings = () => setIsSettingsOpen((p) => !p)

  const unlock = async (pass: string) => {
    try {
      const gemini = storage.getItem<string>('gemini_api_key', '')
      const openai = storage.getItem<string>('openai_api_key', '')
      const anthropic = storage.getItem<string>('anthropic_api_key', '')
      const mistral = storage.getItem<string>('mistral_api_key', '')
      const groq = storage.getItem<string>('groq_api_key', '')
      const raw = { gemini, openai, anthropic, mistral, groq }
      const decrypted: Record<string, string> = {}
      for (const [k, v] of Object.entries(raw)) {
        decrypted[k] = v && isEncrypted(v) ? await decrypt(v, pass) : v
      }
      setApiKeys(decrypted)
      setPassphrase(pass)
      setIsLocked(false)
      return true
    } catch {
      return false
    }
  }

  const lock = () => {
    setApiKeys({
      gemini: '',
      openai: '',
      anthropic: '',
      mistral: '',
      groq: '',
    })
    setPassphrase(null)
    setIsLocked(true)
  }

  const resetKeys = () => {
    Object.values(STORAGE_KEY_MAP).forEach((key) => storage.removeItem(key))
    setApiKeys({
      gemini: '',
      openai: '',
      anthropic: '',
      mistral: '',
      groq: '',
    })
    setPassphrase(null)
    setIsLocked(false)
    setHasEncryptedKeys(false)
  }

  const setApiKey = async (
    provider: LLMProviderType,
    key: string,
    newPassphrase?: string
  ) => {
    const activePassphrase = newPassphrase || passphrase
    if (activePassphrase) {
      try {
        const encrypted = await encrypt(key, activePassphrase)
        setApiKeys((prev) => ({ ...prev, [provider]: key }))
        if (STORAGE_KEY_MAP[provider]) {
          storage.setItem(STORAGE_KEY_MAP[provider], encrypted)
        }
        if (newPassphrase) {
          const oldPass = passphrase
          setPassphrase(newPassphrase)
          const storageValues: Record<string, string> = {
            gemini: storage.getItem<string>('gemini_api_key', ''),
            openai: storage.getItem<string>('openai_api_key', ''),
            anthropic: storage.getItem<string>('anthropic_api_key', ''),
            mistral: storage.getItem<string>('mistral_api_key', ''),
            groq: storage.getItem<string>('groq_api_key', ''),
          }
          const decryptedAll: Record<string, string> = {}
          for (const [prov, val] of Object.entries(storageValues)) {
            if (prov === provider) {
              decryptedAll[prov] = key
              continue
            }
            if (val && isEncrypted(val) && oldPass) {
              try {
                decryptedAll[prov] = await decrypt(val, oldPass)
              } catch {
                decryptedAll[prov] = apiKeys[prov] || ''
              }
            } else {
              decryptedAll[prov] = apiKeys[prov] || val || ''
            }
          }
          for (const [prov, plain] of Object.entries(decryptedAll)) {
            if (plain && STORAGE_KEY_MAP[prov]) {
              const reEncrypted = await encrypt(plain, newPassphrase)
              storage.setItem(STORAGE_KEY_MAP[prov], reEncrypted)
            }
          }
          setHasEncryptedKeys(true)
          setIsLocked(false)
          setApiKeys(decryptedAll)
        }
      } catch {}
    } else {
      setApiKeys((prev) => ({ ...prev, [provider]: key }))
      if (STORAGE_KEY_MAP[provider]) {
        storage.setItem(STORAGE_KEY_MAP[provider], key)
      }
    }
  }

  const setSelectedProvider = (provider: LLMProviderType) => {
    setSelectedProviderState(provider)
    storage.setItem('selected_provider', provider)
  }

  const currentProviderConfig = PROVIDER_REGISTRY.find(
    (p) => p.id === selectedProvider
  )
  const availableModels = currentProviderConfig?.models || []

  return {
    isSettingsOpen,
    openSettings,
    closeSettings,
    toggleSettings,
    apiKeys,
    setApiKey,
    selectedProvider,
    setSelectedProvider,
    apiKey: apiKeys[selectedProvider as string] || '',
    availableModels,
    isLocked,
    unlock,
    lock,
    resetKeys,
    hasEncryptedKeys,
  }
}
