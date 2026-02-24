export type StorageKey =
  | 'gemini_api_key'
  | 'openai_api_key'
  | 'anthropic_api_key'
  | 'selected_provider'
  | 'language'
  | 'theme'
  | 'history'
  | 'drafts'

export const storage = {
  getItem: <T>(key: StorageKey, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error)
      return defaultValue
    }
  },

  setItem: <T>(key: StorageKey, value: T): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error)
    }
  },

  removeItem: (key: StorageKey): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error)
    }
  },
}
