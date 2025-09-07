import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

import { DifficultySelector } from './DifficultySelector'

describe('DifficultySelector', () => {
	const mockProps = {
		difficultyType: 'FPL' as const,
		setDifficultyType: vi.fn(),
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders with correct label', () => {
		render(<DifficultySelector {...mockProps} />)
		expect(screen.getByText('Difficulty View')).toBeInTheDocument()
	})

	it('renders select trigger with current value', () => {
		render(<DifficultySelector {...mockProps} />)

		expect(screen.getByRole('combobox')).toBeInTheDocument()
		expect(screen.getByText('FPL')).toBeInTheDocument()
	})

	it('has correct accessibility attributes', () => {
		render(<DifficultySelector {...mockProps} />)

		const select = screen.getByRole('combobox')
		expect(select).toHaveAttribute('id', 'difficulty-select')
		expect(select).toHaveAttribute('aria-expanded', 'false')
	})

	it('renders with different difficulty types', () => {
		const overallProps = { ...mockProps, difficultyType: 'Overall' as const }
		render(<DifficultySelector {...overallProps} />)

		expect(screen.getByText('Difficulty View')).toBeInTheDocument()
		expect(screen.getByRole('combobox')).toBeInTheDocument()
	})

	it('receives correct props without errors', () => {
		expect(() => render(<DifficultySelector {...mockProps} />)).not.toThrow()
		expect(mockProps.difficultyType).toBe('FPL')
	})
})
