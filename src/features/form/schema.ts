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
