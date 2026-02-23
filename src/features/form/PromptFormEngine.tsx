
import React, { useState, useEffect } from 'react';
import { PromptSchema, FormField } from './schema';
import mockSchema from './mocks/code-review-schema.json';
import { DynamicSelect } from './components/DynamicSelect';
import { DynamicToggle } from './components/DynamicToggle';
import { DynamicSlider } from './components/DynamicSlider';
import { DynamicMultiSelect } from './components/DynamicMultiSelect';
import { compilePrompt } from './utils/compilePrompt';
import { geminiProvider } from '../../lib/llm/providers/gemini';
import { storage } from '../../lib/storage';
import { MarkdownPreview } from '../output/MarkdownPreview';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

// Using the mock schema as the source of truth for now
const SCHEMA = mockSchema as unknown as PromptSchema;

export const PromptFormEngine: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initialData: Record<string, unknown> = {};
    SCHEMA.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });
    return initialData;
  });
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  
  // LLM Integration State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check for API key on mount
    // In a real app with settings modal, we'd want to listen to changes or use a context
    const checkKey = () => {
      const key = storage.getItem('gemini_api_key', '');
      setHasApiKey(!!key);
    };
    
    checkKey();
    
    // Optional: poll every few seconds if we expect the user to set it in another tab/modal
    // const interval = setInterval(checkKey, 2000);
    // return () => clearInterval(interval);
  }, []);

  // Handle field updates
  const handleFieldChange = (fieldId: string, value: unknown) => {
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
    const category = formData.category as string;
    if (!category) return;

    let title = `${category.charAt(0).toUpperCase() + category.slice(1)} Code Review`;
    
    const preferredStack = formData.preferredStack as string[] | undefined;
    if (preferredStack && preferredStack.length > 0) {
      const stack = preferredStack.join(', ');
      title += ` for ${stack}`;
    }

    if (formData.detailLevel) {
        title += ` (Level ${formData.detailLevel})`;
    }

    setGeneratedTitle(title);
  }, [formData]);

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    setGeneratedPrompt(null);

    const apiKey = storage.getItem('gemini_api_key', '');
    if (!apiKey) {
      setError("API Key is missing. Please configure it in Settings.");
      setIsGenerating(false);
      return;
    }

    try {
      // 1. Compile the context from the form
      const context = compilePrompt(formData, SCHEMA);
      
      // 2. Construct the meta-prompt for Gemini
      const metaPrompt = `
You are an expert Prompt Engineer.
Create a comprehensive, structured, and high-quality system prompt based on the following requirements:

${context}

The output should be the raw prompt text, ready to be copied and used in an LLM.
Do not include any introductory or concluding remarks, just the prompt itself.
Use Markdown for formatting.
`;

      // 3. Call Gemini
      const result = await geminiProvider.generate(apiKey, metaPrompt);
      
      setGeneratedPrompt(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || "An error occurred while generating the prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;

    const commonProps = {
      key: field.id,
      id: field.id,
      label: field.label,
      description: field.description,
    };

    const fieldValue = formData[field.id];

    switch (field.type) {
      case 'select':
        return (
          <DynamicSelect
            {...commonProps}
            value={String(fieldValue || '')}
            options={field.options || []}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      case 'toggle':
        return (
          <DynamicToggle
            {...commonProps}
            checked={Boolean(fieldValue)}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      case 'slider':
        return (
          <DynamicSlider
            {...commonProps}
            value={Number(fieldValue || field.min || 0)}
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
            value={(fieldValue as string[]) || []}
            options={field.options || []}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
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

      {/* Generation Section */}
      <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col gap-4">
          {!hasApiKey && (
            <div className="flex items-center gap-2 p-3 text-sm text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span>Please add your Gemini API Key in Settings to generate prompts.</span>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={!hasApiKey || isGenerating}
            className={`
              flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium text-white transition-all
              ${!hasApiKey 
                ? 'bg-zinc-400 cursor-not-allowed opacity-70 dark:bg-zinc-700' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow-md'
              }
              ${isGenerating ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Prompt...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Prompt
              </>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-md bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Result Section */}
      {generatedPrompt && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Generated Prompt</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Ready
            </span>
          </div>
          <MarkdownPreview content={generatedPrompt} />
        </div>
      )}
    </div>
  );
};
