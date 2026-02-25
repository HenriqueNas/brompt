import React from 'react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '../../../contexts/LanguageContext'
import { MarkdownPreview } from '../../output/MarkdownPreview'

interface ResultSectionProps {
  generatedPrompt: string
  onStartOver: () => void
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  generatedPrompt,
  onStartOver,
}) => {
  const { t } = useLanguage()

  return (
    <div className='space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100'>
          {t('form.result_title')}
        </h3>
        <Button onClick={onStartOver}>{t('form.start_over')}</Button>
      </div>
      <MarkdownPreview content={generatedPrompt} />
    </div>
  )
}
