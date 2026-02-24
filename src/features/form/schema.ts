export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: 'select' | 'toggle' | 'slider' | 'multiselect' | 'text' | 'textarea';
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean | string[];
  options?: FieldOption[]; // For select/multiselect
  suggestions?: string[]; // For text/textarea auto-complete
  min?: number; // For slider
  max?: number; // For slider
  step?: number; // For slider
  dependsOn?: {
    fieldId: string;
    value: string | boolean;
  };
}

export interface PromptSchema {
  id: string;
  title: string;
  version: string;
  fields: FormField[];
}

export interface RoundHistory {
  round: number;
  question: string;
  answers: Record<string, unknown>;
  schema: PromptSchema;
}

export interface ArchitectSession {
  id: string;
  title: string;
  timestamp: string;
  rounds: RoundHistory[];
  finalPrompt: string;
}

export interface Draft {
  round: number;
  seedInput: string;
  history: RoundHistory[];
  currentSchema: PromptSchema | null;
  formData: Record<string, unknown>;
  timestamp: number;
}
