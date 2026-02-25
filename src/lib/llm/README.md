# LLM Provider Layer

This directory contains the abstraction layer for interacting with multiple LLM providers.

## Architecture

The system uses a **Registry + Adapter** pattern to support multiple providers while maintaining a unified interface for the application.

### 1. Registry (`registry.ts`)

The `PROVIDER_REGISTRY` is the single source of truth for:

- Available Providers (OpenAI, Anthropic, Gemini, Mistral, Groq)
- Available Models per Provider
- Provider Capabilities (streaming, tools, vision, etc.)
- Adapter Type (`ai-sdk`, `openai-compatible`, `native`)

### 2. Adapters (`adapters/`)

Adapters bridge the gap between the application's `LLMProvider` interface and the underlying SDKs.

- **`AISDKAdapter`**: Uses Vercel's AI SDK (`ai`) to connect to supported providers. This is the preferred adapter for most modern providers.
- **`OpenAICompatibleAdapter`**: A generic client for any service that exposes an OpenAI-compatible API (e.g., Together AI, Fireworks, LocalLLM).

### 3. Providers (`providers/`)

Concrete instances of the adapters, pre-configured for specific services.

- `anthropic.ts` -> Uses `AISDKAdapter`
- `mistral.ts` -> Uses `AISDKAdapter`
- `groq.ts` -> Uses `AISDKAdapter`
- `gemini.ts` -> Currently uses native Google SDK (migration planned)
- `openai.ts` -> Currently uses native OpenAI SDK (migration planned)

## Adding a New Provider

1.  Add the provider configuration to `PROVIDER_REGISTRY` in `registry.ts`.
2.  If supported by Vercel AI SDK, create a new instance in `providers/<name>.ts` using `AISDKAdapter`.
3.  Integrate the provider’s API key management via `SettingsContext` (backed by `useSettingsController`) and `SettingsModal`.
4.  Update locale files (`en.json`, `pt.json`) with the new label.

## Notes on Security

- API keys are persisted encrypted in `localStorage` using AES‑GCM with PBKDF2 (Web Crypto API).
- Unlock requires a user passphrase; keys are decrypted into memory for the session only.
- Changing the passphrase re‑encrypts all stored provider keys atomically to prevent inconsistency.
