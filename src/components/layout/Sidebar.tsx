'use client'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useHistory } from '@/contexts/HistoryContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { clearDraft, loadDraft } from '@/features/form/useAutosaveDraft'
import {
  RiAddLine,
  RiInboxLine,
  RiMessage3Line,
  RiSearchLine,
  RiSettingsLine,
} from '@remixicon/react'
import { useState } from 'react'

interface SidebarProps {
  onSettingsClick: () => void
}

export function Sidebar({ onSettingsClick }: SidebarProps) {
  const { t } = useLanguage()
  const { history, activeSession, setActiveSession } = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const filteredHistory = history.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewChatClick = () => {
    // If we are already in "New Chat" mode (activeSession is null)
    // AND there is a draft (which implies unsaved work), confirm reset.
    // OR if we are in history mode, but clicking New Chat would clear draft if it existed?
    // Let's check if draft exists.
    const draft = loadDraft()

    // If there is a draft (unsaved work), confirm before clearing.
    // Even if activeSession is not null, switching to new chat might overwrite draft if not careful.
    // But draft is only saved when activeSession is null.
    // If activeSession is NOT null, draft might be stale or empty.
    // If we switch to null, we load draft.
    // So if draft exists, it means we have unfinished work from previous session.
    if (draft) {
      setIsResetModalOpen(true)
    } else {
      // No draft, just reset/switch
      if (activeSession) {
        setActiveSession(null)
      } else {
        // Already in new chat, force reset
        window.dispatchEvent(new Event('brompt:reset'))
      }
      clearDraft()
    }
  }

  const confirmReset = () => {
    clearDraft()
    if (activeSession) {
      setActiveSession(null)
    } else {
      window.dispatchEvent(new Event('brompt:reset'))
    }
    setIsResetModalOpen(false)
  }

  const resetFooter = (
    <>
      <Button variant='ghost' onClick={() => setIsResetModalOpen(false)}>
        {t('settings.cancel')}
      </Button>
      <Button
        variant='solid'
        onClick={confirmReset}
        className='bg-error hover:bg-red-700'
      >
        {t('form.reset_confirm_yes')}
      </Button>
    </>
  )

  return (
    <>
      <aside className='flex h-screen w-80 flex-col border-r border-brand-20 bg-background dark:border-zinc-800 dark:bg-background'>
        <div className='p-4 space-y-6 py-12'>
          <Button
            onClick={handleNewChatClick}
            className='w-full justify-start gap-2'
          >
            <RiAddLine size={20} />
            {t('sidebar.new_chat')}
          </Button>

          <div className='relative'>
            <RiSearchLine
              className='absolute left-2.5 top-2.5 text-base text-neutral'
              size={18}
            />
            <input
              type='text'
              placeholder={t('sidebar.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-background border border-brand-20 focus:outline-none focus:ring-2 focus:ring-brand-60 dark:bg-background dark:border-zinc-700 dark:text-foreground placeholder:text-neutral'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto px-2'>
          <div className='mb-2 px-2 text-xs font-semibold uppercase text-neutral tracking-wider'>
            {t('sidebar.history')}
          </div>

          <div className='space-y-1'>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((session) => (
                <Button
                  variant='text'
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-left group ${
                    activeSession?.id === session.id
                      ? 'bg-brand-20 text-brand-80 font-medium'
                      : 'text-neutral hover:bg-brand-20/50 dark:text-neutral dark:hover:bg-zinc-800'
                  }`}
                >
                  <RiMessage3Line
                    className={`text-base shrink-0 ${activeSession?.id === session.id ? 'text-brand-60' : 'text-neutral group-hover:text-brand-60'}`}
                  />
                  <span className='truncate'>{session.title}</span>
                </Button>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-neutral space-y-2 opacity-60'>
                <RiInboxLine className='text-3xl' />
                <span className='text-xs'>
                  {history.length === 0
                    ? t('sidebar.no_history')
                    : t('sidebar.no_matches')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='border-t border-brand-20 p-4 dark:border-zinc-800'>
          <Button
            onClick={onSettingsClick}
            variant='text'
            className='w-full justify-start gap-2'
          >
            <RiSettingsLine size={20} />
            {t('sidebar.settings')}
          </Button>
        </div>
      </aside>

      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={t('form.reset_confirm_title')}
        footer={resetFooter}
      >
        <p className='text-body text-neutral'>{t('form.reset_confirm_desc')}</p>
      </Modal>
    </>
  )
}
