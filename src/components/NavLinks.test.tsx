import { usePathname } from 'next/navigation'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NavLinks } from './NavLinks'

vi.mock('next/navigation', () => ({
	usePathname: vi.fn(),
}))

const mockedPathname = vi.mocked(usePathname)

describe('NavLinks', () => {
	beforeEach(() => {
		mockedPathname.mockReturnValue('/')
	})

	it('renders fixtures and strengths links', () => {
		render(<NavLinks />)
		expect(screen.getByRole('link', { name: 'Fixtures' })).toHaveAttribute('href', '/fixtures')
		expect(screen.getByRole('link', { name: 'Strengths' })).toHaveAttribute('href', '/strengths')
	})

	it('marks fixtures link active when pathname matches', () => {
		mockedPathname.mockReturnValue('/fixtures')
		render(<NavLinks />)
		expect(screen.getByRole('link', { name: 'Fixtures' }).className).toMatch(/bg-accent/)
		expect(screen.getByRole('link', { name: 'Strengths' }).className).toMatch(/text-muted-foreground/)
	})

	it('marks strengths active for nested routes', () => {
		mockedPathname.mockReturnValue('/strengths')
		render(<NavLinks />)
		expect(screen.getByRole('link', { name: 'Strengths' }).className).toMatch(/bg-accent/)
	})
})
