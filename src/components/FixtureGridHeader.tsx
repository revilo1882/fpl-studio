'use client'

import { HelpCircle } from 'lucide-react'

import { TableHead, TableRow } from '@/components/ui/table'
import type { Gameweek } from '@/types/fpl'
import { type FixtureGridSortConfig, type FixtureGridSortKey } from '@/hooks/useFplTable'

import { SortIndicator } from './SortIndicator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type FixtureGridHeaderProps = {
	events: Gameweek[]
	firstGameweek: number
	numberOfGameweeks: number
	onSort: (key: FixtureGridSortKey) => void
	sortConfig: FixtureGridSortConfig
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
					className='sticky top-0 z-30 min-w-[68px] bg-background text-center font-semibold sm:min-w-[92px] md:w-auto md:min-w-0'
				>
					<div className='px-2 py-3'>
						<span className='text-sm font-semibold text-foreground'>GW {gw.id}</span>
					</div>
				</TableHead>
			))}
			<TableHead
				className='relative top-0 z-40 w-[90px] border-l border-border bg-background p-0 text-right font-semibold sm:sticky sm:right-0'
				aria-sort={ariaSortScore as 'ascending' | 'descending' | 'none'}
			>
				<div className='flex items-center justify-end gap-2 px-3 py-2'>
					<span className='text-sm font-semibold'>Score</span>

					<Popover>
						<PopoverTrigger asChild>
							<button
								className='flex rounded p-1 hover:bg-accent sm:hidden'
								aria-label='What is the Score metric?'
							>
								<HelpCircle className='h-4 w-4' />
							</button>
						</PopoverTrigger>
						<PopoverContent
							side='bottom'
							align='end'
							className='w-64 p-3 text-sm leading-snug'
						>
							Average of shown gameweeks using your selected difficulty model. Higher
							= better fixtures. DGWs included; blanks count as 0.
						</PopoverContent>
					</Popover>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className='hidden cursor-help align-middle sm:inline-flex'>
									<HelpCircle className='h-4 w-4' />
								</span>
							</TooltipTrigger>
							<TooltipContent side='bottom' align='end' className='max-w-xs'>
								Average of shown gameweeks using your selected difficulty model.
								Higher = better fixtures. DGWs included; blanks count as 0.
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</TableHead>
		</TableRow>
	)
}
