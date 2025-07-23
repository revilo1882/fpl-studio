import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { mockTeams } from '@/lib/test-mocks'
import type { SingleFixture } from '@/lib/generateFixtureMatrix'

import { FixtureChip } from './FixtureChip'

const mockFixture: SingleFixture = {
	label: 'ARS (H)',
	difficulty: 3,
	opponentName: 'Arsenal',
	kickoffTime: '2024-08-17T14:00:00Z',
}

describe('FixtureChip', () => {
	it('renders fixture label and difficulty', () => {
		render(<FixtureChip fixture={mockFixture} teams={mockTeams} difficultyType='fpl' />)

		expect(screen.getByText('ARS (H)')).toBeInTheDocument()
		expect(screen.getByText('(3)')).toBeInTheDocument()
	})

	it('shows decimal difficulty for studio ratings', () => {
		const studioFixture = { ...mockFixture, difficulty: 3.25 }
		render(<FixtureChip fixture={studioFixture} teams={mockTeams} difficultyType='overall' />)

		expect(screen.getByText('(3.25)')).toBeInTheDocument()
	})

	it('applies correct difficulty styling', () => {
		render(<FixtureChip fixture={mockFixture} teams={mockTeams} difficultyType='fpl' />)

		const chip = screen.getByText('ARS (H)').closest('div')
		expect(chip).toHaveClass('bg-yellow-400/60')
	})
})
