import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ChartTooManyTeams } from './ChartTooManyTeams'

describe('ChartTooManyTeams', () => {
	it('shows selected count and max teams', () => {
		render(<ChartTooManyTeams selectedCount={7} maxTeams={5} onClearTeams={vi.fn()} />)
		expect(screen.getByRole('heading', { name: /Too Many Teams Selected/i })).toBeInTheDocument()
		expect(screen.getByText(/7 teams selected/)).toBeInTheDocument()
		expect(screen.getByText(/maximum\s+of 5 teams/i)).toBeInTheDocument()
	})

	it('invokes onClearTeams when clearing selection', () => {
		const onClear = vi.fn()
		render(<ChartTooManyTeams selectedCount={6} maxTeams={5} onClearTeams={onClear} />)
		fireEvent.click(screen.getByRole('button', { name: /Clear Team Selection/i }))
		expect(onClear).toHaveBeenCalledTimes(1)
	})
})
