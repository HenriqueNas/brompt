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
        className='mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300'
      >
        {label}
      </label>
      <input
        id='api-key-input'
        type='password'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
      />
    </div>
  )
}
