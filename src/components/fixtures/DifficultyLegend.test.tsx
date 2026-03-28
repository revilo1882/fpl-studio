import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DifficultyLegend } from './DifficultyLegend'

describe('DifficultyLegend', () => {
	it('renders labels and five swatches for FPL mode', () => {
		render(<DifficultyLegend difficultyType='FPL' />)
		expect(screen.getByText('Difficulty')).toBeInTheDocument()
		expect(screen.getByText('1 · Easy')).toBeInTheDocument()
		expect(screen.getByText('Hard · 5')).toBeInTheDocument()
		expect(screen.getByTestId('difficulty-swatch-strip').children.length).toBe(5)
	})

	it('renders eight swatches for custom difficulty types', () => {
		render(<DifficultyLegend difficultyType='Overall' />)
		const strip = screen.getByTestId('difficulty-swatch-strip')
		expect(strip.children.length).toBe(8)
	})
})
