import { fireEvent, render, screen } from '@testing-library/react'
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

    const saveButton = screen.getByRole('button', { name: /Save/i })
    fireEvent.click(saveButton)

    // Verify storage was updated
    expect(storage.setItem).toHaveBeenCalledWith(
      'gemini_api_key',
      'new-api-key'
    )

    // Verify modal was closed
    expect(onClose).toHaveBeenCalled()
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
})
