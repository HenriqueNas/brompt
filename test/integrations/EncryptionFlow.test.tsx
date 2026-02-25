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

// Mock crypto
// Web Crypto API is not available in JSDOM/Node test environment by default usually,
// or requires setup. For unit tests, we can mock the crypto lib functions
// to avoid dealing with actual Web Crypto async complexity and polyfills.
vi.mock('../../src/lib/crypto', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  isEncrypted: vi.fn(),
}))

describe('SettingsContext Encryption Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(storage.getItem).mockReturnValue('')
    vi.mocked(isEncrypted).mockReturnValue(false)
  })

  it('should start in unlocked state if no keys exist', async () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    // wait for useEffect
    await waitFor(() => {
      expect(result.current.isLocked).toBe(false)
      expect(result.current.hasEncryptedKeys).toBe(false)
    })
  })

  it('should start in locked state if encrypted keys exist', async () => {
    vi.mocked(storage.getItem).mockImplementation((key) => {
      if (key === 'gemini_api_key') return '{"v":1,"ciphertext":"..."}'
      return ''
    })
    vi.mocked(isEncrypted).mockReturnValue(true)

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(result.current.hasEncryptedKeys).toBe(true)
      expect(result.current.apiKeys.gemini).toBe('') // Should not load key yet
    })
  })

  it('should unlock and decrypt keys with correct passphrase', async () => {
    // Setup locked state
    vi.mocked(storage.getItem).mockImplementation((key) => {
      if (key === 'gemini_api_key') return 'encrypted-gemini'
      return ''
    })
    vi.mocked(isEncrypted).mockReturnValue(true)
    vi.mocked(decrypt).mockResolvedValue('decrypted-gemini-key')

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
    })

    // Unlock
    let success = false
    await act(async () => {
      success = await result.current.unlock('my-passphrase')
    })

    expect(success).toBe(true)
    expect(decrypt).toHaveBeenCalledWith('encrypted-gemini', 'my-passphrase')
    expect(result.current.isLocked).toBe(false)
    expect(result.current.apiKeys.gemini).toBe('decrypted-gemini-key')
  })

  it('should encrypt keys when setting api key with passphrase', async () => {
    vi.mocked(encrypt).mockResolvedValue('encrypted-new-key')

    const { result } = renderHook(() => useSettings(), {
      wrapper: SettingsProvider,
    })

    await act(async () => {
      await result.current.setApiKey('gemini', 'new-key', 'secret-pass')
    })

    expect(encrypt).toHaveBeenCalledWith('new-key', 'secret-pass')
    expect(storage.setItem).toHaveBeenCalledWith(
      'gemini_api_key',
      'encrypted-new-key'
    )
    expect(result.current.hasEncryptedKeys).toBe(true)
  })
})
