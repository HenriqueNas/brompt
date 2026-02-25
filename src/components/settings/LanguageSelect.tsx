import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

export function LanguageSelect({
  value,
  onChange,
  label,
}: {
  value: 'en' | 'pt'
  onChange: (v: 'en' | 'pt') => void
  label: string
}) {
  return (
    <div>
      <label
        htmlFor='language-select'
        className='mb-1 block text-sm font-medium text-foreground'
      >
        {label}
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as 'en' | 'pt')}>
        <SelectTrigger id='language-select'>
          <SelectValue placeholder='Select language' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='en'>English</SelectItem>
          <SelectItem value='pt'>Português</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
