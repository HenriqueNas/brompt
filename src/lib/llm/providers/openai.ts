import OpenAI from 'openai'
import { LLMProvider } from '../types'

export class OpenAIProvider implements LLMProvider {
  async generate(
    apiKey: string,
    promptPayload: string,
    options?: { modelId?: string }
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('API Key is missing.')
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    })

    const modelsToTry = options?.modelId
      ? [options.modelId]
      : ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']

    let lastError: unknown

    for (const modelName of modelsToTry) {
      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: promptPayload }],
          model: modelName,
        })
        return completion.choices[0]?.message?.content || ''
      } catch (error: unknown) {
        console.warn(`OpenAI API Error with model ${modelName}:`, error)
        lastError = error

        const errorMessage =
          error instanceof Error ? error.message : String(error)

        // If it's a 404 (Model not found), try the next model
        if (
          errorMessage.includes('404') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('model_not_found')
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

    console.error('All OpenAI models failed. Last error:', lastError)
    throw new Error(
      'Failed to generate prompt. All available OpenAI models failed or were not found. Please check your API key.'
    )
  }
}

export const openaiProvider = new OpenAIProvider()
