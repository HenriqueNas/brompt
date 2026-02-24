import { AISDKAdapter } from '../adapters/ai-sdk'

// We export the instance directly as before, but now using the AI SDK adapter
// The default model is set to the most capable one
export const anthropicProvider = new AISDKAdapter(
  'anthropic',
  'Anthropic',
  'claude-3-5-sonnet-20240620'
)
