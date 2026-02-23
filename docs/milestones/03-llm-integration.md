# Milestone 3: LLM Integration & Adapter Pattern

## Overview
This milestone involves connecting the application to the Google Gemini API. Crucially, we will implement the **LLM Adapter Pattern** to decouple the UI from the specific AI provider, ensuring future extensibility (e.g., swapping to OpenAI/Claude).

## Impacted Directories
- `src/features/llm/` (Adapters & Service)
- `src/features/generation/` (UI & Workflow)
- `src/lib/api/` (HTTP/Fetch Utilities)

## Functional Requirements (FR)
- **FR3: Gemini Integration**: Connect to Gemini API using user-provided API key.
- **FR4: Rendering**: Render output in Markdown.

## Non-Functional Requirements (NFR)
- **NFR2: Privacy**: API key stored locally only.
- **NFR5: Feedback**: Loading states during API calls.
- **Extensibility**: Interface-driven design for LLM providers.

## Tasks

### 1. LLM Adapter Architecture (`src/features/llm`)
- [ ] **Provider Interface**: Define a strict TypeScript interface `LLMProvider` (e.g., `generate(prompt: string, config: Config): Promise<string>`).
- [ ] **Gemini Adapter**: Implement the `GeminiAdapter` class that satisfies the `LLMProvider` interface.
- [ ] **Factory/Context**: Create a mechanism to instantiate the correct adapter based on configuration (defaulting to Gemini).

### 2. Generation Workflow (`src/features/generation`)
- [ ] **Prompt Construction**: Implement logic to serialize the C1 Form State into a structured text prompt for the LLM.
- [ ] **Generate Action**: Create a `useGenerate` hook that calls the active LLM Adapter.
- [ ] **Loading Feedback**: Bind the "Generating..." state to the C1 global store to trigger UI spinners.

### 3. Output & Markdown (`src/features/generation`)
- [ ] **Markdown Renderer**: Implement a secure Markdown display component (using `react-markdown` or similar).
- [ ] **Copy Interaction**: Implement "Copy to Clipboard" with visual feedback (toast/icon change).

## Definition of Done
- [ ] The `GeminiAdapter` successfully communicates with the Google API.
- [ ] The UI is unaware of "Gemini" specifics, interacting only through the `LLMProvider` interface.
- [ ] The "Generate" button triggers the flow, shows a loading state, and renders the result.
- [ ] **A11y Check**: The result area is accessible, and the loading state is announced to screen readers (ARIA live region).
