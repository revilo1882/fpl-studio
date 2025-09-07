'use client'

import { HelpCircle } from 'lucide-react'

import { TableHead, TableRow } from '@/components/ui/table'
import type { Gameweek } from '@/types/fpl'

import { SortIndicator } from './SortIndicator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

type SortConfig = { key: 'team' | 'score'; direction: 'ascending' | 'descending' }

type FixtureGridHeaderProps = {
	events: Gameweek[]
	firstGameweek: number
	numberOfGameweeks: number
	onSort: (key: 'team' | 'score') => void
	sortConfig: SortConfig
}

export const FixtureGridHeader = ({
	events,
	firstGameweek,
	numberOfGameweeks,
	onSort,
	sortConfig,
}: FixtureGridHeaderProps) => {
	const ariaSortTeam =
		sortConfig.key === 'team'
			? sortConfig.direction === 'ascending'
				? 'ascending'
				: 'descending'
			: 'none'
	const ariaSortScore =
		sortConfig.key === 'score'
			? sortConfig.direction === 'ascending'
				? 'ascending'
				: 'descending'
			: 'none'

	return (
		<TableRow className='border-b hover:bg-transparent'>
			<TableHead
				className='sticky left-0 top-0 z-40 w-0 whitespace-nowrap bg-background p-0 text-left font-semibold'
				aria-sort={ariaSortTeam as 'ascending' | 'descending' | 'none'}
			>
				<button
					onClick={() => onSort('team')}
					className='flex h-full w-full items-center gap-2 px-2 py-3 text-left transition-colors duration-150 hover:bg-muted/50 active:bg-muted'
				>
					<span className='font-semibold text-foreground'>Team</span>
					<SortIndicator columnKey='team' sortConfig={sortConfig} />
				</button>
			</TableHead>

			{events.slice(firstGameweek - 1, firstGameweek - 1 + numberOfGameweeks).map((gw) => (
				<TableHead
					key={gw.id}
					className='sticky top-0 z-30 min-w-[120px] bg-background text-center font-semibold md:w-auto'
				>
					<div className='px-2 py-3'>
						<span className='text-sm font-semibold text-foreground'>GW {gw.id}</span>
					</div>
				</TableHead>
			))}
			<TableHead
				className='relative sticky right-0 top-0 z-40 w-[90px] border-l border-border bg-background p-0 text-right font-semibold'
				aria-sort={ariaSortScore as 'ascending' | 'descending' | 'none'}
			>
				<button
					onClick={() => onSort('score')}
					aria-label='Sort by score'
					className='flex h-full w-full items-center justify-center px-8 py-3 transition-colors duration-150 hover:bg-muted/50 active:bg-muted'
				>
					<span className='font-semibold text-foreground'>Score</span>
					<SortIndicator columnKey='score' sortConfig={sortConfig} />
				</button>

				<TooltipProvider>
					<Tooltip delayDuration={200}>
						<TooltipTrigger asChild>
							<button
								type='button'
								className='absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground'
								aria-label='What is Score?'
							>
								<HelpCircle className='h-3.5 w-3.5' />
							</button>
						</TooltipTrigger>
						<TooltipContent side='bottom' align='end' className='max-w-[240px] text-xs'>
							Average attractiveness across selected gameweeks (1–5 per fixture). The
							higher the score the better.
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</TableHead>
		</TableRow>
	)
}
