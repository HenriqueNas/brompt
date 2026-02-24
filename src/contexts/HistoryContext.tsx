import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ArchitectSession } from '../features/form/schema'
import { storage } from '../lib/storage'

interface HistoryContextType {
  history: ArchitectSession[]
  activeSession: ArchitectSession | null
  setActiveSession: (session: ArchitectSession | null) => void
  saveSession: (session: ArchitectSession) => void
  loadSession: (sessionId: string) => ArchitectSession | undefined
  deleteSession: (sessionId: string) => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<ArchitectSession[]>([])
  const [activeSession, setActiveSession] = useState<ArchitectSession | null>(
    null
  )

  useEffect(() => {
    // Load history from local storage on mount
    const savedHistory = storage.getItem<ArchitectSession[]>('history', [])
    setHistory(savedHistory)
  }, [])

  const saveSession = (session: ArchitectSession) => {
    setHistory((prev) => {
      // Avoid duplicates if saving the same session ID, or update it
      const newHistory = [session, ...prev.filter((s) => s.id !== session.id)]
      storage.setItem('history', newHistory)
      return newHistory
    })
  }

  const loadSession = (sessionId: string) => {
    return history.find((s) => s.id === sessionId)
  }

  const deleteSession = (sessionId: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((s) => s.id !== sessionId)
      storage.setItem('history', newHistory)
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    storage.removeItem('history')
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        activeSession,
        setActiveSession,
        saveSession,
        loadSession,
        deleteSession,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}
