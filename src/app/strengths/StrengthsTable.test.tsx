import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { mockTeams } from '@/lib/test-mocks'

import { StrengthsTable } from './StrengthsTable'

describe('StrengthsTable', () => {
	it('renders team names and links to team pages', () => {
		render(<StrengthsTable teams={mockTeams} />)
		const arsenal = screen.getByRole('link', { name: /Arsenal/i })
		expect(arsenal).toHaveAttribute('href', '/team/ars?from=strengths')
		expect(screen.getByRole('link', { name: /Man City/i })).toHaveAttribute('href', '/team/mci?from=strengths')
	})

	it('sorts by Strength descending when header is toggled', () => {
		render(<StrengthsTable teams={mockTeams} />)
		const strengthBtn = screen.getByRole('button', { name: /Strength/i })
		fireEvent.click(strengthBtn)
		const rows = screen.getAllByRole('row').slice(1)
		expect(within(rows[0]).getByText('Man City')).toBeInTheDocument()
		fireEvent.click(strengthBtn)
		const rowsAsc = screen.getAllByRole('row').slice(1)
		expect(within(rowsAsc[0]).getByText('Arsenal')).toBeInTheDocument()
	})
})
