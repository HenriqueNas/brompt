import { AISDKAdapter } from '../adapters/ai-sdk'

// We export the instance directly as before, but now using the AI SDK adapter
// The preferred models are set to the most capable ones
export const anthropicProvider = new AISDKAdapter('anthropic', 'Anthropic', [
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20240620',
  'claude-3-sonnet-20240229',
  'claude-3-opus-20240229',
])
