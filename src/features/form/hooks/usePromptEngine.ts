import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from '../../../contexts/HistoryContext'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useSettings } from '../../../contexts/SettingsContext'
import { useToast } from '../../../contexts/ToastContext'
import { anthropicProvider } from '../../../lib/llm/providers/anthropic'
import { geminiProvider } from '../../../lib/llm/providers/gemini'
import { groqProvider } from '../../../lib/llm/providers/groq'
import { mistralProvider } from '../../../lib/llm/providers/mistral'
import { openaiProvider } from '../../../lib/llm/providers/openai'
import { LLMProvider, LLMProviderType } from '../../../lib/llm/types'
import { ArchitectSession, PromptSchema, RoundHistory } from '../schema'
import { clearDraft, loadDraft, useAutosaveDraft } from '../useAutosaveDraft'

const MAX_ROUNDS = 10

export const usePromptEngine = () => {
  const { apiKey, selectedProvider, availableModels } = useSettings()
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

  // --- Helpers ---
  const getProvider = useCallback((type: LLMProviderType): LLMProvider => {
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
  }, [])

  // --- Handlers ---

  const handleStartOver = useCallback(() => {
    setGeneratedPrompt(null)
    setRound(0)
    setSeedInput('')
    setHistory([])
    setFormData({})
    showToast(t('form.reset_success'), 'success')
  }, [showToast, t])

  const generateNextRound = useCallback(
    async (goal: string, currentHistory: RoundHistory[]) => {
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
    },
    [apiKey, availableModels, getProvider, language, selectedProvider, t]
  )

  const handleSeedSubmit = useCallback(async () => {
    if (!seedInput.trim()) return
    setLastAction('seed')
    await generateNextRound(seedInput, [])
  }, [generateNextRound, seedInput])

  const handleNextRound = useCallback(async () => {
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
  }, [currentSchema, formData, generateNextRound, history, round, seedInput])

  const handleFinish = useCallback(async () => {
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
  }, [
    apiKey,
    availableModels,
    currentSchema,
    formData,
    getProvider,
    history,
    language,
    round,
    saveSession,
    seedInput,
    selectedProvider,
    t,
  ])

  const handleRetry = useCallback(() => {
    if (lastAction === 'seed') handleSeedSubmit()
    else if (lastAction === 'next') handleNextRound()
    else if (lastAction === 'finish') handleFinish()
  }, [handleFinish, handleNextRound, handleSeedSubmit, lastAction])

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

  // Auto-scrolling
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [round, currentSchema, generatedPrompt])

  // Listen for global reset event from Sidebar
  useEffect(() => {
    const handleResetEvent = () => {
      handleStartOver()
    }
    window.addEventListener('brompt:reset', handleResetEvent)
    return () => window.removeEventListener('brompt:reset', handleResetEvent)
  }, [handleStartOver])

  return {
    // State
    round,
    seedInput,
    setSeedInput,
    history,
    currentSchema,
    formData,
    setFormData,
    isGenerating,
    generatedPrompt,
    error,
    bottomRef,
    MAX_ROUNDS,

    // Handlers
    handleStartOver,
    handleSeedSubmit,
    handleNextRound,
    handleFinish,
    handleRetry,
  }
}
