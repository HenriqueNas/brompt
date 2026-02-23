# C1 Patterns by Thesys

## C1 Orchestration
- **C1 as State Manager**: Use `@crayonai/react-core` (or relevant C1 package) as the primary state orchestration engine.
- **Dynamic Form Generation**: The UI must dynamically render based on C1-provided JSON schemas. Do not hardcode form fields unless they are global configurations (e.g., Tone, Role).
- **Component Lifecycle**: Each C1 component should handle its own loading, error, and success states independently.
- **Custom Components**: Use `C1Component` or similar abstraction provided by the SDK to wrap dynamic components.
- **Event Handling**: Use C1's event system for inter-component communication if available, or lift state up to the orchestrator.

## Component Loading Strategy
- **Granular Loading**: Avoid global loading spinners. Show loading indicators *inside* the specific component being updated (e.g., a button spinner, a skeleton loader for a text area).
- **Optimistic UI**: Where possible, update the UI immediately and revert on failure.
- **Suspense**: Utilize React Suspense boundaries for async components if supported by the C1 integration.

## Schema-Driven UI
- **Schema Format**: JSON schemas define the structure and validation rules for the dynamic form.
- **Validation**: Implement client-side validation based on the schema (e.g., using `zod` or built-in HTML5 validation).
- **Updates**: Changes to the schema should automatically reflect in the UI without code changes (if using a schema-driven form builder).
