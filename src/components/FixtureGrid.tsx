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
	average: number
}

type FixtureGridProps = {
	data: RowData[]
	events: Gameweek[]
	firstGameweek: number
	numberOfGameweeks: number
	onSort: (key: 'team' | 'average') => void
	sortConfig: {
		key: 'team' | 'average'
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
					return { bg: 'bg-lime-500/60', text: 'text-lime-500' }
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
		if (score < 1.5) return { bg: 'bg-green-500/60', text: 'text-green-500' } // Easiest
		if (score < 2.0) return { bg: 'bg-lime-500/60', text: 'text-lime-500' }
		if (score < 2.5) return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
		if (score < 3.0) return { bg: 'bg-amber-400/60', text: 'text-amber-400' }
		if (score < 3.5) return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
		if (score < 4.0) return { bg: 'bg-rose-500/60', text: 'text-rose-500' }
		if (score >= 4.0) return { bg: 'bg-red-500/60', text: 'text-red-500' } // Hardest
		return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
	}

	const SortIndicator = ({ columnKey }: { columnKey: 'team' | 'average' }) => {
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
								onClick={() => onSort('average')}
							>
								Avg
								<SortIndicator columnKey='average' />
							</button>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.team} className='group'>
							<TableCell className='sticky left-0 z-10 bg-background text-left font-semibold transition-colors group-hover:bg-muted'>
								{row.team}
							</TableCell>

							{row.fixtures.map((fixtures, colIndex) => (
								<TableCell
									key={`${row.team}_${colIndex}`}
									className='space-y-[2px] divide-y p-0 text-center'
								>
									{fixtures.map(({ difficulty, label }, cellIndex) => (
										<div
											key={cellIndex}
											className={`whitespace-nowrap rounded-sm px-2 py-1 ${
												getDifficultyUI(difficulty).bg
											}`}
										>
											<span className='font-normal text-black dark:text-white'>
												{label}
											</span>
											<span className='ml-2 text-xs text-black/70 dark:text-white/70'>
												(
												{difficultyType === 'fpl'
													? difficulty
													: difficulty.toFixed(2)}
												)
											</span>
										</div>
									))}
								</TableCell>
							))}
							<TableCell className='text-center'>
								<span
									className={`rounded px-2 py-1 font-mono text-xs font-semibold ${
										getDifficultyUI(row.average).text
									}`}
								>
									{row.average.toFixed(2)}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
