'use client';

import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from "@thesysai/genui-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider mode="system">
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}
