import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ChartEmptyState } from './ChartEmptyState'

describe('ChartEmptyState', () => {
	it('renders guidance copy', () => {
		render(<ChartEmptyState />)
		expect(screen.getByRole('heading', { name: /Select Teams to View Chart/i })).toBeInTheDocument()
		expect(screen.getByText(/team filter/i)).toBeInTheDocument()
	})

	it('omits filter button when callback is not passed', () => {
		render(<ChartEmptyState />)
		expect(screen.queryByRole('button', { name: /Open Team Filter/i })).not.toBeInTheDocument()
	})

	it('calls onOpenTeamFilter when button is clicked', () => {
		const onOpen = vi.fn()
		render(<ChartEmptyState onOpenTeamFilter={onOpen} />)
		fireEvent.click(screen.getByRole('button', { name: /Open Team Filter/i }))
		expect(onOpen).toHaveBeenCalledTimes(1)
	})
})
