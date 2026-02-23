# Milestone 1: Foundations & Architecture

## Overview
This milestone establishes the robust architectural foundation of Brompt as a strict Single Page Application (SPA). It focuses on setting up the global state orchestration via C1 by Thesys, implementing a secure local storage strategy, and preparing the internationalization (i18n) framework. The goal is to create a performant, accessible shell ready for dynamic content injection.

## Impacted Directories
- `src/app/` (Layout & Providers)
- `src/components/ui/` (Base Components)
- `src/features/global/` (Global State & Config)
- `src/lib/` (Utilities & Storage)
- `src/i18n/` (Localization Config)

## Functional Requirements (FR)
- **FR7: Single Page Architecture**: Implement the main layout structure with zero client-side routing libraries. All view transitions (e.g., Settings Modal) are state-driven.
- **FR2: Global Config & i18n**: Initialize the i18n structure for English and Portuguese support.
- **FR3: Gemini Integration**: Prepare the secure storage layer for API keys (UI implementation in later steps).

## Non-Functional Requirements (NFR)
- **NFR4: Tech Stack**: Verify React, TypeScript, Tailwind CSS, and C1 SDK setup.
- **NFR1: Performance**: Ensure lightweight initial load and efficient state updates.
- **NFR2: Privacy**: Implement a secure LocalStorage abstraction layer.

## Tasks

### 1. Project Initialization & C1 Setup (`src/app`, `src/features/global`)
- [ ] **Clean & Configure**: Remove default Next.js boilerplate. Ensure `strict: true` in `tsconfig.json`.
- [ ] **C1 Provider Integration**: Wrap the application root in `C1Provider` (or equivalent SDK provider).
- [ ] **Global State Definition**: Define the initial global state schema in C1 (e.g., `{ "currentView": "home", "theme": "system", "language": "en" }`).
- [ ] **State Access**: Create a hook (e.g., `useGlobalState`) to interface with the C1 store for app-wide settings.

### 2. Data Persistence Layer (`src/lib/storage.ts`)
- [ ] **Storage Utility**: Create a `src/lib/storage.ts` utility to handle all `localStorage` operations safely (checking for `window`).
- [ ] **Typed Keys**: Define strict types for storage keys (e.g., `BROMPT_API_KEY`, `BROMPT_THEME`, `BROMPT_LANG`).
- [ ] **Security**: Implement a basic obfuscation or prefixing strategy to prevent accidental overwrites by other apps on localhost.

### 3. Internationalization (i18n) Foundation (`src/i18n`)
- [ ] **i18n Setup**: Initialize a lightweight i18n solution (e.g., `react-i18next` or a custom context).
- [ ] **Locale Files**: Create structured JSON files for `en` and `pt-BR` (e.g., `src/i18n/locales/en.json`).
- [ ] **Language Switcher Logic**: Implement the logic to toggle languages via the C1 global state, persisting the choice to `localStorage`.

### 4. SPA Layout & Base UI (`src/components`, `src/app`)
- [ ] **Tailwind Configuration**: Define the color palette and typography in `tailwind.config.ts` matching the design system.
- [ ] **MainLayout Component**: Create a responsive shell with a Sidebar and Header.
- [ ] **View Management**: Implement conditional rendering for overlays/modals (e.g., API Key Settings) based on C1 state (e.g., `state.isSettingsOpen`).
- [ ] **Accessibility (A11y)**: Ensure the layout supports keyboard navigation (skip links, focus management).

### 5. API Key Modal Skeleton (`src/features/settings`)
- [ ] **Modal Component**: Create a reusable Modal/Dialog component accessible via keyboard (Escape to close).
- [ ] **State Connection**: Connect the modal visibility to the global C1 state.

## Definition of Done
- [ ] Project runs locally without errors and passes strict TypeScript checks.
- [ ] The application renders a responsive shell with Sidebar and Header.
- [ ] `localStorage` operations are typed and functioning via `src/lib/storage.ts`.
- [ ] Switching languages (programmatically or via UI) updates text on the screen.
- [ ] The app is wrapped in the C1 Provider, and global state is accessible.
- [ ] **A11y Check**: The layout is navigable via keyboard (Tab/Enter/Esc), and all interactive elements have appropriate ARIA roles/labels.
