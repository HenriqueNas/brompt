import { AISDKAdapter } from '../adapters/ai-sdk'

export const mistralProvider = new AISDKAdapter('mistral', 'Mistral AI', [
  'mistral-small-latest',
  'mistral-large-latest',
])
