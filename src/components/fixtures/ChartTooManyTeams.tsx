'use client'

import { TrendingUp, AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ChartTooManyTeamsProps {
	selectedCount: number
	maxTeams: number
	onClearTeams: () => void
}

export const ChartTooManyTeams = ({
	selectedCount,
	maxTeams,
	onClearTeams,
}: ChartTooManyTeamsProps) => {
	return (
		<div className='flex h-full min-h-[360px] items-center justify-center rounded-lg border bg-card p-8 shadow-sm'>
			<div className='text-center'>
				<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
					<AlertTriangle className='h-8 w-8 text-destructive' />
				</div>
				<h3 className='mb-2 text-lg font-semibold'>Too Many Teams Selected</h3>
				<p className='mb-4 max-w-sm text-sm text-muted-foreground'>
					You have {selectedCount} teams selected, but the chart view supports a maximum
					of {maxTeams} teams for optimal readability.
				</p>
				<p className='mb-4 max-w-sm text-sm text-muted-foreground'>
					Please reduce your selection or switch back to grid view to see all teams.
				</p>
				<Button variant='outline' onClick={onClearTeams} className='gap-2'>
					<TrendingUp className='h-4 w-4' />
					Clear Team Selection
				</Button>
			</div>
		</div>
	)
}
