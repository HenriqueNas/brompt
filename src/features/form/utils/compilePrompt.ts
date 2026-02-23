
import { PromptSchema } from '../schema';

export const compilePrompt = (formState: Record<string, unknown>, schema: PromptSchema): string => {
  const parts: string[] = [];

  // Extract key fields (safely)
  const category = formState.category ? String(formState.category) : 'General';
  const detailLevel = formState.detailLevel ? Number(formState.detailLevel) : 3;
  const includeAccessibility = !!formState.includeAccessibility;
  
  const preferredStack = Array.isArray(formState.preferredStack) 
    ? formState.preferredStack.join(', ') 
    : '';

  // Build the prompt specification for the LLM
  parts.push(`Target Role: ${category.charAt(0).toUpperCase() + category.slice(1)} Engineer`);
  
  if (preferredStack) {
    parts.push(`Tech Stack: ${preferredStack}`);
  }
  
  parts.push(`Detail Level: ${detailLevel}/5`);
  
  if (includeAccessibility) {
    parts.push(`Requirement: Include Accessibility (WCAG) checks`);
  }

  // Generic handling for other fields that might be in schema but not explicitly handled above
  schema.fields.forEach(field => {
    if (['category', 'detailLevel', 'includeAccessibility', 'preferredStack'].includes(field.id)) {
      return;
    }
    const value = formState[field.id];
    if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
       parts.push(`${field.label}: ${value}`);
    }
  });

  return parts.join('\n');
};
