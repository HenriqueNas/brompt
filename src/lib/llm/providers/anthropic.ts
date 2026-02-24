import Anthropic from '@anthropic-ai/sdk'
import { LLMProvider } from '../types'

export class AnthropicProvider implements LLMProvider {
  async generate(apiKey: string, promptPayload: string): Promise<string> {
    if (!apiKey) {
      throw new Error('API Key is missing.')
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    })

    // List of models to try in order of preference
    const modelsToTry = [
      'claude-3-5-sonnet-20240620',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ]

    let lastError: unknown

    for (const modelName of modelsToTry) {
      try {
        const msg = await anthropic.messages.create({
          model: modelName,
          max_tokens: 4096,
          messages: [{ role: 'user', content: promptPayload }],
        })

        if (msg.content[0]?.type === 'text') {
          return msg.content[0].text
        }
        return ''
      } catch (error: unknown) {
        console.warn(`Anthropic API Error with model ${modelName}:`, error)
        lastError = error

        const errorMessage =
          error instanceof Error ? error.message : String(error)

        // If it's a 404 (Model not found), try the next model
        if (
          errorMessage.includes('404') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('not_found_error')
        ) {
          continue
        }

        if (errorMessage.includes('401')) {
          throw new Error('Invalid API Key. Please check your settings.')
        }

        if (errorMessage.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }

        // For other errors, re-throw
        throw error
      }
    }

    console.error('All Anthropic models failed. Last error:', lastError)
    throw new Error(
      'Failed to generate prompt. All available Anthropic models failed or were not found. Please check your API key.'
    )
  }
}

export const anthropicProvider = new AnthropicProvider()
