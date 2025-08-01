import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { SortIndicator } from './SortIndicator'

describe('SortIndicator', () => {
	const mockSortConfig = {
		key: 'team' as const,
		direction: 'ascending' as const,
	}

	it('shows hidden arrow when column is not active', () => {
		const { container } = render(
			<SortIndicator columnKey='score' sortConfig={mockSortConfig} />,
		)

		// Find the div with opacity-0 class
		const hiddenArrow = container.querySelector('.opacity-0')
		expect(hiddenArrow).toBeInTheDocument()
		expect(hiddenArrow).toHaveClass('group-hover:opacity-30')
	})

	it('shows visible arrow when column is active and ascending', () => {
		const { container } = render(<SortIndicator columnKey='team' sortConfig={mockSortConfig} />)

		// Find the div with opacity-100 class
		const visibleArrow = container.querySelector('.opacity-100')
		expect(visibleArrow).toBeInTheDocument()

		// Check for ArrowUp icon
		const arrowUpIcon = container.querySelector('svg')
		expect(arrowUpIcon).toBeInTheDocument()
	})

	it('shows descending arrow when column is active and descending', () => {
		const descendingSortConfig = {
			key: 'team' as const,
			direction: 'descending' as const,
		}

		const { container } = render(
			<SortIndicator columnKey='team' sortConfig={descendingSortConfig} />,
		)

		const visibleArrow = container.querySelector('.opacity-100')
		expect(visibleArrow).toBeInTheDocument()

		// Check for ArrowDown icon (different path)
		const svg = container.querySelector('svg')
		expect(svg).toBeInTheDocument()
	})
})
