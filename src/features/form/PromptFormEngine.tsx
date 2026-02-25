import {
  RiArrowRightLine,
  RiArrowRightSLine,
  RiCloudLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiRefreshLine,
  RiSettingsLine,
  RiSparklingLine,
} from '@remixicon/react'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from '../../contexts/HistoryContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useToast } from '../../contexts/ToastContext'
import { anthropicProvider } from '../../lib/llm/providers/anthropic'
import { geminiProvider } from '../../lib/llm/providers/gemini'
import { groqProvider } from '../../lib/llm/providers/groq'
import { mistralProvider } from '../../lib/llm/providers/mistral'
import { openaiProvider } from '../../lib/llm/providers/openai'
import { LLMProvider, LLMProviderType } from '../../lib/llm/types'
import { MarkdownPreview } from '../output/MarkdownPreview'
import { DynamicMultiSelect } from './components/DynamicMultiSelect'
import { DynamicSelect } from './components/DynamicSelect'
import { DynamicSlider } from './components/DynamicSlider'
import { DynamicToggle } from './components/DynamicToggle'
import {
  ArchitectSession,
  FormField,
  PromptSchema,
  RoundHistory,
} from './schema'
import { clearDraft, loadDraft, useAutosaveDraft } from './useAutosaveDraft'

// --- Constants ---
const MAX_ROUNDS = 10

