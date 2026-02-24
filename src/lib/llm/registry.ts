export interface ProviderCapability {
  streaming: boolean
  tools: boolean
  json: boolean
  vision: boolean
  maxContextTokens?: number
}

export type ProviderAdapterType =
  | 'ai-sdk'
  | 'openai-compatible'
  | 'native'
  | 'openrouter'

export interface ModelConfig {
  id: string
  displayName: string
  maxTokens?: number
}

export interface ProviderConfig {
  id: string
  displayName: string
  adapter: ProviderAdapterType
  baseUrl?: string
  capabilities: ProviderCapability
  models: ModelConfig[]
  // Helper to get the actual AI SDK model instance (if using ai-sdk adapter)
  getParams?: (modelId: string) => Record<string, unknown>
}

export const PROVIDER_REGISTRY: ProviderConfig[] = [
  {
    id: 'openai',
    displayName: 'OpenAI',
    adapter: 'ai-sdk',
    capabilities: {
      streaming: true,
      tools: true,
      json: true,
      vision: true,
    },
    models: [
      { id: 'gpt-4o-mini', displayName: 'GPT-4o Mini' },
      { id: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo' },
      { id: 'gpt-4o', displayName: 'GPT-4o' },
      { id: 'gpt-4-turbo', displayName: 'GPT-4 Turbo' },
    ],
  },
  {
    id: 'anthropic',
    displayName: 'Anthropic',
    adapter: 'ai-sdk',
    capabilities: {
      streaming: true,
      tools: true,
      json: true,
      vision: true,
    },
    models: [
      { id: 'claude-3-haiku-20240307', displayName: 'Claude 3 Haiku' },
      { id: 'claude-3-5-sonnet-20240620', displayName: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-sonnet-20240229', displayName: 'Claude 3 Sonnet' },
      { id: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus' },
    ],
  },
  {
    id: 'gemini',
    displayName: 'Google Gemini',
    adapter: 'ai-sdk',
    capabilities: {
      streaming: true,
      tools: true,
      json: true,
      vision: true,
    },
    models: [
      { id: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'mistral',
    displayName: 'Mistral AI',
    adapter: 'ai-sdk',
    capabilities: {
      streaming: true,
      tools: true,
      json: true,
      vision: false,
    },
    models: [
      { id: 'mistral-small-latest', displayName: 'Mistral Small' },
      { id: 'mistral-large-latest', displayName: 'Mistral Large' },
    ],
  },
  {
    id: 'groq',
    displayName: 'Groq',
    adapter: 'ai-sdk',
    capabilities: {
      streaming: true,
      tools: true,
      json: true,
      vision: false,
    },
    models: [
      { id: 'llama3-8b-8192', displayName: 'Llama 3 8B' },
      { id: 'llama3-70b-8192', displayName: 'Llama 3 70B' },
      { id: 'mixtral-8x7b-32768', displayName: 'Mixtral 8x7B' },
    ],
  },
]
