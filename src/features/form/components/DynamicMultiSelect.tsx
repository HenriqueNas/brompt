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
          className='block text-sm font-medium text-foreground'
        >
          {label}
        </label>
        {description && <p className='text-xs text-neutral'>{description}</p>}
        <div
          className='min-h-9.5 w-full rounded-md border border-brand-20 bg-background py-2 px-3 text-sm focus:border-brand-60 focus:outline-none focus:ring-1 focus:ring-brand-60 dark:border-zinc-700 dark:bg-background dark:text-foreground cursor-pointer flex flex-wrap gap-2'
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
            <span className='text-neutral'>Select options...</span>
          )}
          {value.map((v) => {
            const option = options.find((o) => o.value === v)
            return (
              <span
                key={v}
                className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-20 text-brand-80 dark:bg-brand-20/30 dark:text-brand-60'
              >
                {option?.label || v}
                <button
                  type='button'
                  aria-label={`Remove ${option?.label || v}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOption(v)
                  }}
                  className='ml-1 text-brand-60 hover:text-brand-80 focus:outline-none focus:ring-2 focus:ring-brand-60 rounded-sm'
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
          className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-background'
        >
          {options.map((option) => (
            <div
              key={option.value}
              role='option'
              aria-selected={value.includes(option.value)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-brand-20/40 dark:hover:bg-zinc-700 ${
                value.includes(option.value) ? 'bg-brand-20/30' : ''
              }`}
              onClick={() => toggleOption(option.value)}
            >
              <span
                className={`block truncate ${value.includes(option.value) ? 'font-semibold' : 'font-normal'}`}
              >
                {option.label}
              </span>
              {value.includes(option.value) && (
                <span
                  className='absolute inset-y-0 right-0 flex items-center pr-4 text-brand-60'
                  aria-hidden='true'
                >
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className='absolute right-3 top-9 h-4 w-4 animate-spin rounded-full border-2 border-brand-20 border-t-brand-80'></div>
      )}
    </div>
  )
}
