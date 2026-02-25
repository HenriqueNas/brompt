import { StorageKey } from '@/lib/storage'

export const STORAGE_KEY_MAP: Record<string, StorageKey> = {
  gemini: 'gemini_api_key',
  openai: 'openai_api_key',
  anthropic: 'anthropic_api_key',
  mistral: 'mistral_api_key',
  groq: 'groq_api_key',
}
