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
        <h1 className='text-heading-xl text-foreground'>{t('app.title')}</h1>

        <div className='rounded-xl border border-[rgb(59,50,103)] p-12'>
          <PromptFormEngine />
        </div>
      </div>
    </MainLayout>
  )
}
