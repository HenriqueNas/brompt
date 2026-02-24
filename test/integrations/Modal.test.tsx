import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Providers } from '../../src/app/providers'
import { Modal } from '../../src/components/ui/Modal'

describe('Modal Integration', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <p>Modal Content</p>,
  }

  it('should render the default state correctly (Happy Path)', () => {
    render(
      <Providers>
        <Modal {...defaultProps} />
      </Providers>
    )

    // Assertions
    expect(
      screen.getByRole('heading', { name: /test modal/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
    // Check if close button is present
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('should not render when isOpen is false', () => {
    render(
      <Providers>
        <Modal {...defaultProps} isOpen={false} />
      </Providers>
    )

    expect(
      screen.queryByRole('heading', { name: /test modal/i })
    ).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(
      <Providers>
        <Modal {...defaultProps} />
      </Providers>
    )

    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    render(
      <Providers>
        <Modal {...defaultProps} />
      </Providers>
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
