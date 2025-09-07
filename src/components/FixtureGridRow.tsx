'use client'

import Link from 'next/link'

import { TableCell, TableRow } from '@/components/ui/table'
import type { Team, Fixtures } from '@/types/fpl'
import type { DifficultyType } from '@/lib/generateFixtureMatrix'

import { FixtureChip } from './FixtureChip'
import { type RowData } from './FixtureGrid'

type FixtureGridRowProps = {
	row: RowData
	team: Team
	teams: Team[]
	difficultyType: DifficultyType
	allFixtures: Fixtures
	numberOfGameweeks: number
	gameweekIds: number[]
}

export const FixtureGridRow = ({
	row,
	team,
	teams,
	difficultyType,
	allFixtures,
	numberOfGameweeks,
	gameweekIds,
}: FixtureGridRowProps) => {
	return (
		<TableRow
			hoverHighlight={false}
			className='border-b border-border/50 transition-colors duration-150'
		>
			<TableCell
				className='w-0 whitespace-nowrap p-0 text-left'
				style={{
					position: 'sticky',
					left: 0,
					zIndex: 20,
					backgroundColor: 'hsl(var(--card))',
				}}
			>
				<Link
					href={`/team/${team.short_name.toLowerCase()}`}
					className='inline-flex items-center px-2 py-2 transition-colors duration-150 hover:underline'
				>
					<span className='text-sm font-semibold text-foreground'>{row.team}</span>
				</Link>
			</TableCell>

			{row.fixtures.slice(0, numberOfGameweeks).map((fixtures, columnIndex) => {
				const gameweekId = gameweekIds[columnIndex] ?? columnIndex
				return (
					<TableCell
						key={`${row.team}_${gameweekId}`}
						className='relative p-0 text-center md:w-auto'
					>
						<div className='hover:bg-red relative z-10 flex h-full flex-col items-stretch justify-center gap-1.5 p-2'>
							{fixtures.map((fixture, chipIndex) => (
								<FixtureChip
									key={chipIndex}
									fixture={fixture}
									teams={teams}
									difficultyType={difficultyType}
									fixtures={allFixtures}
								/>
							))}
						</div>
					</TableCell>
				)
			})}

			<TableCell
				className='border-l border-border p-0 text-right'
				style={{
					position: 'sticky',
					right: 0,
					zIndex: 20,
					backgroundColor: 'hsl(var(--card))',
				}}
			>
				<div className='flex h-full items-center justify-center px-3'>
					<span className='text-sm font-bold tabular-nums text-foreground'>
						{(row.score / numberOfGameweeks).toFixed(2)}
					</span>
				</div>
			</TableCell>
		</TableRow>
	)
}
