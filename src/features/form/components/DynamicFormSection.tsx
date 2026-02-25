import {
  RiArrowRightSLine,
  RiLoader4Line,
  RiSparklingLine,
} from '@remixicon/react'
import React from 'react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '../../../contexts/LanguageContext'
import { PromptSchema } from '../schema'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'

interface DynamicFormSectionProps {
  currentSchema: PromptSchema
  round: number
  maxRounds: number
  formData: Record<string, unknown>
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
  onNext: () => void
  onFinish: () => void
  isGenerating: boolean
}

export const DynamicFormSection: React.FC<DynamicFormSectionProps> = ({
  currentSchema,
  round,
  maxRounds,
  formData,
  setFormData,
  onNext,
  onFinish,
  isGenerating,
}) => {
  const { t } = useLanguage()

  const handleFieldChange = (id: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
          {currentSchema.title}
        </h2>
        <p className='text-zinc-500 dark:text-zinc-400'>
          Round {round} of {maxRounds}
        </p>
      </div>

      <div className='space-y-10 p-8 rounded-xl border border-brand-20 bg-background dark:border-zinc-800 dark:bg-zinc-900 shadow-sm'>
        {currentSchema.fields.map((field) => (
          <DynamicFieldRenderer
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        ))}
      </div>

      <div className='flex gap-4 pt-4'>
        <Button onClick={onNext} disabled={isGenerating}>
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
        </Button>

        {round >= 3 && (
          <Button onClick={onFinish} disabled={isGenerating}>
            <RiSparklingLine className='text-xl' />
            {t('form.finish_button')}
          </Button>
        )}
      </div>
    </div>
  )
}
