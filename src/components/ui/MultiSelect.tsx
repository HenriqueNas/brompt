import { RiCloseLine } from '@remixicon/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  value,
  onChange,
  placeholder = 'Add...',
  className,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      if (!value.includes(inputValue)) {
        onChange([...value, inputValue])
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeValue = (valToRemove: string) => {
    onChange(value.filter((v) => v !== valToRemove))
  }

  return (
    <div
      className={cn(
        'flex min-h-11.5 w-full flex-wrap items-center gap-2 rounded-lg border border-[rgb(59,50,103)] bg-[rgb(28,24,51)] px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((val) => (
        <span
          key={val}
          className='inline-flex items-center gap-1 rounded bg-[rgba(75,43,238,0.2)] px-1.5 py-0.5 text-xs text-slate-200 border border-[rgba(75,43,238,0.3)] font-mono'
        >
          {val.replace(/\\n/g, '\\n')}
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              removeValue(val)
            }}
            className='ml-0.5 text-slate-400 hover:text-slate-200 focus:outline-none'
            aria-label={`Remove ${val}`}
          >
            <RiCloseLine className='text-xs' />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type='text'
        className='flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-15'
        placeholder={value.length === 0 ? placeholder : ''}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
