import { ModelMessage as CoreMessage, Tool } from 'ai'

export interface LLMProvider {
  id?: string
  name?: string

  // Legacy single-turn generation
  generate(
    apiKey: string,
    promptPayload: string,
    options?: { modelId?: string }
  ): Promise<string>

  // Streaming support
  stream?(
    apiKey: string,
    messages: CoreMessage[],
    options?: {
      modelId?: string
      tools?: Record<string, Tool>
      system?: string
      onFinish?: (text: string) => void
    }
  ): Promise<ReadableStream<string>>
}

export type LLMProviderType =
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'mistral'
  | 'groq'
  | string
