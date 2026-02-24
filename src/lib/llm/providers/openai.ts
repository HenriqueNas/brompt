import { AISDKAdapter } from '../adapters/ai-sdk'

export const openaiProvider = new AISDKAdapter('openai', 'OpenAI', [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-3.5-turbo',
  'gpt-4-turbo',
])
