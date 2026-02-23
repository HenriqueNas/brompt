export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: 'select' | 'toggle' | 'slider' | 'multiselect';
  label: string;
  description?: string;
  defaultValue?: string | number | boolean | string[];
  options?: FieldOption[]; // For select/multiselect
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
