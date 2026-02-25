import { LLMProviderType } from '@/lib/llm/types'
import { PROVIDER_REGISTRY } from '@/lib/llm/registry'

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
        className='mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300'
      >
        {label}
      </label>
      <select
        id='provider-select'
        value={value}
        onChange={(e) => onChange(e.target.value as LLMProviderType)}
        className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
      >
        {PROVIDER_REGISTRY.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.displayName}
          </option>
        ))}
      </select>
    </div>
  )
}
