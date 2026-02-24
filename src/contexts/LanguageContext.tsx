'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { storage } from '@/lib/storage'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'

type Language = 'en' | 'pt'
type Translations = typeof en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

const dictionaries: Record<Language, Translations> = {
  en,
  pt,
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const storedLang = storage.getItem<Language>('language', 'en')
    setLanguageState(storedLang)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    storage.setItem('language', lang)
  }

  const t = (path: string) => {
    const keys = path.split('.')
    let current: Record<string, unknown> | string = dictionaries[language]

    for (const key of keys) {
      if (typeof current === 'object' && current !== null && key in current) {
        current = (current as Record<string, unknown>)[key] as
          | Record<string, unknown>
          | string
      } else {
        console.warn(`Translation key not found: ${path}`)
        return path
      }
    }

    return current as string
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
