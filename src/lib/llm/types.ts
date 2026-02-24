export interface LLMProvider {
  generate(apiKey: string, promptPayload: string): Promise<string>
}

export type LLMProviderType = 'gemini' | 'openai' | 'anthropic'
