---
alwaysApply: true
---
# Coding Standards & Best Practices

## TypeScript Rules
- **Strict Mode**: `strict: true` must be enabled in `tsconfig.json`.
- **No Implicit Any**: Explicitly type all variables and function parameters. Do not use `any`. Use `unknown` if the type is truly uncertain and narrow it down.
- **Strict Null Checks**: Handle `null` and `undefined` explicitly. Optional chaining (`?.`) and nullish coalescing (`??`) are encouraged.
- **Interfaces over Types**: Use `interface` for object definitions, `type` for unions/intersections.

## Tailwind CSS Best Practices
- **Utility-First**: Avoid custom CSS classes. Use Tailwind utility classes for all styling.
- **Mobile-First**: Design for mobile first, then add responsive prefixes (e.g., `md:`, `lg:`) for larger screens.
- **Consistent Spacing**: Use standard Tailwind spacing scale (e.g., `p-4`, `m-2`).
- **Color Palette**: Stick to the project's defined color theme (likely extended in `tailwind.config.js`).

## Architecture Principles

### Single Page Architecture (SPA)
- **No Client-Side Routing Libraries**: Do not install `react-router-dom` or similar.
- **State-Driven Navigation**: The application should reside primarily on a single route (e.g., `/`).
- **View Management**: Use React state (e.g., `useState`, `useReducer`, or Context) to manage views (Form, History, Settings).
- **Modals**: Use overlays/modals for secondary interactions (Settings, API Key input) instead of navigating to new pages.
- **URL State**: Optionally sync critical state to URL query parameters for shareability, but avoid full page navigations.

### Privacy-First Data Handling
- **Local Storage Only**: All user data (API keys, prompt history, drafts) must be stored in the browser's `localStorage`.
- **No External Backend**: Do not make calls to external servers for data persistence.
- **Gemini API Exception**: The only allowed external API call is to Google's Gemini API for generating prompts.
- **Key Security**: API keys must never be logged or sent to any server other than the Gemini endpoint.

## Internationalization (i18n)
- **Lightweight Pattern**: Use a custom Context and JSON files in `src/locales/`. Do not install heavy libraries unless complexity increases significantly.
- **Key-Based Access**: Always use keys (e.g., `t('settings.api_key')`) instead of hardcoded strings in components.

## Data Access Layer
- **Type-Safe Storage**: All localStorage access must go through a central `src/lib/storage.ts` utility. 
- **No Direct Calls**: Avoid calling `localStorage` directly inside components to ensure consistency and easier debugging of the "Persistence" requirement.