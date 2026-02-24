import { AISDKAdapter } from '../adapters/ai-sdk'

export const geminiProvider = new AISDKAdapter('gemini', 'Google Gemini', [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
])
