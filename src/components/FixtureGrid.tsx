'use client'

import Image from 'next/image' // Import Image
import Link from 'next/link' // Import Link

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { Fixtures, Gameweek, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/generateFixtureMatrix'
import { getTeamBadgeUrl } from '@/lib/utils' // Import getTeamBadgeUrl

import { FixtureChip } from './FixtureChip'
import { SortIndicator } from './SortIndicator'

type FixtureCell = SingleFixture[]

type RowData = {
	team: string
	fixtures: FixtureCell[]
	score: number
}

type FixtureGridProps = {
	data: RowData[]
	events: Gameweek[]
	teams: Team[]
	firstGameweek: number
	numberOfGameweeks: number
	onSort: (key: 'team' | 'score') => void
	sortConfig: {
		key: 'team' | 'score'
		direction: 'ascending' | 'descending'
	}
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
	return (
		<div className='overflow-x-auto'>
			<Table className='border-separate border-spacing-x-1 text-sm'>
				<TableHeader>
					<TableRow className='border-b hover:bg-transparent'>
						<TableHead className='sticky left-0 z-20 w-[140px] bg-background p-0 text-left font-semibold'>
							<button
								className='flex h-full w-full items-center px-4 py-3 text-left transition-all duration-200 hover:bg-muted/50 active:bg-muted'
								onClick={() => onSort('team')}
							>
								<span className='font-semibold text-foreground'>Team</span>
								<SortIndicator columnKey='team' sortConfig={sortConfig} />
							</button>
						</TableHead>

						{events
							.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks)
							.map((gw) => (
								<TableHead
									key={gw.id}
									className='w-[120px] text-center font-semibold'
								>
									<div className='px-2 py-3'>
										<span className='text-sm font-semibold text-foreground'>
											GW {gw.id}
										</span>
									</div>
								</TableHead>
							))}

						<TableHead className='sticky right-0 z-20 w-[90px] border-l border-border bg-background p-0 text-center font-semibold'>
							<button
								className='flex h-full w-full items-center justify-center bg-background px-3 py-3 transition-all duration-200 hover:bg-muted/50 active:bg-muted'
								onClick={() => onSort('score')}
							>
								<span className='font-semibold text-foreground'>Score</span>
								<SortIndicator columnKey='score' sortConfig={sortConfig} />
							</button>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => {
						const team = teams.find((t) => t.name === row.team)
						if (!team) return null // Should not happen with correct data

						return (
							<TableRow
								key={row.team}
								className='group border-b border-border/50 transition-colors duration-150 hover:bg-muted/30'
							>
								<TableCell className='sticky left-0 z-10 bg-background p-0 text-left transition-colors duration-150 group-hover:bg-background'>
									<Link
										href={`/team/${team.short_name.toLowerCase()}`}
										className='flex h-full min-h-[64px] items-center bg-background px-4 transition-colors duration-150 hover:underline group-hover:bg-muted/30'
									>
										{team.code !== 0 && ( // Only show badge if code is not 0 (for mock team)
											<Image
												src={
													getTeamBadgeUrl(team.code) || '/placeholder.svg'
												}
												alt={`${team.name} badge`}
												width={24}
												height={24}
												className='mr-2 rounded-full'
											/>
										)}
										<span className='text-sm font-semibold text-foreground'>
											{row.team}
										</span>
									</Link>
								</TableCell>

								{row.fixtures.map((fixtures, colIndex) => (
									<TableCell
										key={`${row.team}_${colIndex}`}
										className='p-0 text-center'
									>
										<div className='flex h-full min-h-[64px] flex-col items-stretch justify-center gap-1.5 p-2'>
											{fixtures.map((fixture, cellIndex) => (
												<FixtureChip
													key={cellIndex}
													fixture={fixture}
													teams={teams}
													difficultyType={difficultyType}
													fixtures={allFixtures}
												/>
											))}
										</div>
									</TableCell>
								))}

								<TableCell className='sticky right-0 z-10 border-l border-border bg-background p-0 text-center transition-colors duration-150 group-hover:bg-background'>
									<div className='flex h-full min-h-[64px] items-center justify-center bg-background px-3 transition-colors duration-150 group-hover:bg-muted/30'>
										<span className='text-sm font-bold tabular-nums text-foreground'>
											{row.score.toFixed(2)}
										</span>
									</div>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
