import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { mockFixtures, mockTeams } from '@/lib/test-mocks'
import * as fixtureUtils from '@/lib/fixtures/fixtureGridUtils'
import { type SingleFixture } from '@/lib/fixtures/generateFixtureMatrix'
import { type Team } from '@/types/fpl'

import { FixtureChip } from './FixtureChip'

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: any) => {
		const { src, alt = '', unoptimized, ...rest } = props
		return <img src={src} alt={alt} {...rest} unoptimized={String(unoptimized)} />
	},
}))

vi.mock('@/lib/fixtures/fixtureGridUtils', async () => {
	const actual = await vi.importActual<typeof fixtureUtils>('@/lib/fixtures/fixtureGridUtils')
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
	opponentCode: 12,
	isHome: true,
	gameweekId: 3,
}

describe('FixtureChip', () => {
	it('renders with correct label and difficulty', () => {
		render(
			<FixtureChip
				fixture={mockFixture}
				teams={mockTeams}
				difficultyType='FPL'
				fixtures={mockFixtures}
			/>,
		)

		expect(screen.getByText('GW3 (H)')).toBeInTheDocument()
		expect(screen.getByText(/\(3\)/)).toBeInTheDocument()
	})

	it('renders decimal difficulty for non-FPL types', () => {
		render(
			<FixtureChip
				fixture={{ ...mockFixture, difficulty: 2.718 }}
				teams={mockTeams}
				difficultyType='Attack'
				fixtures={mockFixtures}
			/>,
		)

		expect(screen.getByText(/\(2\.72\)/)).toBeInTheDocument()
	})

	it('shows kickoff time in popover', async () => {
		// Use real-time-advancing fake timers so waitFor still retries while we
		// bypass the 400 ms ghost-tap debounce on FixtureChip mount.
		vi.useFakeTimers({ shouldAdvanceTime: true })

		render(
			<FixtureChip
				fixture={mockFixture}
				teams={mockTeams}
				difficultyType='FPL'
				fixtures={mockFixtures}
			/>,
		)

		vi.advanceTimersByTime(500)
		fireEvent.click(screen.getByText('GW3 (H)'))

		await waitFor(() => {
			expect(screen.getByText(/Kickoff:/)).toBeInTheDocument()
			expect(screen.getByText(/Tue 12 Aug/)).toBeTruthy()
		})

		vi.useRealTimers()
	})

	it('falls back when no opponent team found', () => {
		vi.useFakeTimers()
		vi.spyOn(fixtureUtils, 'getOpponentTeam').mockReturnValueOnce(undefined)

		render(
			<FixtureChip
				fixture={{ ...mockFixture, opponentName: 'ZZZ United' }}
				teams={mockTeams}
				difficultyType='Defence'
				fixtures={mockFixtures}
			/>,
		)

		vi.advanceTimersByTime(500)
		fireEvent.click(screen.getByText('GW3 (H)'))

		expect(screen.getByText(/ZZZ United/)).toBeInTheDocument()
		expect(screen.queryByText(/Form:/)).not.toBeInTheDocument()

		vi.useRealTimers()
	})
})
