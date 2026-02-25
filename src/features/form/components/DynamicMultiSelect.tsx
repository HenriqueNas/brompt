import React from 'react'
import { FieldOption } from '../schema'
import { MultiSelect } from '@/components/ui/MultiSelect'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options,
  onChange,
  isLoading = false,
}) => {
  return (
    <div className='relative'>
      <div className='space-y-4'>
        <div className='space-y-1'>
          <label
            htmlFor={id}
            className='block text-sm font-medium text-zinc-900 dark:text-zinc-100'
          >
            {label}
          </label>
          {description && (
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>
              {description}
            </p>
          )}
        </div>
        <div className='relative'>
          <MultiSelect
            value={value}
            onChange={onChange}
            className='w-full bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
            placeholder='Select options...'
          />
        </div>
      </div>
      {isLoading && (
        <div className='absolute right-3 top-11 h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600'></div>
      )}
    </div>
  )
}
