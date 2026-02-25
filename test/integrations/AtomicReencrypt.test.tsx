import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  SettingsProvider,
  useSettings,
} from '../../src/contexts/SettingsContext'
import { storage } from '../../src/lib/storage'
import { encrypt, decrypt, isEncrypted } from '../../src/lib/crypto'

vi.mock('../../src/lib/storage', () => ({
  storage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}))

vi.mock('../../src/lib/crypto', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  isEncrypted: vi.fn(),
}))

describe('Atomic passphrase re-encryption', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('re-encrypts all providers atomically when passphrase changes and multiple keys update', async () => {
    vi.mocked(storage.getItem).mockImplementation((key) => {
      if (key === 'gemini_api_key') return 'enc-gem-old'
      if (key === 'openai_api_key') return 'enc-openai-old'
      if (key === 'anthropic_api_key') return ''
      if (key === 'mistral_api_key') return ''
      if (key === 'groq_api_key') return ''
      return ''
    })
    vi.mocked(isEncrypted).mockImplementation((val: string) =>
      val.startsWith('enc-')
    )
    vi.mocked(decrypt).mockImplementation(async (val: string, pass: string) => {
      if (val === 'enc-gem-old' && pass === 'old-pass') return 'gem-plain'
      if (val === 'enc-openai-old' && pass === 'old-pass') return 'openai-plain'
      return ''
    })
    vi.mocked(encrypt).mockImplementation(
      async (plain: string, pass: string) => `enc-${plain}-${pass}`
    )

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    await act(async () => {
      await result.current.unlock('old-pass')
    })

    await act(async () => {
      await result.current.setApiKey(
        'openai',
        'openai-plain-updated',
        'new-pass'
      )
      await result.current.setApiKey('gemini', 'gem-plain-updated', 'new-pass')
    })

    await waitFor(() => {
      expect(storage.setItem).toHaveBeenCalledWith(
        'openai_api_key',
        'enc-openai-plain-updated-new-pass'
      )
      expect(storage.setItem).toHaveBeenCalledWith(
        'gemini_api_key',
        'enc-gem-plain-updated-new-pass'
      )
    })
  })
})
