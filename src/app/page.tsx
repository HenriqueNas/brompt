'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { PromptFormEngine } from '@/features/form/PromptFormEngine'

export default function Home() {
  const { t } = useLanguage()

  return (
    <MainLayout>
      <div className='space-y-6'>
        <div className='border-b border-zinc-200 pb-4 dark:border-zinc-800'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('app.title')}
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400'>{t('app.tagline')}</p>
        </div>

        <div className='rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <PromptFormEngine />
        </div>
      </div>
    </MainLayout>
  )
}
