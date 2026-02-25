import { RiDeleteBinLine, RiShieldLine } from '@remixicon/react'

export function SecuritySection({
  hasEncryptedKeys,
  newPassphrase,
  setNewPassphrase,
  confirmPassphrase,
  setConfirmPassphrase,
  showResetConfirm,
  setShowResetConfirm,
  handleReset,
  t,
}: {
  hasEncryptedKeys: boolean
  newPassphrase: string
  setNewPassphrase: (v: string) => void
  confirmPassphrase: string
  setConfirmPassphrase: (v: string) => void
  showResetConfirm: boolean
  setShowResetConfirm: (v: boolean) => void
  handleReset: () => void
  t: (key: string) => string
}) {
  return (
    <div className='pt-4 border-t border-zinc-200 dark:border-zinc-800'>
      <div className='flex items-center gap-2 mb-3 text-zinc-900 dark:text-zinc-100 font-medium'>
        <RiShieldLine className='text-base' />
        <span>{t('settings.security_title') || 'Security'}</span>
      </div>
      {!hasEncryptedKeys ? (
        <div className='space-y-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md'>
          <p className='text-xs text-blue-700 dark:text-blue-300'>
            {t('settings.security_setup_desc') ||
              'Create a passphrase to encrypt your API keys. You will need this passphrase every time you open the app.'}
          </p>
          <div>
            <label
              htmlFor='passphrase-input'
              className='mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300'
            >
              {t('settings.create_passphrase') || 'Create Passphrase'}
            </label>
            <input
              id='passphrase-input'
              type='password'
              value={newPassphrase}
              onChange={(e) => setNewPassphrase(e.target.value)}
              className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
            />
          </div>
          <div>
            <label
              htmlFor='passphrase-confirm-input'
              className='mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300'
            >
              {t('settings.confirm_passphrase') || 'Confirm Passphrase'}
            </label>
            <input
              id='passphrase-confirm-input'
              type='password'
              value={confirmPassphrase}
              onChange={(e) => setConfirmPassphrase(e.target.value)}
              className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
            />
          </div>
        </div>
      ) : (
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md'>
            <span className='text-sm text-green-700 dark:text-green-300 flex items-center gap-2'>
              <RiShieldLine className='text-base' />
              {t('settings.security_enabled') || 'Encryption Enabled'}
            </span>
          </div>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className='text-xs text-red-600 hover:text-red-700 dark:text-red-400 underline flex items-center gap-1'
            >
              <RiDeleteBinLine className='text-xs' />
              {t('settings.reset_all_keys') || 'Reset all keys & passphrase'}
            </button>
          ) : (
            <div className='p-3 bg-red-50 dark:bg-red-900/20 rounded-md space-y-2'>
              <p className='text-xs text-red-700 dark:text-red-300 font-medium'>
                {t('settings.reset_confirm_msg') ||
                  'Are you sure? This will delete all API keys.'}
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className='text-xs px-3 py-1 bg-white dark:bg-zinc-800 border rounded shadow-sm'
                >
                  {t('settings.cancel')}
                </button>
                <button
                  onClick={handleReset}
                  className='text-xs px-3 py-1 bg-red-600 text-white rounded shadow-sm hover:bg-red-700'
                >
                  {t('settings.confirm_reset') || 'Reset'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
