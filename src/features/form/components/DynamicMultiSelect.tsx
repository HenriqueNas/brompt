import React, { useState } from 'react'
import { FieldOption } from '../schema'

interface DynamicMultiSelectProps {
  id: string
  label: string
  description?: string
  value: string[]
  options: FieldOption[]
  onChange: (value: string[]) => void
  isLoading?: boolean
}

export const DynamicMultiSelect: React.FC<DynamicMultiSelectProps> = ({
  id,
  label,
  description,
  value,
  options,
  onChange,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className='relative'>
      <div className='space-y-2'>
        <label
          htmlFor={id}
          className='block text-sm font-medium text-zinc-900 dark:text-zinc-100'
        >
          {label}
        </label>
        {description && (
          <p className='text-xs text-zinc-500 dark:text-zinc-400'>
            {description}
          </p>
        )}
        <div
          className='min-h-9.5 w-full rounded-md border border-zinc-300 bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer flex flex-wrap gap-2'
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          tabIndex={0}
          role='combobox'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-controls={`listbox-${id}`}
          aria-label={label}
          onKeyDown={(e) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON') return
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!isLoading) setIsOpen(!isOpen)
            }
          }}
        >
          {value.length === 0 && (
            <span className='text-zinc-400'>Select options...</span>
          )}
          {value.map((v) => {
            const option = options.find((o) => o.value === v)
            return (
              <span
                key={v}
                className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
              >
                {option?.label || v}
                <button
                  type='button'
                  aria-label={`Remove ${option?.label || v}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOption(v)
                  }}
                  className='ml-1 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm'
                >
                  &times;
                </button>
              </span>
            )
          })}
        </div>
      </div>
      {isOpen && !isLoading && (
        <div
          id={`listbox-${id}`}
          role='listbox'
          className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-zinc-800'
        >
          {options.map((option) => (
            <div
              key={option.value}
              role='option'
              aria-selected={value.includes(option.value)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                value.includes(option.value)
                  ? 'bg-zinc-50 dark:bg-zinc-700/50'
                  : ''
              }`}
              onClick={() => toggleOption(option.value)}
            >
              <span
                className={`block truncate ${value.includes(option.value) ? 'font-semibold' : 'font-normal'}`}
              >
                {option.label}
              </span>
              {value.includes(option.value) && (
                <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400'>
                  <svg
                    className='h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className='absolute right-3 top-9 h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600'></div>
      )}
    </div>
  )
}
