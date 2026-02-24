import { AISDKAdapter } from '../adapters/ai-sdk'

export const geminiProvider = new AISDKAdapter('gemini', 'Google Gemini', [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
])
