import React from 'react'

interface DynamicToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  isLoading?: boolean
}

export const DynamicToggle: React.FC<DynamicToggleProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  isLoading = false,
}) => {
  return (
    <div className='flex items-center justify-between py-4'>
      <div className='flex flex-col space-y-1'>
        <label
          htmlFor={id}
          className='text-sm font-medium text-zinc-900 dark:text-zinc-100'
        >
          {label}
        </label>
        {description && (
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type='button'
        role='switch'
        aria-checked={checked}
        onClick={() => !isLoading && onChange(!checked)}
        disabled={isLoading}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-700'
        }`}
      >
        <span
          aria-hidden='true'
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
        {isLoading && (
          <span className='absolute right-0 top-0 h-full w-full flex items-center justify-center'>
            <span className='h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
          </span>
        )}
      </button>
    </div>
  )
}
