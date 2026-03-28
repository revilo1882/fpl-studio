'use client'

import { useMemo } from 'react'

import { Table, TableBody, TableHeader } from '@/components/ui/table'
import type { Fixtures, Gameweek, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/generateFixtureMatrix'
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

export function FixtureGrid({
	data,
	events,
	teams,
	firstGameweek,
	numberOfGameweeks,
	onSort,
	sortConfig,
	difficultyType,
	allFixtures,
}: FixtureGridProps) {
	const gameweekIds = useMemo(
		() =>
			events.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks).map((g) => g.id),
		[events, firstGameweek, numberOfGameweeks],
	)

	const teamByName = useMemo(() => new Map(teams.map((team) => [team.name, team])), [teams])

	return (
		<div className='flex flex-col border-y border-border bg-card sm:h-full sm:overflow-hidden sm:rounded-lg sm:border sm:shadow-sm'>
			<div className='overflow-x-auto overflow-y-visible touch-pan-x touch-pan-y sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:rounded-b-lg'>
				<Table className='min-w-max' style={{ position: 'relative' }}>
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
