'use client'

import { RiCloseLine } from '@remixicon/react'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div
        className='w-full max-w-md scale-100 rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-zinc-900 animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors'
            aria-label='Close'
          >
            <RiCloseLine className='text-2xl' />
          </button>
        </div>

        <div className='space-y-4'>{children}</div>

        {footer && <div className='mt-6 flex justify-end gap-3'>{footer}</div>}
      </div>
      <div className='absolute inset-0 -z-10' onClick={onClose} />
    </div>,
    document.body
  )
}
