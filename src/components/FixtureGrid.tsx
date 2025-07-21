'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { type Gameweek } from '@/types/fpl'
import { type DifficultyType } from '@/lib/generateFixtureMatrix'

type FixtureCell = {
	label: string
	difficulty: number
}

type RowData = {
	team: string
	fixtures: FixtureCell[][]
	score: number
}

type FixtureGridProps = {
	data: RowData[]
	events: Gameweek[]
	firstGameweek: number
	numberOfGameweeks: number
	onSort: (key: 'team' | 'score') => void
	sortConfig: {
		key: 'team' | 'score'
		direction: 'ascending' | 'descending'
	}
	difficultyType: DifficultyType
}

export const FixtureGrid = ({
	data,
	events,
	firstGameweek,
	numberOfGameweeks,
	onSort,
	sortConfig,
	difficultyType,
}: FixtureGridProps) => {
	const getDifficultyUI = (score: number) => {
		const roundedScore = Math.round(score)

		if (difficultyType === 'fpl') {
			switch (roundedScore) {
				case 1:
					return { bg: 'bg-green-500/60', text: 'text-green-500' }
				case 2:
					return { bg: 'bg-green-300/60', text: 'text-green-300' }
				case 3:
					return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
				case 4:
					return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
				case 5:
					return { bg: 'bg-red-500/60', text: 'text-red-500' }
				default:
					return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
			}
		}

		if (score === 0) return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
		if (score < 1.5) return { bg: 'bg-green-500/60', text: 'text-green-500' }
		if (score < 2.0) return { bg: 'bg-green-400/60', text: 'text-green-400' }
		if (score < 2.5) return { bg: 'bg-yellow-300/60', text: 'text-yellow-300' }
		if (score < 3.0) return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
		if (score < 3.5) return { bg: 'bg-orange-400/60', text: 'text-orange-400' }
		if (score < 4.0) return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
		if (score < 4.5) return { bg: 'bg-red-500/60', text: 'text-red-500' }
		return { bg: 'bg-red-600/60', text: 'text-red-600' }
	}

	const SortIndicator = ({ columnKey }: { columnKey: 'team' | 'score' }) => {
		if (sortConfig.key !== columnKey) {
			return null
		}
		return sortConfig.direction === 'ascending' ? (
			<ArrowUp className='ml-1 inline h-4 w-4' />
		) : (
			<ArrowDown className='ml-1 inline h-4 w-4' />
		)
	}

	return (
		<div className='overflow-x-auto rounded-md border'>
			<Table className='border-separate border-spacing-x-1 text-sm'>
				<TableHeader>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='sticky left-0 z-20 w-[120px] bg-background p-0 text-left'>
							<button
								className='flex h-full w-full items-center p-2 text-left transition-colors hover:bg-muted'
								onClick={() => onSort('team')}
							>
								Team
								<SortIndicator columnKey='team' />
							</button>
						</TableHead>

						{events
							.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks)
							.map((gw) => (
								<TableHead key={gw.id} className='w-[110px] text-center'>
									GW {gw.id}
								</TableHead>
							))}

						<TableHead className='w-[80px] p-0 text-center'>
							<button
								className='flex h-full w-full items-center justify-center p-2 transition-colors hover:bg-muted'
								onClick={() => onSort('score')}
							>
								Score
								<SortIndicator columnKey='score' />
							</button>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.team} className='group'>
							<TableCell className='sticky left-0 z-10 bg-background p-0 text-left font-semibold transition-colors group-hover:bg-muted'>
								<div className='flex h-full min-h-[56px] items-center px-2'>
									{row.team}
								</div>
							</TableCell>

							{row.fixtures.map((fixtures, colIndex) => (
								<TableCell
									key={`${row.team}_${colIndex}`}
									className='p-0 text-center'
								>
									<div className='flex h-full min-h-[56px] flex-col items-stretch justify-center gap-1 p-1'>
										{fixtures.map(({ difficulty, label }, cellIndex) => (
											<div
												key={cellIndex}
												className={`flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-2 py-1 ${
													getDifficultyUI(difficulty).bg
												}`}
											>
												<span className='font-normal text-black dark:text-white'>
													{label}
												</span>
												<span className='ml-1 inline-block w-[5ch] text-left text-xs text-black/70 dark:text-white/70'>
													(
													{difficultyType === 'fpl'
														? difficulty
														: difficulty.toFixed(2)}
													)
												</span>
											</div>
										))}
									</div>
								</TableCell>
							))}
							<TableCell className='p-0 text-center font-semibold'>
								<div className='flex h-full min-h-[56px] items-center justify-center'>
									{row.score.toFixed(2)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
