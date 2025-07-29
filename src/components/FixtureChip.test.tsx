import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { mockFixtures, mockTeams } from '@/lib//test-mocks'
import * as fixtureUtils from '@/lib/fixtureGridUtils'
import { type SingleFixture } from '@/lib/generateFixtureMatrix'
import { type Team } from '@/types/bootstrap'

import { FixtureChip } from './FixtureChip'

// Mock next/image for vitest
vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: any) => {
		const { src, alt = '', unoptimized, ...rest } = props
		/* eslint-disable-next-line @next/next/no-img-element */
		return <img src={src} alt={alt} {...rest} unoptimized={String(unoptimized)} />
	},
}))

vi.mock('@/lib/fixtureGridUtils', async () => {
	const actual = await vi.importActual<typeof fixtureUtils>('@/lib/fixtureGridUtils')
	return {
		...actual,
		getFormSummary: vi.fn(() => '3.5 avg over last 5'),
		getOpponentTeam: vi.fn((name, teams) => teams.find((t: Team) => t.name === name)),
	}
})

const mockFixture: SingleFixture = {
	opponentName: 'Man City',
	label: 'GW3 (H)',
	kickoffTime: '2025-08-12T14:00:00Z',
	difficulty: 3,
}

describe('FixtureChip', () => {
	it('renders with correct label and difficulty', () => {
		render(
			<FixtureChip
				fixture={mockFixture}
				teams={mockTeams}
				difficultyType='fpl'
				fixtures={mockFixtures}
			/>,
		)

		expect(screen.getByText('GW3 (H)')).toBeInTheDocument()
		expect(screen.getByText('(3)')).toBeInTheDocument()
	})

	it('renders decimal difficulty for non-FPL types', () => {
		render(
			<FixtureChip
				fixture={{ ...mockFixture, difficulty: 2.718 }}
				teams={mockTeams}
				difficultyType='attack'
				fixtures={mockFixtures}
			/>,
		)

		expect(screen.getByText('(2.72)')).toBeInTheDocument()
	})

	it('shows kickoff time in popover', async () => {
		render(
			<FixtureChip
				fixture={mockFixture}
				teams={mockTeams}
				difficultyType='fpl'
				fixtures={mockFixtures}
			/>,
		)

		fireEvent.click(screen.getByText('GW3 (H)'))

		await waitFor(() => {
			expect(screen.getByText(/Kickoff:/)).toBeInTheDocument()
			expect(screen.getByText(/Tue 12 Aug/)).toBeTruthy()
		})
	})

	it('falls back when no opponent team found', () => {
		vi.spyOn(fixtureUtils, 'getOpponentTeam').mockReturnValueOnce(undefined)

		render(
			<FixtureChip
				fixture={{ ...mockFixture, opponentName: 'ZZZ United' }}
				teams={mockTeams}
				difficultyType='defence'
				fixtures={mockFixtures}
			/>,
		)

		fireEvent.click(screen.getByText('GW3 (H)'))

		expect(screen.getByText(/ZZZ United/)).toBeInTheDocument()
		expect(screen.queryByText(/Form:/)).not.toBeInTheDocument()
	})
})
