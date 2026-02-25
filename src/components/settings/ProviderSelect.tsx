import { LLMProviderType } from '@/lib/llm/types'
import { PROVIDER_REGISTRY } from '@/lib/llm/registry'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

export function ProviderSelect({
  value,
  onChange,
  label,
}: {
  value: LLMProviderType
  onChange: (v: LLMProviderType) => void
  label: string
}) {
  return (
    <div>
      <label
        htmlFor='provider-select'
        className='mb-1 block text-sm font-medium text-foreground'
      >
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as LLMProviderType)}
      >
        <SelectTrigger id='provider-select'>
          <SelectValue placeholder='Select provider' />
        </SelectTrigger>
        <SelectContent>
          {PROVIDER_REGISTRY.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
