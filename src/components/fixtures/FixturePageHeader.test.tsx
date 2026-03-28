import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FixturePageHeader } from './FixturePageHeader'

describe('FixturePageHeader', () => {
	it('renders title', () => {
		render(<FixturePageHeader title='Fixture Difficulty' />)
		expect(screen.getByRole('heading', { level: 1, name: 'Fixture Difficulty' })).toBeInTheDocument()
	})

	it('renders subtitle when provided', () => {
		render(
			<FixturePageHeader
				title='Fixture Difficulty'
				subtitle='Analyse upcoming fixtures with Studio FDR ratings.'
			/>,
		)
		expect(
			screen.getByText('Analyse upcoming fixtures with Studio FDR ratings.'),
		).toBeInTheDocument()
	})
})
