import { RiErrorWarningLine, RiRefreshLine } from '@remixicon/react'
import React from 'react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '../../../contexts/LanguageContext'

interface ErrorBannerProps {
  error: string
  onRetry: () => void
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry }) => {
  const { t } = useLanguage()

  return (
    <div className='p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-between gap-2'>
      <div className='flex items-center gap-2'>
        <RiErrorWarningLine className='text-xl' />
        {error}
      </div>
      <Button onClick={onRetry}>
        <RiRefreshLine className='text-base' />
        {t('form.retry')}
      </Button>
    </div>
  )
}
