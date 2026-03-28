'use client'

import { Table, TrendingUp } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Label } from '@/components/ui/label'

export type View = 'grid' | 'chart'

export const ViewToggle = ({
	view,
	onViewChange,
	compact = false,
}: {
	view: View
	onViewChange: (v: View) => void
	/** Single-row toolbar: hide visible label, tighter layout */
	compact?: boolean
}) => (
	<div
		className={
			compact ? 'flex shrink-0 items-center gap-2' : 'flex flex-col gap-2'
		}
	>
		<Label className={compact ? 'sr-only' : undefined}>View</Label>
		<ToggleGroup
			type='single'
			value={view}
			onValueChange={(value) => {
				if (value === 'grid' || value === 'chart') onViewChange(value)
			}}
			aria-label='Select view'
		>
			<ToggleGroupItem
				value='grid'
				aria-label='Grid view'
				className='flex items-center gap-2'
			>
				<Table className='h-4 w-4' />
				Grid
			</ToggleGroupItem>
			<ToggleGroupItem
				value='chart'
				aria-label='Chart view'
				className='flex items-center gap-2'
			>
				<TrendingUp className='h-4 w-4' />
				Chart
			</ToggleGroupItem>
		</ToggleGroup>
	</div>
)
