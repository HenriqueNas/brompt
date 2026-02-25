import { RiArrowRightSLine, RiCloudLine } from '@remixicon/react'
import React from 'react'
import { useLanguage } from '../../../contexts/LanguageContext'
import { ArchitectSession, RoundHistory } from '../schema'

interface PromptProgressProps {
  round: number
  history: RoundHistory[]
  activeSession: ArchitectSession | null
  generatedPrompt: string | null
  maxRounds: number
}

export const PromptProgress: React.FC<PromptProgressProps> = ({
  round,
  history,
  activeSession,
  generatedPrompt,
  maxRounds,
}) => {
  const { t } = useLanguage()

  if (round <= 0) return null

  return (
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
          style={{ width: `${Math.min((round / maxRounds) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}
