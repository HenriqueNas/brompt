import { AISDKAdapter } from '../adapters/ai-sdk'

export const mistralProvider = new AISDKAdapter(
  'mistral',
  'Mistral AI',
  'mistral-large-latest'
)
