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
    private defaultModelId: string
  ) {}

  private getModel(apiKey: string, modelId?: string) {
    const model = modelId || this.defaultModelId

    switch (this.id) {
      case 'anthropic':
        return createAnthropic({ apiKey })(model)
      case 'openai':
        return createOpenAI({ apiKey })(model)
      case 'gemini':
        return createGoogleGenerativeAI({ apiKey })(model)
      case 'mistral':
        return createMistral({ apiKey })(model)
      case 'groq':
        return createGroq({ apiKey })(model)
      default:
        throw new Error(`Unknown provider: ${this.id}`)
    }
  }

  async generate(
    apiKey: string,
    promptPayload: string,
    options?: { modelId?: string }
  ): Promise<string> {
    const model = this.getModel(apiKey, options?.modelId)
    const { text } = await generateText({
      model,
      prompt: promptPayload,
    })
    return text
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
    const model = this.getModel(apiKey, options?.modelId)

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
