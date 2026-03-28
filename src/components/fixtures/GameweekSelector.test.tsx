import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

import { GameweekSelector } from './GameweekSelector'

describe('GameweekSelector', () => {
	const mockProps = {
		numberOfGameweeks: 5,
		setNumberOfGameweeks: vi.fn(),
		gameweekOptions: [3, 5, 8, 10],
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders with correct label', () => {
		render(<GameweekSelector {...mockProps} />)
		expect(screen.getByText('Gameweeks')).toBeInTheDocument()
	})

	it('renders select trigger with current value', () => {
		render(<GameweekSelector {...mockProps} />)

		expect(screen.getByRole('combobox')).toBeInTheDocument()
		expect(screen.getByText('5')).toBeInTheDocument()
	})

	it('has correct accessibility attributes', () => {
		render(<GameweekSelector {...mockProps} />)

		const select = screen.getByRole('combobox')
		expect(select).toHaveAttribute('id', 'gameweek-select')
		expect(select).toHaveAttribute('aria-expanded', 'false')
	})

	it('receives correct props without errors', () => {
		expect(() => render(<GameweekSelector {...mockProps} />)).not.toThrow()
		expect(mockProps.numberOfGameweeks).toBe(5)
		expect(mockProps.gameweekOptions).toEqual([3, 5, 8, 10])
	})
})
