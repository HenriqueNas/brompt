'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { RiDeleteBinLine, RiLockLine, RiRefreshLine } from '@remixicon/react'
import { useState } from 'react'

export function UnlockModal() {
  const { t } = useLanguage()
  const { unlock, resetKeys, isLocked } = useSettings()
  const { showToast } = useToast()

  const [passphrase, setPassphrase] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passphrase) return

    setIsLoading(true)
    const success = await unlock(passphrase)
    setIsLoading(false)

    if (success) {
      showToast(
        t('settings.unlock_success') || 'Unlocked successfully',
        'success'
      )
      setPassphrase('')
    } else {
      showToast(t('settings.unlock_failed') || 'Invalid passphrase', 'error')
    }
  }

  const handleReset = () => {
    resetKeys()
    setShowResetConfirm(false)
    showToast(t('settings.reset_success') || 'All keys reset', 'info')
  }

  if (!isLocked) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'>
        <div className='flex flex-col items-center text-center space-y-4'>
          <div className='p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400'>
            <RiLockLine className='text-3xl' />
          </div>

          <h2 className='text-xl font-bold text-zinc-900 dark:text-zinc-50'>
            {t('settings.locked_title') || 'Application Locked'}
          </h2>

          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            {t('settings.locked_desc') ||
              'Please enter your passphrase to unlock your API keys.'}
          </p>

          {!showResetConfirm ? (
            <form onSubmit={handleUnlock} className='w-full space-y-4'>
              <input
                type='password'
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder={
                  t('settings.passphrase_placeholder') || 'Enter passphrase'
                }
                className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
                autoFocus
              />

              <button
                type='submit'
                disabled={isLoading || !passphrase}
                className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <RiRefreshLine className='text-base animate-spin' />
                ) : (
                  t('settings.unlock_button') || 'Unlock'
                )}
              </button>

              <button
                type='button'
                onClick={() => setShowResetConfirm(true)}
                className='text-xs text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 underline transition-colors'
              >
                {t('settings.forgot_passphrase') ||
                  'Forgot passphrase? Reset all keys'}
              </button>
            </form>
          ) : (
            <div className='w-full space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800'>
              <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
                {t('settings.reset_warning') ||
                  'Warning: This will delete all stored API keys. You will need to re-enter them.'}
              </p>

              <div className='flex gap-2'>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className='flex-1 py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md font-medium dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors'
                >
                  {t('settings.cancel') || 'Cancel'}
                </button>
                <button
                  onClick={handleReset}
                  className='flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2'
                >
                  <RiDeleteBinLine className='text-base' />
                  {t('settings.confirm_reset') || 'Reset All'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
