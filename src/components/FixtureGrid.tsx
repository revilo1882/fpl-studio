'use client'

import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { type Gameweek } from '@/types/fpl'

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
}

export const FixtureGrid = ({
	data,
	events,
	firstGameweek,
	numberOfGameweeks,
	onSort,
	sortConfig,
}: FixtureGridProps) => {
	const fdrColors = [
		'bg-[rgba(34,197,94,0.6)]',
		'bg-[rgba(163,230,53,0.6)]',
		'bg-[rgba(253,224,71,0.6)]',
		'bg-[rgba(253,186,116,0.6)]',
		'bg-[rgba(248,113,113,0.6)]',
	]

	const getAvgColor = (avg: number) => {
		if (avg < 2.5) return 'text-green-600'
		if (avg < 3.0) return 'text-lime-600'
		if (avg < 3.5) return 'text-yellow-600'
		if (avg < 4.0) return 'text-orange-600'
		return 'text-red-600'
	}

	const SortIndicator = ({ columnKey }: { columnKey: 'team' | 'average' }) => {
		if (sortConfig.key === columnKey) {
			return sortConfig.direction === 'ascending' ? (
				<ArrowUp className='ml-1 inline h-4 w-4' />
			) : (
				<ArrowDown className='ml-1 inline h-4 w-4' />
			)
		}
		// Render a default, subtle icon for all non-active sortable columns
		return <ChevronsUpDown className='ml-1 inline h-4 w-4 text-muted-foreground/30' />
	}

	return (
		<div className='overflow-x-auto rounded-md border'>
			<Table className='border-separate border-spacing-x-1 text-sm'>
				<TableHeader>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='sticky left-0 z-20 min-w-[120px] bg-background p-0 text-left'>
							<button
								className='flex h-full w-full items-center p-2 text-left transition-colors hover:bg-muted/50'
								onClick={() => onSort('team')}
							>
								Team
								<SortIndicator columnKey='team' />
							</button>
						</TableHead>

						{events
							.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks)
							.map((gw) => (
								<TableHead key={gw.id} className='text-center'>
									GW {gw.id}
								</TableHead>
							))}

						<TableHead className='p-0 text-center'>
							<button
								className='flex h-full w-full items-center justify-center p-2 transition-colors hover:bg-muted/50'
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
							<TableCell className='sticky left-0 z-10 min-w-[120px] bg-background text-left font-semibold transition-colors group-hover:bg-muted/50'>
								{row.team}
							</TableCell>

							{row.fixtures.map((fixtures, colIndex) => (
								<TableCell
									key={`${row.team}_${colIndex}`}
									className='min-w-[80px] space-y-[2px] divide-y p-0 text-center'
								>
									{fixtures.map(({ difficulty, label }, cellIndex) => (
										<div
											key={cellIndex}
											className={`whitespace-nowrap rounded-sm px-2 py-1 ${
												fdrColors[difficulty - 1] || ''
											}`}
										>
											{label}
										</div>
									))}
								</TableCell>
							))}
							<TableCell className='text-center'>
								<span
									className={`rounded bg-slate-300 px-2 py-1 font-mono text-xs ${getAvgColor(
										row.average,
									)} bg-opacity-20`}
								>
									{row.average}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
