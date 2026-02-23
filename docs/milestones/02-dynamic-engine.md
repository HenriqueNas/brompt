# Milestone 2: Dynamic Engine Implementation

## Overview
This milestone focuses on integrating the C1 by Thesys engine to render dynamic UI components based on a strict JSON Schema Contract. The goal is to establish a data-driven form architecture where the UI is a direct reflection of the schema state, without yet connecting to a live LLM.

## Impacted Directories
- `src/features/form/` (Form Logic & Components)
- `src/features/schema/` (Schema Definitions & Parsing)
- `src/components/dynamic/` (Atomic UI Elements)

## Functional Requirements (FR)
- **FR1: Dynamic Engine**: Implement logic-driven UI based on JSON schemas.
- **FR6: Form Management**: Basic form handling with validation.

## Non-Functional Requirements (NFR)
- **NFR3: Scalability**: Schema-driven architecture allowing easy updates.
- **NFR4: Tech Stack**: C1 by Thesys integration.

## Tasks

### 1. JSON Schema Contract (`src/features/schema`)
- [ ] **Schema Definition**: Define the strict TypeScript interfaces for the Form Schema (e.g., `FormSchema`, `FieldDefinition`).
- [ ] **Mock Data**: Create a `mock-schema.json` representing the full prompt generation form (Role, Tone, Task, etc.).
- [ ] **Validation Logic**: Implement Zod schemas to validate the incoming JSON structure.

### 2. C1 Engine Integration (`src/features/form`)
- [ ] **Schema Provider**: Create a context/store in C1 to load and hold the active schema.
- [ ] **Dynamic Renderer**: Implement a `SchemaRenderer` component that iterates over the schema and renders the appropriate atomic components.
- [ ] **State Binding**: Ensure each rendered field binds two-way data to the C1 global form state.

### 3. Dynamic Component Library (`src/components/dynamic`)
- [ ] **Atomic Components**: Create generic, accessible wrappers for:
  - `TextInput` / `TextArea`
  - `Select` (Dropdown)
  - `Toggle` / `Checkbox`
  - `Slider`
- [ ] **A11y**: Ensure all inputs have associated labels and ARIA attributes derived from the schema.

### 4. Form State Orchestration (`src/features/form`)
- [ ] **Validation**: Implement client-side validation logic (e.g., required fields) based on the schema rules.
- [ ] **Reset Logic**: Implement a "Reset" action that reverts the form state to default values defined in the schema.

## Definition of Done
- [ ] The application renders a complex form purely from `mock-schema.json`.
- [ ] Changing the JSON file (e.g., adding a field) automatically updates the UI.
- [ ] Form state is correctly managed in C1 (inspectable via dev tools).
- [ ] **A11y Check**: All dynamically generated form fields are accessible via keyboard and screen readers.
