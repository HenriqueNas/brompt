import { Button } from '@/components/ui/Button'
import { RiErrorWarningLine, RiSettingsLine } from '@remixicon/react'
import React from 'react'
import { useLanguage } from '../../../contexts/LanguageContext'

interface ApiKeyWarningProps {
  onOpenSettings: () => void
}

export const ApiKeyWarning: React.FC<ApiKeyWarningProps> = ({
  onOpenSettings,
}) => {
  const { t } = useLanguage()

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
      <Button onClick={onOpenSettings} variant='ghost' size='sm'>
        <RiSettingsLine size={20} />
        {t('form.open_settings')}
      </Button>
    </div>
  )
}
