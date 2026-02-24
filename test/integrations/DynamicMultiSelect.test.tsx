import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Providers } from '../../src/app/providers'
import { DynamicMultiSelect } from '../../src/features/form/components/DynamicMultiSelect'

describe('DynamicMultiSelect Integration', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ]

  const defaultProps = {
    id: 'test-multi-select',
    label: 'Test Multi Select',
    options: mockOptions,
    value: [],
    onChange: vi.fn(),
  }

  it('should render the default state correctly (Happy Path)', () => {
    render(
      <Providers>
        <DynamicMultiSelect {...defaultProps} />
      </Providers>
    )

    expect(screen.getByText('Test Multi Select')).toBeInTheDocument()
    expect(screen.getByText('Select options...')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('should open dropdown when clicked', () => {
    render(
      <Providers>
        <DynamicMultiSelect {...defaultProps} />
      </Providers>
    )

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should call onChange when an option is selected', () => {
    render(
      <Providers>
        <DynamicMultiSelect {...defaultProps} />
      </Providers>
    )

    // Open dropdown
    fireEvent.click(screen.getByRole('combobox'))

    // Click Option 1
    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }))

    expect(defaultProps.onChange).toHaveBeenCalledWith(['opt1'])
  })

  it('should render selected values as tags', () => {
    render(
      <Providers>
        <DynamicMultiSelect {...defaultProps} value={['opt1', 'opt2']} />
      </Providers>
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.queryByText('Select options...')).not.toBeInTheDocument()
  })

  it('should remove tag when remove button is clicked', () => {
    render(
      <Providers>
        <DynamicMultiSelect {...defaultProps} value={['opt1']} />
      </Providers>
    )

    const removeButton = screen.getByLabelText('Remove Option 1')
    fireEvent.click(removeButton)

    expect(defaultProps.onChange).toHaveBeenCalledWith([])
  })

  it('should deselect option when clicked again in dropdown', () => {
    render(
      <Providers>
        <DynamicMultiSelect {...defaultProps} value={['opt1']} />
      </Providers>
    )

    // Open dropdown
    fireEvent.click(screen.getByRole('combobox'))

    // Click Option 1 (which is already selected)
    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }))

    expect(defaultProps.onChange).toHaveBeenCalledWith([])
  })
})
