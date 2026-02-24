import { createOpenAI } from '@ai-sdk/openai'
import { ModelMessage as CoreMessage, generateText, streamText, Tool } from 'ai'
import { LLMProvider } from '../types'

export class OpenAICompatibleAdapter implements LLMProvider {
  constructor(
    public id: string,
    public name: string,
    private defaultModelId: string,
    private baseUrl?: string
  ) {}

  private getModel(apiKey: string, modelId?: string) {
    const openai = createOpenAI({
      apiKey,
      baseURL: this.baseUrl,
    })
    return openai(modelId || this.defaultModelId)
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