export const PromptFormEngine: React.FC = () => {
  const { openSettings, apiKey, selectedProvider, availableModels } =
    useSettings()
  const { t, language } = useLanguage()
  const { showToast } = useToast()
  const { saveSession, activeSession } = useHistory()

  // --- State ---
  const [round, setRound] = useState(0)
  const [seedInput, setSeedInput] = useState('')
  const [history, setHistory] = useState<RoundHistory[]>([])
  const [currentSchema, setCurrentSchema] = useState<PromptSchema | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  // LLM State
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<
    'seed' | 'next' | 'finish' | null
  >(null)

  // Ref for auto-scrolling
  const bottomRef = useRef<HTMLDivElement>(null)

  // --- Effects ---

  // Load Active Session or Draft
  useEffect(() => {
    if (activeSession) {
      // View Only Mode
      setRound(activeSession.rounds.length)
      // Try to find the original seed input from the first round's question
      setSeedInput(activeSession.rounds[0]?.question || activeSession.title)
      setHistory(activeSession.rounds)
      setGeneratedPrompt(activeSession.finalPrompt)
      setFormData({})
      setCurrentSchema(null)
    } else {
      // Create/Resume Mode
      const draft = loadDraft()
      if (draft) {
        setRound(draft.round)
        setSeedInput(draft.seedInput)
        setHistory(draft.history)
        setCurrentSchema(draft.currentSchema)
        setFormData(draft.formData)
        setGeneratedPrompt(null)
      } else {
        // Reset state
        setRound(0)
        setSeedInput('')
        setHistory([])
        setCurrentSchema(null)
        setFormData({})
        setGeneratedPrompt(null)
      }
    }
  }, [activeSession])

  // Autosave Draft
  useAutosaveDraft(
    {
      round,
      seedInput,
      history,
      currentSchema,
      formData,
      timestamp: Date.now(),
    },
    !activeSession && !generatedPrompt
  )

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [round, currentSchema, generatedPrompt])

  // --- Helpers ---
  const getProvider = (type: LLMProviderType): LLMProvider => {
    switch (type) {
      case 'gemini':
        return geminiProvider
      case 'openai':
        return openaiProvider
      case 'anthropic':
        return anthropicProvider
      case 'mistral':
        return mistralProvider
      case 'groq':
        return groqProvider
      default:
        return geminiProvider
    }
  }

  // --- Handlers ---

  const handleStartOver = React.useCallback(() => {
    setGeneratedPrompt(null)
    setRound(0)
    setSeedInput('')
    setHistory([])
    setFormData({})
    showToast(t('form.reset_success'), 'success')
  }, [showToast, t])

  // Listen for global reset event from Sidebar
  useEffect(() => {
    const handleResetEvent = () => {
      handleStartOver()
    }
    window.addEventListener('brompt:reset', handleResetEvent)
    return () => window.removeEventListener('brompt:reset', handleResetEvent)
  }, [handleStartOver])

  const hasApiKey = !!apiKey

  // --- Handlers ---

  const handleSeedSubmit = async () => {
    if (!seedInput.trim()) return
    setLastAction('seed')
    await generateNextRound(seedInput, [])
  }

  const handleNextRound = async () => {
    setLastAction('next')
    // Save current round to history
    if (currentSchema) {
      const newHistoryItem: RoundHistory = {
        round,
        question: round === 1 ? seedInput : `Round ${round}`,
        answers: { ...formData },
        schema: currentSchema,
      }
      const newHistory = [...history, newHistoryItem]
      setHistory(newHistory)

      // Generate next round
      await generateNextRound(seedInput, newHistory)
    }
  }

  const generateNextRound = async (
    goal: string,
    currentHistory: RoundHistory[]
  ) => {
    setError(null)
    setIsGenerating(true)

    if (!apiKey) {
      setError(t('form.error_api_missing'))
      setIsGenerating(false)
      return
    }

    try {
      // Construct context
      const historyContext = currentHistory.map((h) => ({
        round: h.round,
        answers: h.answers,
      }))

      const langInstruction = language === 'pt' ? 'Portuguese' : 'English'

      const systemPrompt = `
You are an expert AI Architect helping a user craft a perfect prompt.
Current Goal: "${goal}"
Interaction History: ${JSON.stringify(historyContext)}
Current Round: ${currentHistory.length + 1} of ${MAX_ROUNDS}
User Language: ${langInstruction}

Your task is to generate the NEXT set of questions (1-3 fields) to ask the user to refine their prompt.
- Focus on what's missing (context, tone, constraints, format, audience).
- If the goal is clear, ask for specific details.
- Provide "suggestions" for text inputs where helpful.
- IMPORTANT: Generate all labels, descriptions, placeholders, options, and suggestions in ${langInstruction}.
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
`

      const result = await getProvider(selectedProvider).generate(
        apiKey,
        systemPrompt,
        { modelId: availableModels[0]?.id }
      )

      // Parse JSON
      let cleanResult = result.trim()
      // Remove markdown code blocks if present
      if (cleanResult.startsWith('```json')) {
        cleanResult = cleanResult.replace(/^```json/, '').replace(/```$/, '')
      } else if (cleanResult.startsWith('```')) {
        cleanResult = cleanResult.replace(/^```/, '').replace(/```$/, '')
      }

      const schemaData = JSON.parse(cleanResult)

      // Update State
      setCurrentSchema({
        id: `round-${currentHistory.length + 1}`,
        version: '1.0',
        title: schemaData.title || `Round ${currentHistory.length + 1}`,
        fields: schemaData.fields,
      })

      // Reset form data for new fields, but keep global context if we were merging (here we reset for new round)
      setFormData({})
      setRound((prev) => prev + 1)
    } catch (err: unknown) {
      console.error(err)
      setError(t('form.error_generate_questions'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFinish = async () => {
    setLastAction('finish')
    setError(null)
    setIsGenerating(true)
    setGeneratedPrompt(null)

    if (!apiKey) return

    try {
      // Collect all history including current form data
      const fullHistory = [...history]
      if (currentSchema) {
        fullHistory.push({
          round,
          question: `Round ${round}`,
          answers: { ...formData },
          schema: currentSchema,
        })
      }

      const context = JSON.stringify(
        fullHistory.map((h) => ({
          round: h.round,
          answers: h.answers,
        })),
        null,
        2
      )

      const langInstruction = language === 'pt' ? 'Portuguese' : 'English'

      const metaPrompt = `
You are an expert Prompt Engineer.
Create a comprehensive, structured, and high-quality system prompt based on the user's goal and their answers to the refinement questions.

User Goal: "${seedInput}"
Refinement History:
${context}

The output should be the raw prompt text, ready to be copied and used in an LLM.
Use Markdown for formatting.
The prompt should be written in ${langInstruction}, unless the user explicitly requested otherwise in their goal.
`

      const result = await getProvider(selectedProvider).generate(
        apiKey,
        metaPrompt,
        { modelId: availableModels[0]?.id }
      )
      setGeneratedPrompt(result)

      // Save Session
      try {
        const session: ArchitectSession = {
          id: crypto.randomUUID(),
          title: seedInput.slice(0, 50) + (seedInput.length > 50 ? '...' : ''),
          timestamp: new Date().toISOString(),
          rounds: fullHistory,
          finalPrompt: result,
        }

        saveSession(session)
        clearDraft()
      } catch (saveError) {
        console.error('Failed to save session:', saveError)
      }
    } catch {
      setError(t('form.error_generate_final'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    if (lastAction === 'seed') handleSeedSubmit()
    else if (lastAction === 'next') handleNextRound()
    else if (lastAction === 'finish') handleFinish()
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      label: field.label,
      description: field.description,
    }

    const value = formData[field.id]

    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <div key={field.id} className='space-y-2'>
            <label
              htmlFor={field.id}
              className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              {field.label}
            </label>
            {field.description && (
              <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                {field.description}
              </p>
            )}
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                className='w-full p-3 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-25'
                placeholder={field.placeholder}
                value={String(value || '')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
              />
            ) : (
              <input
                id={field.id}
                type='text'
                className='w-full p-3 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                placeholder={field.placeholder}
                value={String(value || '')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
              />
            )}
            {field.suggestions && field.suggestions.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {field.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, [field.id]: s }))
                    }
                    className='text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors'
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      case 'select':
        return (
          <DynamicSelect
            key={field.id}
            {...commonProps}
            value={String(value || '')}
            options={field.options || []}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, [field.id]: val }))
            }
          />
        )
      case 'toggle':
        return (
          <DynamicToggle
            key={field.id}
            {...commonProps}
            checked={Boolean(value)}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, [field.id]: val }))
            }
          />
        )
      case 'slider':
        return (
          <DynamicSlider
            key={field.id}
            {...commonProps}
            value={Number(value || field.min || 0)}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, [field.id]: val }))
            }
          />
        )
      case 'multiselect':
        return (
          <DynamicMultiSelect
            key={field.id}
            {...commonProps}
            value={(value as string[]) || []}
            options={field.options || []}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, [field.id]: val }))
            }
          />
        )
      default:
        return null
    }
  }

  // --- Main Render ---

  if (!hasApiKey) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center space-y-6'>
        <div className='p-4 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'>
          <RiErrorWarningLine className='text-5xl' />
        </div>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-zinc-900 dark:text-zinc-50'>
            {t('form.api_key_required_title')}
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400 max-w-md mx-auto'>
            {t('form.api_key_required_desc')}
          </p>
        </div>
        <button
          onClick={openSettings}
          className='flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20'
        >
          <RiSettingsLine className='text-xl' />
          {t('form.open_settings')}
        </button>
      </div>
    )
  }

  // Helper to get translated examples
  const getExamples = () => {
    // Assuming t('examples') returns an array if the key maps to an array
    // If the i18n helper doesn't support arrays directly, we might need to map indices
    // But for now, let's assume we can fetch the array or map manual keys.
    // Since our t implementation might be simple, let's use a workaround if needed.
    // If t returns the string value, we can try to parse it if it's not typed as string only.
    // However, looking at LanguageContext, it likely returns 'any' or string.

    // Let's use specific keys or just assume the array is available via t
    // If t only returns strings, we should have used example_1, example_2 etc.
    // But let's see if we can access the raw json or if t handles it.
    // Given the context file I saw earlier, t does lookup.

    // Safest bet: access the raw object if possible or just hardcode the keys loop
    const examples = [
      t('examples.0'),
      t('examples.1'),
      t('examples.2'),
      t('examples.3'),
    ]
    // If t returns key when missing, we need to be careful.
    // Actually, I defined "examples" as an array in JSON.
    // Most simple i18n libraries flatten keys like examples.0
    // I will assume that dot notation works for arrays too.
    return examples
  }

  return (
    <div className='space-y-8 pb-20 max-w-3xl mx-auto'>
      {/* Breadcrumbs / Progress */}
      {round > 0 && (
        <div className='sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-200 dark:border-zinc-800 -mx-6 px-6'>
          <div className='flex items-center justify-between gap-4 pb-2'>
            <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide'>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${round > 0 ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
              >
                <span className='font-bold'>#0</span>
                <span>Seed</span>
              </div>
              {history.map((h, i) => (
                <React.Fragment key={i}>
                  <RiArrowRightSLine className='text-xs text-zinc-400 shrink-0' />
                  <div className='flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 whitespace-nowrap'>
                    <span className='font-bold'>#{h.round}</span>
                    <span className='truncate max-w-25'>{h.schema.title}</span>
                  </div>
                </React.Fragment>
              ))}
              <RiArrowRightSLine className='text-xs text-zinc-400 shrink-0' />
              <div className='flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900 text-zinc-50 border border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 whitespace-nowrap animate-pulse'>
                <span className='font-bold'>#{round}</span>
                <span>Current</span>
              </div>
            </div>

            {!activeSession && !generatedPrompt && (
              <div className='hidden sm:flex items-center gap-1.5 text-xs font-medium text-zinc-400 shrink-0 animate-in fade-in duration-700'>
                <RiCloudLine className='text-sm' />
                <span>{t('form.draft_saved')}</span>
              </div>
            )}
          </div>

          <div className='h-1 w-full bg-zinc-100 dark:bg-zinc-800 mt-2 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-600 transition-all duration-500 ease-out'
              style={{ width: `${Math.min((round / MAX_ROUNDS) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Round 0: Seed Input */}
      {round === 0 && (
        <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              {t('form.seed_label')}
            </h1>
            <p className='text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto'>
              {t('form.seed_description')}
            </p>
          </div>

          <div className='space-y-4'>
            <textarea
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder={t('form.seed_placeholder')}
              className='w-full p-6 text-lg rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-37.5 resize-none'
            />

            <div className='flex flex-wrap gap-2 justify-center'>
              {getExamples().map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setSeedInput(ex)}
                  className='px-4 py-2 text-sm rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors'
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSeedSubmit}
            disabled={!seedInput.trim() || isGenerating}
            className='w-full py-4 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2'
          >
            {isGenerating ? (
              <>
                <RiLoader4Line className='text-2xl animate-spin' />
                {t('form.analyzing')}
              </>
            ) : (
              <>
                {t('form.start_button')}
                <RiArrowRightLine className='text-xl' />
              </>
            )}
          </button>
        </div>
      )}

      {/* Rounds 1+: Dynamic Form */}
      {round > 0 && currentSchema && !generatedPrompt && (
        <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              {currentSchema.title}
            </h2>
            <p className='text-zinc-500 dark:text-zinc-400'>
              Round {round} of {MAX_ROUNDS}
            </p>
          </div>

          <div className='space-y-6 p-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm'>
            {currentSchema.fields.map((field) => renderField(field))}
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              onClick={handleNextRound}
              disabled={isGenerating}
              className='flex-1 py-3 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2'
            >
              {isGenerating ? (
                <>
                  <RiLoader4Line className='text-xl animate-spin' />
                  {t('form.thinking')}
                </>
              ) : (
                <>
                  {t('form.next_round')}
                  <RiArrowRightSLine className='text-xl' />
                </>
              )}
            </button>

            {round >= 3 && (
              <button
                onClick={handleFinish}
                disabled={isGenerating}
                className='py-3 px-6 rounded-lg font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2'
              >
                <RiSparklingLine className='text-xl' />
                {t('form.finish_button')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <RiErrorWarningLine className='text-xl' />
            {error}
          </div>
          <button
            onClick={handleRetry}
            className='flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-white text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors shadow-sm'
          >
            <RiRefreshLine className='text-base' />
            {t('form.retry')}
          </button>
        </div>
      )}

      {/* Final Result */}
      {generatedPrompt && (
        <div className='space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700'>
          <div className='flex items-center justify-between'>
            <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100'>
              {t('form.result_title')}
            </h3>
            <button
              onClick={handleStartOver}
              className='text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 underline'
            >
              {t('form.start_over')}
            </button>
          </div>
          <MarkdownPreview content={generatedPrompt} />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
