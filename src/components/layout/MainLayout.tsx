'use client'

import { useSettings } from '@/contexts/SettingsContext'
import React from 'react'
import { SettingsModal } from './SettingsModal'
import { Sidebar } from './Sidebar'
import { UnlockModal } from './UnlockModal'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isSettingsOpen, openSettings, closeSettings } = useSettings()

  return (
    <div className='flex h-screen bg-background text-foreground dark:bg-background dark:text-foreground'>
      <Sidebar onSettingsClick={openSettings} />

      <main className='flex-1 overflow-y-auto p-8'>
        <div className='mx-auto max-w-4xl'>{children}</div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
      <UnlockModal />
    </div>
  )
}
