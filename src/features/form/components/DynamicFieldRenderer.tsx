import React from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FormField } from '../schema'
import { DynamicMultiSelect } from './DynamicMultiSelect'
import { DynamicSelect } from './DynamicSelect'
import { DynamicSlider } from './DynamicSlider'
import { DynamicToggle } from './DynamicToggle'
import { Button } from '@/components/ui/Button'

interface DynamicFieldRendererProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
}) => {
  const commonProps = {
    id: field.id,
    label: field.label,
    description: field.description,
  }

  switch (field.type) {
    case 'text':
    case 'textarea':
      return (
        <div className='space-y-4'>
          <div className='space-y-1'>
            <label
              htmlFor={field.id}
              className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              {field.label}
            </label>
            {field.description && (
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                {field.description}
              </p>
            )}
          </div>
          {field.type === 'textarea' ? (
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <Input
              id={field.id}
              type='text'
              placeholder={field.placeholder}
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
          {field.suggestions && field.suggestions.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {field.suggestions.map((s) => (
                <Button key={s} onClick={() => onChange(s)}>
                  {s}
                </Button>
              ))}
            </div>
          )}
        </div>
      )
    case 'select':
      return (
        <DynamicSelect
          {...commonProps}
          value={String(value || '')}
          options={field.options || []}
          onChange={onChange}
        />
      )
    case 'toggle':
      return (
        <DynamicToggle
          {...commonProps}
          checked={Boolean(value)}
          onChange={onChange}
        />
      )
    case 'slider':
      return (
        <DynamicSlider
          {...commonProps}
          value={Number(value || field.min || 0)}
          min={field.min || 0}
          max={field.max || 100}
          step={field.step || 1}
          onChange={onChange}
        />
      )
    case 'multiselect':
      return (
        <DynamicMultiSelect
          {...commonProps}
          value={(value as string[]) || []}
          options={field.options || []}
          onChange={onChange}
        />
      )
    default:
      return null
  }
}
