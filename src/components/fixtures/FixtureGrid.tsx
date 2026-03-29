'use client'

import { useMemo } from 'react'

import { Table, TableBody, TableHeader } from '@/components/ui/table'
import type { Fixtures, Gameweek, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/fixtures/generateFixtureMatrix'
import { type FixtureGridSortConfig, type FixtureGridSortKey } from '@/hooks/useFplTable'

import { FixtureGridRow } from './FixtureGridRow'
import { FixtureGridHeader } from './FixtureGridHeader'

type FixtureCell = SingleFixture[]

export type RowData = {
	team: string
	fixtures: FixtureCell[]
	score: number
	gameweekScores: number[]
}

type FixtureGridProps = {
	data: RowData[]
	events: Gameweek[]
	teams: Team[]
	firstGameweek: number
	numberOfGameweeks: number
	onSort: (key: FixtureGridSortKey) => void
	sortConfig: FixtureGridSortConfig
	difficultyType: DifficultyType
	allFixtures: Fixtures
}

export const FixtureGrid = ({
	data,
	events,
	teams,
	firstGameweek,
	numberOfGameweeks,
	onSort,
	sortConfig,
	difficultyType,
	allFixtures,
}: FixtureGridProps) => {
	const gameweekIds = useMemo(
		() =>
			events.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks).map((g) => g.id),
		[events, firstGameweek, numberOfGameweeks],
	)

	const teamByName = useMemo(() => new Map(teams.map((team) => [team.name, team])), [teams])

	return (
		<div className='flex min-w-0 flex-col border-y border-border bg-card sm:rounded-lg sm:border sm:shadow-sm lg:max-h-full lg:overflow-hidden'>
			{/* Below lg: no overflow here — the root layout scrollport scrolls X+Y so thead sticky works. lg+: pane scroll. */}
			<div className='min-w-0 sm:rounded-b-lg lg:min-h-0 lg:flex-1 lg:overflow-auto'>
				<Table
					className='min-w-max border-separate border-spacing-0'
					style={{ position: 'relative' }}
				>
					<TableHeader className='border-b bg-card shadow-sm'>
						<FixtureGridHeader
							events={events}
							firstGameweek={firstGameweek}
							numberOfGameweeks={numberOfGameweeks}
							onSort={onSort}
							sortConfig={sortConfig}
						/>
					</TableHeader>

					<TableBody>
						{data.map((row) => {
							const team = teamByName.get(row.team)
							if (!team) return null
							return (
								<FixtureGridRow
									key={row.team}
									row={row}
									team={team}
									teams={teams}
									difficultyType={difficultyType}
									allFixtures={allFixtures}
									numberOfGameweeks={numberOfGameweeks}
									gameweekIds={gameweekIds}
								/>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
