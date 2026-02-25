'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
      <div className='w-full max-w-md rounded-xl bg-background p-6 shadow-2xl dark:bg-background border border-brand-20 dark:border-zinc-800'>
        <div className='flex flex-col items-center text-center space-y-4'>
          <div className='p-3 bg-brand-20 text-brand-60 rounded-full dark:bg-brand-20/30 dark:text-brand-40'>
            <RiLockLine className='text-3xl' />
          </div>

          <h2 className='text-heading-md font-bold text-foreground'>
            {t('settings.locked_title') || 'Application Locked'}
          </h2>

          <p className='text-caption text-neutral'>
            {t('settings.locked_desc') ||
              'Please enter your passphrase to unlock your API keys.'}
          </p>

          {!showResetConfirm ? (
            <form onSubmit={handleUnlock} className='w-full space-y-4'>
              <Input
                type='password'
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder={
                  t('settings.passphrase_placeholder') || 'Enter passphrase'
                }
                autoFocus
              />

              <Button
                type='submit'
                disabled={isLoading || !passphrase}
                className='w-full'
                variant='solid'
              >
                {isLoading ? (
                  <RiRefreshLine className='text-base animate-spin' />
                ) : (
                  t('settings.unlock_button') || 'Unlock'
                )}
              </Button>

              <Button type='button' onClick={() => setShowResetConfirm(true)}>
                {t('settings.forgot_passphrase') ||
                  'Forgot passphrase? Reset all keys'}
              </Button>
            </form>
          ) : (
            <div className='w-full space-y-4 pt-4 border-t border-brand-20 dark:border-zinc-800'>
              <p className='text-caption text-error font-medium'>
                {t('settings.reset_warning') ||
                  'Warning: This will delete all stored API keys. You will need to re-enter them.'}
              </p>

              <div className='flex gap-2'>
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant='ghost'
                  className='flex-1'
                >
                  {t('settings.cancel') || 'Cancel'}
                </Button>
                <Button
                  onClick={handleReset}
                  className='flex-1 bg-error hover:bg-red-700'
                  variant='solid'
                >
                  <RiDeleteBinLine className='text-base mr-2' />
                  {t('settings.confirm_reset') || 'Reset All'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
