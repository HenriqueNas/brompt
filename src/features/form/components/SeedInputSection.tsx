import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { RiArrowRightLine, RiLoader4Line } from '@remixicon/react'
import React from 'react'
import { useLanguage } from '../../../contexts/LanguageContext'

interface SeedInputSectionProps {
  seedInput: string
  setSeedInput: (value: string) => void
  onSubmit: () => void
  isGenerating: boolean
}

export const SeedInputSection: React.FC<SeedInputSectionProps> = ({
  seedInput,
  setSeedInput,
  onSubmit,
  isGenerating,
}) => {
  const { t } = useLanguage()

  const getExamples = () => {
    return [t('examples.0'), t('examples.1'), t('examples.2'), t('examples.3')]
  }

  return (
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-between'>
      <div>
        <div className='text-left space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-300 to-blue-600 bg-clip-text text-transparent'>
            {t('form.seed_label')}
          </h1>
          <p className='text-lg text-zinc-500 dark:text-zinc-400 mb-8'>
            {t('form.seed_description')}
          </p>
        </div>

        <div className='space-y-4'>
          <Textarea
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            placeholder={t('form.seed_placeholder')}
            className='w-full p-6 text-lg transition-all min-h-37.5 resize-none'
          />

          <div className='flex flex-wrap gap-2 justify-start'>
            {getExamples().map((ex, i) => (
              <Button
                key={i}
                onClick={() => setSeedInput(ex)}
                variant='ghost'
                size='sm'
              >
                {ex}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!seedInput.trim() || isGenerating}
        className='w-full'
        size='lg'
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
      </Button>
    </div>
  )
}
