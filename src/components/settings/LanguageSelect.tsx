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
        className='mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300'
      >
        {label}
      </label>
      <select
        id='language-select'
        value={value}
        onChange={(e) => onChange(e.target.value as 'en' | 'pt')}
        className='w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800'
      >
        <option value='en'>English</option>
        <option value='pt'>Português</option>
      </select>
    </div>
  )
}
