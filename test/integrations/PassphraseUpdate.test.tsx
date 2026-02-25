import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  SettingsProvider,
  useSettings,
} from '../../src/contexts/SettingsContext'
import { storage } from '../../src/lib/storage'
import { encrypt, decrypt, isEncrypted } from '../../src/lib/crypto'

// Mock storage
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

describe('SettingsContext Passphrase Update Issue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(storage.getItem).mockReturnValue('')
    vi.mocked(isEncrypted).mockReturnValue(false)
  })

  it('should FAIL if updating passphrase leaves other keys encrypted with old passphrase', async () => {
    // 1. Setup: User has Gemini key encrypted with 'old-pass'
    vi.mocked(storage.getItem).mockImplementation((key) => {
      if (key === 'gemini_api_key') return 'encrypted-gemini-old'
      if (key === 'openai_api_key') return ''
      return ''
    })
    vi.mocked(isEncrypted).mockImplementation((val) =>
      val.startsWith('encrypted')
    )
    vi.mocked(decrypt).mockResolvedValue('decrypted-gemini-key')
    vi.mocked(encrypt).mockImplementation(
      async (val, pass) => `encrypted-${val}-${pass}`
    )

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    // Wait for initial load (locked state)
    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
    })

    // 2. Unlock with 'old-pass'
    await act(async () => {
      await result.current.unlock('old-pass')
    })
    expect(result.current.isLocked).toBe(false)
    expect(result.current.apiKeys.gemini).toBe('decrypted-gemini-key')

    // 3. User sets OpenAI key with a NEW passphrase 'new-pass'
    // The current implementation only encrypts the NEW key with NEW passphrase,
    // but leaves Gemini key encrypted with OLD passphrase in storage?
    // OR it updates internal passphrase state but doesn't re-encrypt old keys in storage.

    await act(async () => {
      // simulating what happens in SettingsModal when user provides a new passphrase
      await result.current.setApiKey('openai', 'new-openai-key', 'new-pass')
    })

    // Expectation: storage should have BOTH keys encrypted with 'new-pass'
    // Current Bug: Gemini key in storage is likely still 'encrypted-gemini-old'
    // or untouched, while OpenAI is 'encrypted-new-openai-key-new-pass'.
    // If we reload and try to unlock with 'new-pass', Gemini decrypt will fail.

    expect(storage.setItem).toHaveBeenCalledWith(
      'openai_api_key',
      'encrypted-new-openai-key-new-pass'
    )

    // Verify re-encryption of gemini key too (now fixed)
    expect(storage.setItem).toHaveBeenCalledWith(
      'gemini_api_key',
      'encrypted-decrypted-gemini-key-new-pass'
    )
  })
})
