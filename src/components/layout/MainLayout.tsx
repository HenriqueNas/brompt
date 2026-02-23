'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { SettingsModal } from './SettingsModal';
import { useSettings } from '@/contexts/SettingsContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isSettingsOpen, openSettings, closeSettings } = useSettings();

  return (
    <div className="flex h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Sidebar onSettingsClick={openSettings} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
    </div>
  );
}
