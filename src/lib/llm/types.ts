export interface LLMProvider {
  generate(apiKey: string, promptPayload: string): Promise<string>
}
