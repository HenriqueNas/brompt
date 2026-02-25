import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Providers } from '../../src/app/providers'
import { SettingsModal } from '../../src/components/layout/SettingsModal'
import { storage } from '../../src/lib/storage'

// Mock storage
vi.mock('../../src/lib/storage', () => ({
  storage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}))

describe('SettingsModal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementation for storage
    vi.mocked(storage.getItem).mockImplementation((key, defaultValue) => {
      if (key === 'language') return 'en'
      return defaultValue
    })
  })

  it('should render the settings modal when open (Happy Path)', () => {
    // Override mock for this test
    vi.mocked(storage.getItem).mockImplementation((key, defaultValue) => {
      if (key === 'gemini_api_key') return 'initial-key'
      if (key === 'language') return 'en'
      return defaultValue
    })

    render(
      <Providers>
        <SettingsModal isOpen={true} onClose={vi.fn()} />
      </Providers>
    )

    expect(
      screen.getByRole('heading', { name: /Settings/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Gemini API Key/i)).toBeInTheDocument()
    // Check if input has the initial value
    expect(screen.getByDisplayValue('initial-key')).toBeInTheDocument()
  })

  it('should save API key when save button is clicked', async () => {
    const onClose = vi.fn()

    render(
      <Providers>
        <SettingsModal isOpen={true} onClose={onClose} />
      </Providers>
    )

    const input = screen.getByLabelText(/Gemini API Key/i)
    fireEvent.change(input, { target: { value: 'new-api-key' } })
    const pass1 = screen.getByLabelText(/Create Passphrase/i)
    const pass2 = screen.getByLabelText(/Confirm Passphrase/i)
    fireEvent.change(pass1, { target: { value: 'secret' } })
    fireEvent.change(pass2, { target: { value: 'secret' } })

    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    // Verify storage was updated
    await waitFor(() => {
      const calls = vi.mocked(storage.setItem).mock.calls
      const geminiCall = calls.find((c) => c[0] === 'gemini_api_key')
      expect(geminiCall).toBeTruthy()
      expect(typeof geminiCall?.[1]).toBe('string')
    })

    // Verify modal was closed
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('should switch provider and save new provider key', async () => {
    const onClose = vi.fn()

    render(
      <Providers>
        <SettingsModal isOpen={true} onClose={onClose} />
      </Providers>
    )

    // Switch to OpenAI
    const providerSelect = screen.getByLabelText(/AI Provider/i)
    fireEvent.change(providerSelect, { target: { value: 'openai' } })

    // Check if label updated
    expect(screen.getByLabelText(/OpenAI API Key/i)).toBeInTheDocument()

    // Enter key
    const input = screen.getByLabelText(/OpenAI API Key/i)
    fireEvent.change(input, { target: { value: 'sk-openai-key' } })
    const pass1 = screen.getByLabelText(/Create Passphrase/i)
    const pass2 = screen.getByLabelText(/Confirm Passphrase/i)
    fireEvent.change(pass1, { target: { value: 'secret' } })
    fireEvent.change(pass2, { target: { value: 'secret' } })

    // Save
    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    // Verify storage updated
    await waitFor(() => {
      const calls = vi.mocked(storage.setItem).mock.calls
      const openaiCall = calls.find((c) => c[0] === 'openai_api_key')
      expect(openaiCall).toBeTruthy()
      expect(typeof openaiCall?.[1]).toBe('string')
      expect(storage.setItem).toHaveBeenCalledWith(
        'selected_provider',
        'openai'
      )
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('should not render when isOpen is false', () => {
    render(
      <Providers>
        <SettingsModal isOpen={false} onClose={vi.fn()} />
      </Providers>
    )

    expect(
      screen.queryByRole('heading', { name: /Settings/i })
    ).not.toBeInTheDocument()
  })

  it('should not save unchanged API keys', async () => {
    vi.mocked(storage.getItem).mockImplementation((key, defaultValue) => {
      if (key === 'gemini_api_key') return 'initial-key'
      if (key === 'language') return 'en'
      return defaultValue
    })

    const onClose = vi.fn()
    render(
      <Providers>
        <SettingsModal isOpen={true} onClose={onClose} />
      </Providers>
    )

    const pass1 = screen.getByLabelText(/Create Passphrase/i)
    const pass2 = screen.getByLabelText(/Confirm Passphrase/i)
    fireEvent.change(pass1, { target: { value: 'secret' } })
    fireEvent.change(pass2, { target: { value: 'secret' } })
    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(storage.setItem).not.toHaveBeenCalledWith(
        'gemini_api_key',
        'initial-key'
      )
      expect(onClose).toHaveBeenCalled()
    })
  })
})
