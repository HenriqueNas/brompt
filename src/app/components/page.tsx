'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { MultiSelect } from '@/components/ui/MultiSelect'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/contexts/ToastContext'
import {
  RiAnthropicLine,
  RiCheckboxCircleLine,
  RiCursorLine,
  RiErrorWarningLine,
  RiGeminiLine,
  RiHistoryLine,
  RiInformation2Line,
  RiLayoutGridLine,
  RiOpenaiLine,
  RiPaletteLine,
  RiPlayFill,
  RiSaveLine,
  RiText,
  RiWindowFill,
} from '@remixicon/react'
import * as React from 'react'

export default function ComponentsPage() {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
  const [selectValue, setSelectValue] = React.useState<string>('gpt-4')
  const [multiSelectValue, setMultiSelectValue] = React.useState<string[]>([
    '\\n\\n',
    'User:',
  ])

  return (
    <div className='min-h-screen bg-[rgb(11,10,20)] p-8 font-sans text-slate-200'>
      {/* Header */}
      <header className='mb-12 flex items-center justify-between border-b border-[rgb(59,50,103)] pb-6'>
        <div className='flex items-center gap-4'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(75,43,238)] text-white shadow-lg shadow-[rgba(75,43,238,0.25)]'>
            <RiLayoutGridLine className='text-xl' />
          </div>
          <h1 className='text-xl font-bold text-white'>Brompt Design System</h1>
        </div>
        <div className='flex items-center gap-4'>
          <span className='rounded bg-[rgb(28,24,51)] px-2 py-1 text-xs font-medium text-slate-400 border border-[rgb(59,50,103)]'>
            v0.2.0
          </span>
        </div>
      </header>

      {/* Intro */}
      <div className='mb-12'>
        <h2 className='mb-4 text-4xl font-bold tracking-tight text-white'>
          Core Foundations
        </h2>
        <p className='max-w-2xl text-lg text-slate-400'>
          The atomic building blocks for the Brompt interface. Designed for
          high-density information, code readability, and long-session comfort.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
        {/* Left Column */}
        <div className='space-y-12'>
          {/* Typography Section */}
          <section>
            <div className='mb-6 flex items-center gap-2 border-b border-[rgb(59,50,103)] pb-2 text-[rgb(75,43,238)]'>
              <RiText className='text-xl' />
              <h3 className='font-semibold'>Typography</h3>
            </div>

            <div className='space-y-8 rounded-xl border border-[rgb(59,50,103)] bg-[rgb(20,18,35)] p-8'>
              {/* Display Sans */}
              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Display Sans (Inter)
                </p>
                <div className='space-y-6'>
                  <div>
                    <p className='text-4xl font-extrabold text-white'>
                      Heading XL
                    </p>
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-white'>
                      Heading Large
                    </p>
                  </div>
                  <div>
                    <p className='text-xl font-semibold text-white'>
                      Heading Medium
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-base text-slate-300'>
                      Body text regular. Efficient rendering for prompt
                      engineering workflows and dense data visualization.
                    </p>
                    <p className='text-sm text-slate-500'>
                      Caption text small. Used for metadata and labels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Monospace */}
              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Monospace (JetBrains Mono)
                </p>
                <div className='relative overflow-hidden rounded-lg border border-[rgb(59,50,103)] bg-[rgb(11,10,20)] p-6 font-mono text-sm'>
                  <div className='absolute right-2 top-2 text-slate-600'>
                    &lt;/&gt;
                  </div>
                  <div className='space-y-1'>
                    <p>
                      <span className='text-purple-400'>const</span>{' '}
                      <span className='text-blue-400'>generateResponse</span>{' '}
                      <span className='text-slate-400'>= (</span>
                      <span className='text-orange-400'>prompt</span>
                      <span className='text-slate-400'>) =&gt; {'{'}</span>
                    </p>
                    <p className='pl-4'>
                      <span className='text-purple-400'>return</span>{' '}
                      <span className='text-slate-200'>model.</span>
                      <span className='text-blue-400'>stream</span>
                      <span className='text-slate-200'>({'{'}</span>
                    </p>
                    <p className='pl-8'>
                      <span className='text-slate-200'>temperature: </span>
                      <span className='text-green-400'>0.7</span>
                      <span className='text-slate-200'>,</span>
                    </p>
                    <p className='pl-8'>
                      <span className='text-slate-200'>input: prompt</span>
                    </p>
                    <p className='pl-4'>
                      <span className='text-slate-200'>{'}'});</span>
                    </p>
                    <p>
                      <span className='text-slate-400'>{'}'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette Section */}
          <section>
            <div className='mb-6 flex items-center gap-2 border-b border-[rgb(59,50,103)] pb-2 text-[rgb(75,43,238)]'>
              <RiPaletteLine className='text-xl' />
              <h3 className='font-semibold'>Color Palette</h3>
            </div>

            <div className='space-y-8 rounded-xl border border-[rgb(59,50,103)] bg-[rgb(20,18,35)] p-8'>
              {/* Primary Accent */}
              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Primary Accent
                </p>
                <div className='grid grid-cols-5 gap-2 h-16'>
                  <div className='flex items-center justify-center rounded bg-[rgb(75,43,238)]/20 text-xs font-medium text-[rgb(75,43,238)]'>
                    20
                  </div>
                  <div className='flex items-center justify-center rounded bg-[rgb(75,43,238)]/40 text-xs font-medium text-white'>
                    40
                  </div>
                  <div className='flex items-center justify-center rounded bg-[rgb(75,43,238)]/60 text-xs font-medium text-white'>
                    60
                  </div>
                  <div className='flex items-center justify-center rounded bg-[rgb(75,43,238)]/80 text-xs font-medium text-white'>
                    80
                  </div>
                  <div className='flex items-center justify-center rounded bg-[rgb(75,43,238)] text-xs font-medium text-white shadow-lg shadow-[rgba(75,43,238,0.25)]'>
                    100
                  </div>
                </div>
              </div>

              {/* Semantic Status */}
              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Semantic Status
                </p>
                <div className='grid grid-cols-2 gap-4'>
                  {/* Success */}
                  <div className='flex items-center gap-3 rounded-lg border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] p-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(16,185,129,0.2)]'>
                      <div className='h-3 w-3 rounded-full bg-emerald-500' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-white'>Success</p>
                      <p className='text-xs text-slate-500'>Emerald-500</p>
                    </div>
                  </div>

                  {/* Error */}
                  <div className='flex items-center gap-3 rounded-lg border border-[rgba(244,63,94,0.2)] bg-[rgba(244,63,94,0.1)] p-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(244,63,94,0.2)]'>
                      <div className='h-3 w-3 rounded-full bg-rose-500' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-white'>Error</p>
                      <p className='text-xs text-slate-500'>Rose-500</p>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className='flex items-center gap-3 rounded-lg border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.1)] p-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(245,158,11,0.2)]'>
                      <div className='h-3 w-3 rounded-full bg-amber-500' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-white'>Warning</p>
                      <p className='text-xs text-slate-500'>Amber-500</p>
                    </div>
                  </div>

                  {/* Neutral */}
                  <div className='flex items-center gap-3 rounded-lg border border-[rgba(113,113,122,0.2)] bg-[rgba(113,113,122,0.1)] p-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(113,113,122,0.2)]'>
                      <div className='h-3 w-3 rounded-full bg-zinc-500' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-white'>Neutral</p>
                      <p className='text-xs text-slate-500'>Zinc-500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className='space-y-12'>
          {/* Interactive Components Section */}
          <section>
            <div className='mb-6 flex items-center gap-2 border-b border-[rgb(59,50,103)] pb-2 text-[rgb(75,43,238)]'>
              <RiCursorLine className='text-xl' />
              <h3 className='font-semibold'>Interactive Components</h3>
            </div>

            <div className='space-y-12 rounded-xl border border-[rgb(59,50,103)] bg-[rgb(20,18,35)] p-8'>
              {/* Actions */}
              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Actions
                </p>

                <div className='flex flex-col gap-6'>
                  {/* Default Size (md) */}
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-500'>Default (md)</p>
                    <div className='flex flex-wrap gap-4'>
                      <Button variant='solid' className='gap-2'>
                        <RiPlayFill className='text-lg' />
                        Solid
                      </Button>
                      <Button variant='ghost' className='gap-2'>
                        <RiSaveLine className='text-lg' />
                        Ghost
                      </Button>
                      <Button variant='text' className='gap-2'>
                        <RiHistoryLine className='text-lg' />
                        Text
                      </Button>
                    </div>
                  </div>

                  {/* Large Size (lg) */}
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-500'>Large (lg)</p>
                    <div className='flex flex-wrap items-center gap-4'>
                      <Button variant='solid' size='lg' className='gap-2'>
                        <RiPlayFill className='text-xl' />
                        Solid Large
                      </Button>
                      <Button variant='ghost' size='lg' className='gap-2'>
                        <RiSaveLine className='text-xl' />
                        Ghost Large
                      </Button>
                      <Button variant='text' size='lg' className='gap-2'>
                        <RiHistoryLine className='text-xl' />
                        Text Large
                      </Button>
                    </div>
                  </div>

                  {/* Icon Size */}
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-500'>Icon Only</p>
                    <div className='flex flex-wrap items-center gap-4'>
                      <Button variant='solid' size='icon'>
                        <RiPlayFill className='text-lg' />
                      </Button>
                      <Button variant='ghost' size='icon'>
                        <RiSaveLine className='text-lg' />
                      </Button>
                      <Button variant='text' size='icon'>
                        <RiHistoryLine className='text-lg' />
                      </Button>
                    </div>
                  </div>

                  {/* Disabled State */}
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-500'>Disabled</p>
                    <div className='flex flex-wrap gap-4'>
                      <Button variant='solid' disabled className='gap-2'>
                        <RiPlayFill className='text-lg' />
                        Solid Disabled
                      </Button>
                      <Button variant='ghost' disabled className='gap-2'>
                        <RiSaveLine className='text-lg' />
                        Ghost Disabled
                      </Button>
                      <Button variant='text' disabled className='gap-2'>
                        <RiHistoryLine className='text-lg' />
                        Text Disabled
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inputs & Selects */}
              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Inputs & Selects
                </p>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-400'>Dropdown Selection</p>
                    <Select value={selectValue} onValueChange={setSelectValue}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a model' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            <RiGeminiLine size={18} /> Gemini
                          </SelectLabel>
                          <SelectItem value='gemini-2.5-flash'>
                            Gemini 2.5 Flash
                          </SelectItem>
                          <SelectItem value='gemini-2.5-pro'>
                            Gemini 2.5 Pro
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>
                            <RiOpenaiLine size={18} /> OpenAI
                          </SelectLabel>
                          <SelectItem value='gpt-4'>GPT-4 Turbo</SelectItem>
                          <SelectItem value='gpt-3.5'>GPT-3.5 Turbo</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>
                            <RiAnthropicLine size={18} /> Anthropic
                          </SelectLabel>
                          <SelectItem value='claude-3-opus'>
                            Claude 3 Opus
                          </SelectItem>
                          <SelectItem value='claude-3-sonnet'>
                            Claude 3 Sonnet
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-xs text-slate-400'>Stop Sequences</p>
                    <MultiSelect
                      value={multiSelectValue}
                      onChange={setMultiSelectValue}
                      placeholder='Add...'
                    />
                  </div>
                </div>
                <div className='space-y-4 mt-6'>
                  <div className='space-y-2'>
                    <h3 className='text-sm text-slate-500 font-mono'>
                      Default Text Input
                    </h3>
                    <Input placeholder='Type something...' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-sm text-slate-500 font-mono'>
                      Textarea
                    </h3>
                    <Textarea placeholder='Type a longer message...' />
                  </div>
                </div>
              </div>

              <div>
                <p className='mb-4 font-mono text-xs uppercase tracking-wider text-slate-500'>
                  Modals & Toast Notifications
                </p>

                <div className='flex flex-col gap-6'>
                  <div className='space-y-2'>
                    <p className='text-xs text-slate-500'>Modal</p>
                    <div className='flex flex-wrap gap-4'>
                      <Button
                        variant='solid'
                        className='gap-2'
                        onClick={() => setIsModalOpen(true)}
                      >
                        <RiWindowFill className='text-lg' />
                        Open Modal
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-xs text-slate-500'>
                      Toast Notifications
                    </p>
                    <div className='flex flex-wrap gap-4'>
                      <Button
                        variant='ghost'
                        className='gap-2'
                        onClick={() =>
                          showToast('Operation successful!', 'success')
                        }
                      >
                        <RiCheckboxCircleLine className='text-lg text-green-500' />
                        Success
                      </Button>
                      <Button
                        variant='ghost'
                        className='gap-2'
                        onClick={() =>
                          showToast('Something went wrong.', 'error')
                        }
                      >
                        <RiErrorWarningLine className='text-lg text-red-500' />
                        Error
                      </Button>
                      <Button
                        variant='ghost'
                        className='gap-2'
                        onClick={() =>
                          showToast('Here is some information.', 'info')
                        }
                      >
                        <RiInformation2Line className='text-lg text-blue-500' />
                        Info
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Component */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Example Modal'
                footer={
                  <div className='flex justify-end gap-2 w-full'>
                    <Button
                      variant='ghost'
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='solid'
                      onClick={() => {
                        setIsModalOpen(false)
                        showToast('Action confirmed!', 'success')
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                }
              >
                <div className='text-zinc-800 dark:text-zinc-200'>
                  <p>This is an example modal component.</p>
                  <p className='mt-2 text-sm text-zinc-500'>
                    It supports a title, content area, and a footer for actions.
                  </p>
                </div>
              </Modal>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className='mt-24 border-t border-[rgb(59,50,103)] pt-8 text-center text-sm text-slate-500'>
        <p>
          Developed by{' '}
          <a
            href='https://github.com/henriquenas'
            target='_blank'
            rel='noopener noreferrer'
            className='text-white'
          >
            Henrique Nas
          </a>
        </p>
      </footer>
    </div>
  )
}
