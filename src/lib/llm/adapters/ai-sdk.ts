import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { ModelMessage as CoreMessage, generateText, streamText, Tool } from 'ai'
import { LLMProvider } from '../types'

export class AISDKAdapter implements LLMProvider {
  constructor(
    public id: string,
    public name: string,
    private preferredModels: string[]
  ) {}

  private getModel(apiKey: string, modelId?: string) {
    // If a specific model is requested, return it directly
    if (modelId) {
      return this.createModelInstance(apiKey, modelId)
    }

    // Otherwise, we need to return the first preferred model
    // Note: AISDK doesn't easily support "fallback" logic at the instance creation level
    // without wrapping the generate call.
    // So here we just return the first one, and let the generate/stream methods handle fallback logic if needed.
    // However, since `getModel` returns a LanguageModel object, we can't easily "try next" inside getModel.
    // We will handle the iteration in generate/stream.
    return this.createModelInstance(apiKey, this.preferredModels[0])
  }

  private createModelInstance(apiKey: string, modelId: string) {
    switch (this.id) {
      case 'anthropic':
        return createAnthropic({ apiKey })(modelId)
      case 'openai':
        return createOpenAI({ apiKey })(modelId)
      case 'gemini':
        return createGoogleGenerativeAI({ apiKey })(modelId)
      case 'mistral':
        return createMistral({ apiKey })(modelId)
      case 'groq':
        return createGroq({ apiKey })(modelId)
      default:
        throw new Error(`Unknown provider: ${this.id}`)
    }
  }

  async generate(
    apiKey: string,
    promptPayload: string,
    options?: { modelId?: string }
  ): Promise<string> {
    // If a specific model is requested, try only that one
    if (options?.modelId) {
      const model = this.createModelInstance(apiKey, options.modelId)
      const { text } = await generateText({
        model,
        prompt: promptPayload,
      })
      return text
    }

    // Otherwise, try models in order of preference
    let lastError: unknown
    for (const modelId of this.preferredModels) {
      try {
        const model = this.createModelInstance(apiKey, modelId)
        const { text } = await generateText({
          model,
          prompt: promptPayload,
        })
        return text
      } catch (error: unknown) {
        console.warn(`${this.name} API Error with model ${modelId}:`, error)
        lastError = error

        const errorMessage =
          error instanceof Error ? error.message : String(error)

        // If it's a 404/400 (Model not found/supported), try next
        if (
          errorMessage.includes('404') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('not supported') ||
          errorMessage.includes('model_not_found')
        ) {
          continue
        }

        // Auth/RateLimit errors should stop immediately
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
          throw new Error(`Invalid API Key for ${this.name}.`)
        }
        if (errorMessage.includes('429')) {
          throw new Error('Rate limit exceeded.')
        }

        // For now, let's treat other errors as retryable (e.g. 500s) or just try next model
        // But to be safe and robust like the native implementation:
        continue
      }
    }

    throw new Error(
      `Failed to generate text. All preferred models for ${this.name} failed. Last error: ${lastError}`
    )
  }

  async stream(
    apiKey: string,
    messages: CoreMessage[],
    options?: {
      modelId?: string
      tools?: Record<string, Tool>
      system?: string
      onFinish?: (text: string) => void
    }
  ): Promise<ReadableStream<string>> {
    // Streaming fallback logic is complex because we return a stream immediately.
    // For now, we will just use the first available model or the requested one.
    // Implementing true fallback for streaming requires trying to connect, catching error, and trying next BEFORE returning the stream.

    // Simplified approach: Try to "start" the stream with the first model.
    // Since streamText doesn't await the network call immediately, we might not catch 404s here easily without reading.
    // However, for the purpose of this refactor, we will stick to the primary requested model for streaming
    // OR just the first preferred one.

    const modelId = options?.modelId || this.preferredModels[0]
    const model = this.createModelInstance(apiKey, modelId)

    const result = streamText({
      model,
      messages,
      system: options?.system,
      tools: options?.tools,
      onFinish: ({ text }) => {
        if (options?.onFinish) options.onFinish(text)
      },
    })

    // Convert AsyncIterable to ReadableStream
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(chunk)
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })
  }
}
