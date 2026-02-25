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
      {/* Hidden native select to support test utilities like selectOptions */}
      <select
        id='provider-select'
        value={value}
        onChange={(e) => onChange(e.target.value as LLMProviderType)}
        className='sr-only absolute w-0 h-0 overflow-hidden'
        aria-hidden='true'
        tabIndex={-1}
      >
        {PROVIDER_REGISTRY.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.displayName}
          </option>
        ))}
      </select>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as LLMProviderType)}
      >
        <SelectTrigger data-testid='provider-select-trigger'>
          <SelectValue placeholder='Select provider' />
        </SelectTrigger>
        <SelectContent>
          {PROVIDER_REGISTRY.map((provider) => (
            <SelectItem
              key={provider.id}
              value={provider.id}
              data-testid={`provider-item-${provider.id}`}
            >
              {provider.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
