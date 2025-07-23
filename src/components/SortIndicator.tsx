'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

type SortIndicatorProps = {
	columnKey: 'team' | 'score'
	sortConfig: {
		key: 'team' | 'score'
		direction: 'ascending' | 'descending'
	}
}

export const SortIndicator = ({ columnKey, sortConfig }: SortIndicatorProps) => {
	if (sortConfig.key !== columnKey) {
		return (
			<div className='ml-2 opacity-0 transition-opacity duration-200 group-hover:opacity-30'>
				<ArrowUp className='h-4 w-4' />
			</div>
		)
	}

	return (
		<div className='ml-2 opacity-100 transition-opacity duration-200'>
			{sortConfig.direction === 'ascending' ? (
				<ArrowUp className='h-4 w-4 text-primary' />
			) : (
				<ArrowDown className='h-4 w-4 text-primary' />
			)}
		</div>
	)
}
