import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Providers } from '../../src/app/providers'
import { PromptFormEngine } from '../../src/features/form/PromptFormEngine'
import { geminiProvider } from '../../src/lib/llm/providers/gemini'

// Mock the Gemini provider
vi.mock('../../src/lib/llm/providers/gemini', () => ({
  geminiProvider: {
    generate: vi.fn(),
  },
}))

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

describe('PromptFormEngine Integration', () => {
  const mockSchema = {
    title: 'Round 1: Context',
    fields: [
      {
        id: 'audience',
        type: 'text',
        label: 'Who is the target audience?',
        placeholder: 'e.g. Developers',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Set a fake API key by default
    localStorage.setItem('gemini_api_key', JSON.stringify('fake-api-key'))
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should render the seed input initially (Happy Path)', () => {
    render(
      <Providers>
        <PromptFormEngine />
      </Providers>
    )

    expect(
      screen.getByRole('heading', { name: /What do you want to build\?/i })
    ).toBeInTheDocument()
    // Use a unique part of the placeholder
    expect(
      screen.getByPlaceholderText(/e\.g\., I need a prompt/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Start Architecting/i })
    ).toBeDisabled()
  })

  it('should show API key required message if no API key is present', () => {
    localStorage.removeItem('gemini_api_key')

    render(
      <Providers>
        <PromptFormEngine />
      </Providers>
    )

    expect(screen.getByText(/API Key Required/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /What do you want to build\?/i })
    ).not.toBeInTheDocument()
  })

  it('should generate next round when seed is submitted', async () => {
    // Mock successful LLM response
    const mockResponse = JSON.stringify(mockSchema)
    vi.mocked(geminiProvider.generate).mockResolvedValue(mockResponse)

    render(
      <Providers>
        <PromptFormEngine />
      </Providers>
    )

    // Type seed input
    const seedInput = screen.getByPlaceholderText(/e\.g\., I need a prompt/i)
    fireEvent.change(seedInput, {
      target: { value: 'I want a blog post generator' },
    })

    // Click Start
    const startButton = screen.getByRole('button', {
      name: /Start Architecting/i,
    })
    expect(startButton).not.toBeDisabled()
    fireEvent.click(startButton)

    // Wait for next round to appear
    await waitFor(() => {
      expect(screen.getByText('Round 1: Context')).toBeInTheDocument()
    })

    // Verify fields from schema are rendered
    expect(
      screen.getByLabelText('Who is the target audience?')
    ).toBeInTheDocument()

    // Verify Gemini was called with correct context
    expect(geminiProvider.generate).toHaveBeenCalledTimes(1)
    expect(geminiProvider.generate).toHaveBeenCalledWith(
      'fake-api-key',
      expect.stringContaining('I want a blog post generator'),
      expect.objectContaining({ modelId: expect.any(String) })
    )
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    vi.mocked(geminiProvider.generate).mockRejectedValue(new Error('API Error'))

    render(
      <Providers>
        <PromptFormEngine />
      </Providers>
    )

    // Type seed input
    const seedInput = screen.getByPlaceholderText(/e\.g\., I need a prompt/i)
    fireEvent.change(seedInput, { target: { value: 'Error test' } })

    // Click Start
    fireEvent.click(screen.getByRole('button', { name: /Start Architecting/i }))

    // Wait for error message (key: error_generate_questions -> "Failed to generate next questions...")
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to generate next questions/i)
      ).toBeInTheDocument()
    })
  })
})
