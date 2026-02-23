# Milestone 4: Persistence & History

## Overview
This milestone focuses on saving user data locally (API keys, history, drafts) using `localStorage`. This ensures data persistence without external servers.

## Functional Requirements (FR)
- **FR5: Search**: Search history by title.
- **FR3: Gemini Integration**: Secure API Key management.

## Non-Functional Requirements (NFR)
- **NFR2: Privacy**: Zero backend; data resides exclusively in LocalStorage.
- **NFR5: Feedback**: Instant load of saved data.

## Tasks
1. **LocalStorage Service**
   - Create a service or hooks (e.g., `useLocalStorage`) to abstract `window.localStorage`.
   - Implement methods for `get`, `set`, `remove`, and `clear`.
   - Handle SSR hydration issues (e.g., checking for `window`).

2. **API Key Persistence**
   - Save the user's Gemini API Key securely (consider basic encryption if possible, though local only).
   - Retrieve key on app load.

3. **Prompt History**
   - Create `HistoryProvider` context.
   - Implement `savePrompt(prompt)` function.
   - Store prompts as an array of objects: `{ id, title, content, timestamp, tags }`.
   - Add functionality to delete individual history items.

4. **Sidebar History UI**
   - Render the list of saved prompts in the Sidebar.
   - Add search input to filter history by title.
   - Implement "Load from History" action (restores form state if applicable).

5. **Draft Autosave**
   - Implement auto-saving of form inputs to `localStorage` on change (debounced).
   - Restore draft on page reload.

## Definition of Done
- API Key persists after page refresh.
- Generated prompts are saved to history.
- History sidebar displays saved prompts.
- User can search history by title.
- Form inputs are restored from drafts/history.
