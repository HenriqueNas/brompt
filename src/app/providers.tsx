'use client';

import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from "@thesysai/genui-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <ThemeProvider mode="system">
          {children}
        </ThemeProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
