import { ArrowUp, ArrowDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type SortConfig } from '@/hooks/useFplTable'

interface SortIndicatorProps {
	columnKey: 'team' | 'score'
	sortConfig: SortConfig
}

export function SortIndicator({ columnKey, sortConfig }: SortIndicatorProps) {
	const isActive = sortConfig.key === columnKey
	const isAscending = sortConfig.direction === 'ascending'

	return (
		<div
			className={cn(
				'ml-2 transition-opacity duration-200',
				isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-30',
			)}
		>
			{isActive && isAscending ? (
				<ArrowUp className='h-4 w-4' />
			) : (
				<ArrowDown className='h-4 w-4' />
			)}
		</div>
	)
}
