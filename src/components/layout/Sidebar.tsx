'use client';

import { Modal } from '@/components/ui/Modal';
import { useHistory } from '@/contexts/HistoryContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { clearDraft, loadDraft } from '@/features/form/useAutosaveDraft';
import { Inbox, MessageSquare, Plus, Search, Settings } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  onSettingsClick: () => void;
}

export function Sidebar({ onSettingsClick }: SidebarProps) {
  const { t } = useLanguage();
  const { history, activeSession, setActiveSession } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const filteredHistory = history.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChatClick = () => {
    // If we are already in "New Chat" mode (activeSession is null)
    // AND there is a draft (which implies unsaved work), confirm reset.
    // OR if we are in history mode, but clicking New Chat would clear draft if it existed?
    // Let's check if draft exists.
    const draft = loadDraft();
    
    // If there is a draft (unsaved work), confirm before clearing.
    // Even if activeSession is not null, switching to new chat might overwrite draft if not careful.
    // But draft is only saved when activeSession is null.
    // If activeSession is NOT null, draft might be stale or empty.
    // If we switch to null, we load draft.
    // So if draft exists, it means we have unfinished work from previous session.
    if (draft) {
      setIsResetModalOpen(true);
    } else {
      // No draft, just reset/switch
      if (activeSession) {
        setActiveSession(null);
      } else {
        // Already in new chat, force reset
        window.dispatchEvent(new Event('brompt:reset'));
      }
      clearDraft();
    }
  };

  const confirmReset = () => {
    clearDraft();
    if (activeSession) {
      setActiveSession(null);
    } else {
      window.dispatchEvent(new Event('brompt:reset'));
    }
    setIsResetModalOpen(false);
  };

  const resetFooter = (
    <>
      <button
        onClick={() => setIsResetModalOpen(false)}
        className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
      >
        {t('settings.cancel')}
      </button>
      <button
        onClick={confirmReset}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        {t('form.reset_confirm_yes')}
      </button>
    </>
  );

  return (
    <>
      <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-4 space-y-4">
          <button 
            onClick={handleNewChatClick}
            className="flex w-full items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            {t('sidebar.new_chat')}
          </button>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder={t('sidebar.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <div className="mb-2 px-2 text-xs font-semibold uppercase text-zinc-500 tracking-wider">
            {t('sidebar.history')}
          </div>
          
          <div className="space-y-1">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-left group ${
                    activeSession?.id === session.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                      : 'text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <MessageSquare size={16} className={`shrink-0 ${activeSession?.id === session.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'}`} />
                  <span className="truncate">{session.title}</span>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-400 space-y-2 opacity-60">
                <Inbox size={32} strokeWidth={1.5} />
                <span className="text-xs">
                  {history.length === 0 ? t('sidebar.no_history') : t('sidebar.no_matches')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <button
            onClick={onSettingsClick}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Settings size={16} />
            {t('sidebar.settings')}
          </button>
        </div>
      </aside>

      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={t('form.reset_confirm_title')}
        footer={resetFooter}
      >
        <p className="text-zinc-600 dark:text-zinc-400">
          {t('form.reset_confirm_desc')}
        </p>
      </Modal>
    </>
  );
}
