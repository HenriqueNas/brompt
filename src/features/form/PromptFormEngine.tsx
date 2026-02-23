import React, { useState, useEffect, useRef } from 'react';
import { PromptSchema, FormField } from './schema';
import { DynamicSelect } from './components/DynamicSelect';
import { DynamicToggle } from './components/DynamicToggle';
import { DynamicSlider } from './components/DynamicSlider';
import { DynamicMultiSelect } from './components/DynamicMultiSelect';
import { geminiProvider } from '../../lib/llm/providers/gemini';
import { storage } from '../../lib/storage';
import { MarkdownPreview } from '../output/MarkdownPreview';
import { Loader2, Sparkles, AlertCircle, ArrowRight, Check, ChevronRight, Settings } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

// --- Types ---
interface RoundHistory {
  round: number;
  question: string; // The goal or previous context
  answers: Record<string, unknown>;
  schema: PromptSchema;
}

// --- Constants ---
const MAX_ROUNDS = 10;
const SEED_EXAMPLES = [
  "Create a startup pitch for a fintech app",
  "Analyze software architecture of a monolithic app",
  "Write a technical blog post about React Server Components",
  "Generate a SQL query for user retention analysis"
];

export const PromptFormEngine: React.FC = () => {
  const { openSettings, apiKey } = useSettings();
  
  // --- State ---
  const [round, setRound] = useState(0);
  const [seedInput, setSeedInput] = useState('');
  const [history, setHistory] = useState<RoundHistory[]>([]);
  const [currentSchema, setCurrentSchema] = useState<PromptSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  
  // LLM State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref for auto-scrolling
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [round, currentSchema, generatedPrompt]);

  const hasApiKey = !!apiKey;

  // --- Handlers ---

  const handleSeedSubmit = async () => {
    if (!seedInput.trim()) return;
    await generateNextRound(seedInput, []);
  };

  const handleNextRound = async () => {
    // Save current round to history
    if (currentSchema) {
      const newHistoryItem: RoundHistory = {
        round,
        question: round === 1 ? seedInput : `Round ${round}`,
        answers: { ...formData },
        schema: currentSchema
      };
      const newHistory = [...history, newHistoryItem];
      setHistory(newHistory);
      
      // Generate next round
      await generateNextRound(seedInput, newHistory);
    }
  };

  const generateNextRound = async (goal: string, currentHistory: RoundHistory[]) => {
    setError(null);
    setIsGenerating(true);
    
    if (!apiKey) {
      setError("API Key is missing.");
      setIsGenerating(false);
      return;
    }

    try {
      // Construct context for Gemini
      const historyContext = currentHistory.map(h => ({
        round: h.round,
        answers: h.answers
      }));

      const systemPrompt = `
You are an expert AI Architect helping a user craft a perfect prompt.
Current Goal: "${goal}"
Interaction History: ${JSON.stringify(historyContext)}
Current Round: ${currentHistory.length + 1} of ${MAX_ROUNDS}

Your task is to generate the NEXT set of questions (1-3 fields) to ask the user to refine their prompt.
- Focus on what's missing (context, tone, constraints, format, audience).
- If the goal is clear, ask for specific details.
- Provide "suggestions" for text inputs where helpful.
- Return ONLY a valid JSON object matching this schema:
{
  "title": "Title for this section",
  "fields": [
    {
      "id": "unique_id",
      "type": "select" | "toggle" | "slider" | "multiselect" | "text" | "textarea",
      "label": "Question label",
      "description": "Helper text",
      "placeholder": "Placeholder text",
      "options": [{"label": "A", "value": "a"}] (for select/multiselect),
      "suggestions": ["suggestion1", "suggestion2"] (for text/textarea),
      "min": 0, "max": 100, "step": 1 (for slider)
    }
  ]
}
Do not include markdown formatting (like \`\`\`json). Just the raw JSON.
`;

      const result = await geminiProvider.generate(apiKey, systemPrompt);
      
      // Parse JSON
      let cleanResult = result.trim();
      // Remove markdown code blocks if present
      if (cleanResult.startsWith('```json')) {
        cleanResult = cleanResult.replace(/^```json/, '').replace(/```$/, '');
      } else if (cleanResult.startsWith('```')) {
        cleanResult = cleanResult.replace(/^```/, '').replace(/```$/, '');
      }
      
      const schemaData = JSON.parse(cleanResult);
      
      // Update State
      setCurrentSchema({
        id: `round-${currentHistory.length + 1}`,
        version: '1.0',
        title: schemaData.title || `Round ${currentHistory.length + 1}`,
        fields: schemaData.fields
      });
      
      // Reset form data for new fields, but keep global context if we were merging (here we reset for new round)
      setFormData({}); 
      setRound(prev => prev + 1);

    } catch (err: unknown) {
      console.error(err);
      setError("Failed to generate next questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = async () => {
    setError(null);
    setIsGenerating(true);
    setGeneratedPrompt(null);

    if (!apiKey) return;

    try {
        // Collect all history including current form data
        const fullHistory = [...history];
        if (currentSchema) {
            fullHistory.push({
                round,
                question: `Round ${round}`,
                answers: { ...formData },
                schema: currentSchema
            });
        }

        const context = JSON.stringify(fullHistory.map(h => ({
            round: h.round,
            answers: h.answers
        })), null, 2);

        const metaPrompt = `
You are an expert Prompt Engineer.
Create a comprehensive, structured, and high-quality system prompt based on the user's goal and their answers to the refinement questions.

User Goal: "${seedInput}"
Refinement History:
${context}

The output should be the raw prompt text, ready to be copied and used in an LLM.
Use Markdown for formatting.
`;

      const result = await geminiProvider.generate(apiKey, metaPrompt);
      setGeneratedPrompt(result);
    } catch (err) {
      setError("Failed to generate final prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Render Helpers ---

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      label: field.label,
      description: field.description,
    };

    const value = formData[field.id];

    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
            <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {field.label}
                </label>
                {field.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{field.description}</p>
                )}
                {field.type === 'textarea' ? (
                    <textarea
                        className="w-full p-3 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-25"
                        placeholder={field.placeholder}
                        value={String(value || '')}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                ) : (
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder={field.placeholder}
                        value={String(value || '')}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                )}
                {field.suggestions && field.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {field.suggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => setFormData(prev => ({ ...prev, [field.id]: s }))}
                                className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
      case 'select':
        return (
          <DynamicSelect
            key={field.id}
            {...commonProps}
            value={String(value || '')}
            options={field.options || []}
            onChange={(val) => setFormData(prev => ({ ...prev, [field.id]: val }))}
          />
        );
      case 'toggle':
        return (
          <DynamicToggle
            key={field.id}
            {...commonProps}
            checked={Boolean(value)}
            onChange={(val) => setFormData(prev => ({ ...prev, [field.id]: val }))}
          />
        );
      case 'slider':
        return (
          <DynamicSlider
            key={field.id}
            {...commonProps}
            value={Number(value || field.min || 0)}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
            onChange={(val) => setFormData(prev => ({ ...prev, [field.id]: val }))}
          />
        );
      case 'multiselect':
        return (
          <DynamicMultiSelect
            key={field.id}
            {...commonProps}
            value={(value as string[]) || []}
            options={field.options || []}
            onChange={(val) => setFormData(prev => ({ ...prev, [field.id]: val }))}
          />
        );
      default:
        return null;
    }
  };

  // --- Main Render ---

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-4 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">API Key Required</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            To start architecting your prompts with AI guidance, you need to configure your Gemini API Key.
          </p>
        </div>
        <button
          onClick={openSettings}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Settings className="w-5 h-5" />
          Open Settings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto">
      {/* Breadcrumbs / Progress */}
      {round > 0 && (
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-200 dark:border-zinc-800 -mx-6 px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${round > 0 ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                <span className="font-bold">#0</span>
                <span>Seed</span>
            </div>
            {history.map((h, i) => (
                <React.Fragment key={i}>
                    <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 whitespace-nowrap">
                        <span className="font-bold">#{h.round}</span>
                        <span className="truncate max-w-25">{h.schema.title}</span>
                    </div>
                </React.Fragment>
            ))}
             <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900 text-zinc-50 border border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 whitespace-nowrap animate-pulse">
                <span className="font-bold">#{round}</span>
                <span>Current</span>
            </div>
          </div>
          <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${Math.min((round / MAX_ROUNDS) * 100, 100)}%` }}
              />
          </div>
        </div>
      )}

      {/* Round 0: Seed Input */}
      {round === 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              What do you want to build?
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Describe your goal, and I'll interview you to craft the perfect prompt.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="e.g., I need a prompt to generate unit tests for a React component..."
              className="w-full p-6 text-lg rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-37.5 resize-none"
            />
            
            <div className="flex flex-wrap gap-2 justify-center">
              {SEED_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSeedInput(ex)}
                  className="px-4 py-2 text-sm rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSeedSubmit}
            disabled={!seedInput.trim() || isGenerating}
            className="w-full py-4 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Goal...
              </>
            ) : (
              <>
                Start Architecting
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Rounds 1+: Dynamic Form */}
      {round > 0 && currentSchema && !generatedPrompt && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {currentSchema.title}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Round {round} of {MAX_ROUNDS}
            </p>
          </div>

          <div className="space-y-6 p-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            {currentSchema.fields.map((field) => renderField(field))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleNextRound}
              disabled={isGenerating}
              className="flex-1 py-3 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  Next Round
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {round >= 3 && (
                <button
                    onClick={handleFinish}
                    disabled={isGenerating}
                    className="py-3 px-6 rounded-lg font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    Finish & Generate
                </button>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Final Result */}
      {generatedPrompt && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your Architected Prompt</h3>
             <button
                onClick={() => {
                    setGeneratedPrompt(null);
                    setRound(0);
                    setSeedInput('');
                    setHistory([]);
                    setFormData({});
                }}
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 underline"
            >
                Start Over
            </button>
          </div>
          <MarkdownPreview content={generatedPrompt} />
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};
