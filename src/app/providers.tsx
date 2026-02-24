'use client';

import { HistoryProvider } from '@/contexts/HistoryContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from "@thesysai/genui-sdk";
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <HistoryProvider>
          <ThemeProvider mode="system">
            {children}
          </ThemeProvider>
        </HistoryProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
