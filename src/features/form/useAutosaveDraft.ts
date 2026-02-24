import { storage } from '@/lib/storage';
import { useEffect } from 'react';
import { Draft } from './schema';

export const useAutosaveDraft = (draft: Draft, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
        if (draft.round > 0 || draft.seedInput.trim().length > 0) {
            storage.setItem('drafts', { ...draft, timestamp: Date.now() });
        }
    }, 1000); // Debounce

    return () => clearTimeout(timer);
  }, [draft]);
};

export const clearDraft = () => {
  storage.removeItem('drafts');
};

export const loadDraft = (): Draft | null => {
  return storage.getItem<Draft | null>('drafts', null);
};
