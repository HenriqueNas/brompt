# User Workflow

This document outlines the primary user flows within the Brompt application.

## 1. Onboarding & Setup

1.  **Landing**: User arrives at the application.
2.  **Configuration**:
    - User opens Settings (gear icon).
    - Selects an AI Provider (Gemini, OpenAI, Anthropic, Mistral, Groq).
    - Enters the corresponding API Key.
    - Creates a Passphrase to encrypt keys at rest.
    - Keys are saved encrypted to `localStorage`.
3.  **Unlock (Revisit)**:
    - When encrypted keys are detected, the app shows the Unlock modal.
    - User enters the passphrase to unlock; keys are decrypted in memory for the session.
    - If the passphrase is forgotten, user can reset all keys and set a new passphrase.

## 2. Creating a Prompt (The Loop)

```
[Start]
   │
   ▼
[Seed Input] ──> User enters goal (e.g., "Write a Python script")
   │
   ▼
[AI Analysis]
   │
   ▼
   <Is Goal Clear?> ──────── *Yes* ───┐
   │    │                             │
   │    └──────────────────┐          │
  *No*                     │          │
   │                       │          │
   ▼                       │          │
[Refinement Questions]     │          │
   │   (Dynamic Form)      │          │
   │                       │          │
   ▼                       │          │
[User Answers]             │          │
   │                       │          │
   └───────── (Loop) ──────┘          │
                                      │
                                      ▼
                                [Optimization]
                                      │
                                      ▼
                                [Final Prompt]
                                      │
                                      ▼
                                  [Finish]
```

1.  **Seed Input**:
    - User enters a high-level goal (e.g., "Create a python script to parse CSV").
    - Click "Start".
2.  **Refinement Rounds**:
    - The AI analyzes the request and asks clarifying questions (e.g., "What columns are in the CSV?", "How should errors be handled?").
    - User answers using dynamic controls (Text inputs, Dropdowns, Toggles).
    - Click "Next".
3.  **Iteration**:
    - The process repeats, diving deeper into specifics.
    - User can see a progress bar indicating the "depth" of the prompt.
4.  **Completion**:
    - At any point after Round 3, the user can click "Finish".
    - The AI compiles all context into a single, optimized "Mega-Prompt".

## 3. Managing History

1.  **Sidebar**: Displays a list of past sessions.
2.  **Load Session**: Clicking a session loads the read-only view of the conversation and the final result.
3.  **Delete**: User can remove individual sessions from history.
4.  **Clear All**: Option to wipe all history (settings/API key remain).

## 4. Drafts & Autosave

- **Autosave**: The application automatically saves the current progress (draft) to `localStorage`.
- **Resume**: If the user reloads the page, they are prompted to resume their unfinished draft or start over.

## 5. Settings

- **Language**: Toggle between English and Portuguese.
- **AI Provider**: Switch between supported providers (Gemini, OpenAI, Anthropic, Mistral, Groq).
- **Model Selection**: Choose specific models (e.g., GPT-4o, Claude 3.5 Sonnet) for the selected provider.
- **API Keys**: Manage keys for each provider independently (stored encrypted).
- **Security**: Create/change passphrase, unlock keys, or reset all keys.
- **Theme**: Toggle Dark/Light mode (system default initially).
