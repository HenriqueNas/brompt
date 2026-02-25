'use client'

import React, { createContext, useContext } from 'react'
import { useSettingsController } from './settings/useSettingsController'
import { SettingsContextType } from './settings/types'

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const controller = useSettingsController()

  return (
    <SettingsContext.Provider value={controller}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
