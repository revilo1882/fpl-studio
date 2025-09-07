'use client'

import { TrendingUp, Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ChartEmptyStateProps {
	onOpenTeamFilter?: () => void
}

export const ChartEmptyState = ({ onOpenTeamFilter }: ChartEmptyStateProps) => {
	return (
		<div className='flex h-full min-h-[360px] items-center justify-center rounded-lg border bg-card p-8 shadow-sm'>
			<div className='text-center'>
				<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
					<TrendingUp className='h-8 w-8 text-muted-foreground' />
				</div>
				<h3 className='mb-2 text-lg font-semibold'>Select Teams to View Chart</h3>
				<p className='mb-4 max-w-sm text-sm text-muted-foreground'>
					The chart works best with a selection of teams. Please use the team filter to
					choose which teams you'd like to compare.
				</p>
				{onOpenTeamFilter && (
					<Button variant='outline' onClick={onOpenTeamFilter} className='gap-2'>
						<Filter className='h-4 w-4' />
						Open Team Filter
					</Button>
				)}
			</div>
		</div>
	)
}
