import { LLMProviderType } from '@/lib/llm/types'

export interface SettingsContextType {
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  toggleSettings: () => void
  apiKeys: Record<string, string>
  setApiKey: (
    provider: LLMProviderType,
    key: string,
    newPassphrase?: string
  ) => Promise<void>
  selectedProvider: LLMProviderType
  setSelectedProvider: (provider: LLMProviderType) => void
  apiKey: string
  availableModels: { id: string; displayName: string }[]
  isLocked: boolean
  unlock: (passphrase: string) => Promise<boolean>
  lock: () => void
  resetKeys: () => void
  hasEncryptedKeys: boolean
}
