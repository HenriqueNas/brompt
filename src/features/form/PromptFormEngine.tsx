import React from 'react'
import { useHistory } from '../../contexts/HistoryContext'
import { useSettings } from '../../contexts/SettingsContext'
import { ApiKeyWarning } from './components/ApiKeyWarning'
import { DynamicFormSection } from './components/DynamicFormSection'
import { ErrorBanner } from './components/ErrorBanner'
import { PromptProgress } from './components/PromptProgress'
import { ResultSection } from './components/ResultSection'
import { SeedInputSection } from './components/SeedInputSection'
import { usePromptEngine } from './hooks/usePromptEngine'

export const PromptFormEngine: React.FC = () => {
  const { openSettings, apiKey } = useSettings()
  const { activeSession } = useHistory()

  const {
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
    handleStartOver,
    handleSeedSubmit,
    handleNextRound,
    handleFinish,
    handleRetry,
  } = usePromptEngine()

  if (!apiKey) {
    return <ApiKeyWarning onOpenSettings={openSettings} />
  }

  return (
    <div className='space-y-8 pb-20 max-w-3xl mx-auto h-full'>
      <PromptProgress
        round={round}
        history={history}
        activeSession={activeSession}
        generatedPrompt={generatedPrompt}
        maxRounds={MAX_ROUNDS}
      />

      {round === 0 && (
        <SeedInputSection
          seedInput={seedInput}
          setSeedInput={setSeedInput}
          onSubmit={handleSeedSubmit}
          isGenerating={isGenerating}
        />
      )}

      {round > 0 && currentSchema && !generatedPrompt && (
        <DynamicFormSection
          currentSchema={currentSchema}
          round={round}
          maxRounds={MAX_ROUNDS}
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextRound}
          onFinish={handleFinish}
          isGenerating={isGenerating}
        />
      )}

      {error && <ErrorBanner error={error} onRetry={handleRetry} />}

      {generatedPrompt && (
        <ResultSection
          generatedPrompt={generatedPrompt}
          onStartOver={handleStartOver}
        />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
