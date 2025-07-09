'use client'

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

type FixtureGridProps = {
	teams: string[]
	fixtureMatrix: FixtureCell[][][]
	averages: number[]
	events: Gameweek[]
	firstGameweek: number
	numberOfGameweeks: number
}

export const FixtureGrid = ({
	teams,
	fixtureMatrix,
	averages,
	events,
	firstGameweek,
	numberOfGameweeks,
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

	return (
		<div className='overflow-x-auto rounded-md border'>
			<Table className='border-separate border-spacing-x-1 text-sm'>
				<TableHeader>
					<TableRow>
						<TableHead className='sticky left-0 z-20 min-w-[120px] bg-background text-left'>
							Team
						</TableHead>
						{events
							.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks)
							.map((gw) => (
								<TableHead key={gw.id} className='text-center'>
									GW {gw.id}
								</TableHead>
							))}
						<TableHead className='text-center'>Avg</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teams.map((team, rowIndex) => {
						const avg = averages[rowIndex]
						return (
							<TableRow key={team}>
								<TableCell className='sticky left-0 z-10 min-w-[120px] bg-background text-left font-semibold'>
									{team}
								</TableCell>

								{fixtureMatrix[rowIndex].map((fixtures, colIndex) => (
									<TableCell
										key={`${rowIndex}_${colIndex}`}
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
										className={`rounded bg-slate-300 px-2 py-1 font-mono text-xs ${getAvgColor(avg)} bg-opacity-20`}
									>
										{avg}
									</span>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
