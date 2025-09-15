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
		<div className='flex max-h-full flex-col rounded-lg border border-border bg-card shadow-sm'>
			<div className='min-h-0 flex-1 touch-pan-x touch-pan-y overflow-x-auto overflow-y-auto rounded-b-lg'>
				<Table className='min-w-max' style={{ position: 'relative' }}>
					<TableHeader className='sticky top-0 z-30 border-b bg-card shadow-sm'>
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
