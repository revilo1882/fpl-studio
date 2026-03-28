import { usePathname } from 'next/navigation'

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { AppHeader } from './AppHeader'

vi.mock('next/navigation', () => ({
	usePathname: vi.fn(),
}))

vi.mock('@/components/layout/ThemeToggle', () => ({
	ThemeToggle: () => <span data-testid='theme-toggle-mock' />,
}))

const mockedPathname = vi.mocked(usePathname)

describe('AppHeader', () => {
	beforeEach(() => {
		mockedPathname.mockReturnValue('/')
	})

	it('renders home link to /', () => {
		render(<AppHeader />)
		const home = screen.getByRole('link', { name: /FPL Studio/i })
		expect(home).toHaveAttribute('href', '/')
	})

	it('renders desktop nav links', () => {
		render(<AppHeader />)
		expect(screen.getByRole('link', { name: 'Fixtures' })).toHaveAttribute('href', '/fixtures')
		expect(screen.getByRole('link', { name: 'Strengths' })).toHaveAttribute('href', '/strengths')
	})

	it('toggles mobile menu and lists route links', () => {
		render(<AppHeader />)
		const menuBtn = screen.getByRole('button', { name: /open menu/i })
		fireEvent.click(menuBtn)
		expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
		const fixturesLinks = screen.getAllByRole('link', { name: 'Fixtures' })
		expect(fixturesLinks.length).toBeGreaterThanOrEqual(1)
		fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
		expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument()
	})

	it('closes mobile menu when home link is clicked', () => {
		render(<AppHeader />)
		fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
		fireEvent.click(screen.getByRole('link', { name: /FPL Studio/i }))
		expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument()
	})
})
