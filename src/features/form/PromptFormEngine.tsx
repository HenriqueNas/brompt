import React, { useState, useEffect } from 'react';
import { PromptSchema, FormField } from './schema';
import mockSchema from './mocks/code-review-schema.json';
import { DynamicSelect } from './components/DynamicSelect';
import { DynamicToggle } from './components/DynamicToggle';
import { DynamicSlider } from './components/DynamicSlider';
import { DynamicMultiSelect } from './components/DynamicMultiSelect';

// Using the mock schema as the source of truth for now
const SCHEMA = mockSchema as unknown as PromptSchema;

export const PromptFormEngine: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    SCHEMA.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });
    return initialData;
  });
  const [generatedTitle, setGeneratedTitle] = useState<string>('');

  // Handle field updates
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Check if a field should be visible based on dependencies
  const isFieldVisible = (field: FormField) => {
    if (!field.dependsOn) return true;
    
    const { fieldId, value } = field.dependsOn;
    const dependencyValue = formData[fieldId];
    
    return dependencyValue === value;
  };

  // Auto-generate title logic
  useEffect(() => {
    if (!formData.category) return;

    let title = `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} Code Review`;
    
    if (formData.preferredStack && formData.preferredStack.length > 0) {
      const stack = formData.preferredStack.join(', ');
      title += ` for ${stack}`;
    }

    if (formData.detailLevel) {
        title += ` (Level ${formData.detailLevel})`;
    }

    setGeneratedTitle(title);
  }, [formData]);

  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;

    const commonProps = {
      key: field.id,
      id: field.id,
      label: field.label,
      description: field.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: formData[field.id] as any, // Type assertion for generic value
    };

    switch (field.type) {
      case 'select':
        return (
          <DynamicSelect
            {...commonProps}
            options={field.options || []}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      case 'toggle':
        return (
          <DynamicToggle
            {...commonProps}
            checked={!!formData[field.id]}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      case 'slider':
        return (
          <DynamicSlider
            {...commonProps}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      case 'multiselect':
        return (
          <DynamicMultiSelect
            {...commonProps}
            options={field.options || []}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {generatedTitle || 'New Prompt'}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Configure your prompt parameters below.
        </p>
      </div>

      <div className="space-y-6">
        {SCHEMA.fields.map((field) => renderField(field))}
      </div>

      {/* Debugging View (Optional) */}
      {/* <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
        <h3 className="text-sm font-medium mb-2">Form State (Debug)</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div> */}
    </div>
  );
};
