import { AISDKAdapter } from '../adapters/ai-sdk'

export const groqProvider = new AISDKAdapter('groq', 'Groq', [
  'llama3-8b-8192',
  'llama3-70b-8192',
  'mixtral-8x7b-32768',
])
