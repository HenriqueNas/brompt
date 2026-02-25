import { Input } from '@/components/ui/Input'

export function ApiKeyField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label
        htmlFor='api-key-input'
        className='mb-1 block text-sm font-medium text-foreground'
      >
        {label}
      </label>
      <Input
        id='api-key-input'
        type='password'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
