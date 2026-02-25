import React from 'react'
import { FieldOption } from '../schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

interface DynamicSelectProps {
  id: string
  label: string
  description?: string
  value: string
  options: FieldOption[]
  onChange: (value: string) => void
  isLoading?: boolean
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  id,
  label,
  description,
  value,
  options,
  onChange,
  isLoading = false,
}) => {
  return (
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
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger
            id={id}
            className='w-full bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
          >
            <SelectValue placeholder='Select an option' />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isLoading && (
          <div className='absolute right-8 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600'></div>
        )}
      </div>
    </div>
  )
}
