'use client';

import React from 'react';
import { Plus, Settings, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  onSettingsClick: () => void;
}

export function Sidebar({ onSettingsClick }: SidebarProps) {
  const { t } = useLanguage();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-4">
        <button className="flex w-full items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={16} />
          {t('sidebar.new_chat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="mb-2 px-2 text-xs font-semibold uppercase text-zinc-500">
          {t('sidebar.history')}
        </div>
        {/* Placeholder for history items */}
        <div className="space-y-1">
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <MessageSquare size={16} />
            Example Chat 1
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <MessageSquare size={16} />
            Example Chat 2
          </button>
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
  );
}
