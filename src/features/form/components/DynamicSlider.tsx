import React from 'react'

interface DynamicSliderProps {
  id: string
  label: string
  description?: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  isLoading?: boolean
}

export const DynamicSlider: React.FC<DynamicSliderProps> = ({
  id,
  label,
  description,
  value,
  min,
  max,
  step,
  onChange,
  isLoading = false,
}) => {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div>
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
        </div>
        <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
          {value}
        </span>
      </div>
      <input
        type='range'
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={isLoading}
        className='w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50'
      />
      {isLoading && (
        <div className='absolute top-0 right-0 h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent'></div>
      )}
    </div>
  )
}
