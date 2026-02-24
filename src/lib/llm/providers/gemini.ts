import { GoogleGenerativeAI } from '@google/generative-ai'
import { LLMProvider } from '../types'

export class GeminiProvider implements LLMProvider {
  async generate(apiKey: string, promptPayload: string): Promise<string> {
    if (!apiKey) {
      throw new Error('API Key is missing.')
    }

    // List of models to try in order of preference
    // 1. gemini-1.5-flash: Standard alias for the latest stable Flash model
    // 2. gemini-1.5-flash-latest: Specific alias sometimes needed
    // 3. gemini-flash-latest: Another common alias
    // 4. gemini-pro: Fallback to Pro if Flash is unavailable
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-flash-latest',
      'gemini-pro',
    ]

    let lastError: unknown
    const genAI = new GoogleGenerativeAI(apiKey)

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(promptPayload)
        const response = await result.response
        return response.text()
      } catch (error: unknown) {
        console.warn(`Gemini API Error with model ${modelName}:`, error)
        lastError = error

        const errorMessage =
          error instanceof Error ? error.message : String(error)

        // If it's a 404 (Model not found) or 400 (Bad Request - sometimes model related), try the next model
        if (
          errorMessage.includes('404') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('not supported')
        ) {
          continue
        }

        // If it's a 429 (Rate Limit) or 401 (Auth), stop immediately
        if (errorMessage.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }

        if (
          errorMessage.includes('401') ||
          errorMessage.includes('INVALID_ARGUMENT')
        ) {
          throw new Error('Invalid API Key. Please check your settings.')
        }

        // For other errors, re-throw
        throw error
      }
    }

    // If we get here, all models failed
    console.error('All Gemini models failed. Last error:', lastError)
    throw new Error(
      'Failed to generate prompt. All available Gemini models (Flash, Pro) failed or were not found. Please check your API key and region availability.'
    )
  }
}

export const geminiProvider = new GeminiProvider()
