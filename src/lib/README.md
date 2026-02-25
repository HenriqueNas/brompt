# Lib Directory

This directory contains shared utility functions, API clients, and configuration helpers.

## Responsibilities

- **LLM Provider Layer**: Unified interface for interacting with multiple AI providers (OpenAI, Anthropic, Gemini, Mistral, Groq).
- **Vercel AI SDK Integration**: Uses `ai` SDK for standardized generation and streaming.
- **LocalStorage Helpers**: Wrappers for saving/loading data from localStorage.
- **Crypto Helpers**: Web Crypto utilities for AES‑GCM + PBKDF2 encryption of API keys.
- **Constants**: Shared constants and types.

## LLM Architecture

The LLM layer is built around a `ProviderRegistry` and `Adapters`:

- **Registry**: `src/lib/llm/registry.ts` defines available providers, their models, and capabilities.
- **Adapters**: `src/lib/llm/adapters/` contains implementations for different provider types:
  - `AISDKAdapter`: Generic adapter for providers supported by Vercel AI SDK.
  - `OpenAICompatibleAdapter`: Generic adapter for OpenAI-compatible endpoints.
