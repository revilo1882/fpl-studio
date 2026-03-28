import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { getTeamBadgeUrl } from '@/lib/fpl/badges'

import { TeamBadge } from './TeamBadge'

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: { src: string; alt: string; width?: number; height?: number }) => (
		// eslint-disable-next-line @next/next/no-img-element -- test double for next/image
		<img src={props.src} alt={props.alt} width={props.width} height={props.height} />
	),
}))

describe('TeamBadge', () => {
	it('renders nothing when team code is 0', () => {
		const { container } = render(<TeamBadge code={0} name='TBC' />)
		expect(container.firstChild).toBeNull()
	})

	it('renders badge with 25px asset URL by default', () => {
		render(<TeamBadge code={11} name='Arsenal' />)
		const img = screen.getByRole('img', { name: 'Arsenal badge' })
		expect(img).toHaveAttribute('src', getTeamBadgeUrl(11, 25))
		expect(img).toHaveAttribute('width', '20')
		expect(img).toHaveAttribute('height', '20')
	})

	it('uses 100px badge URL when size is 50 or larger', () => {
		render(<TeamBadge code={11} name='Arsenal' size={80} />)
		const img = screen.getByRole('img', { name: 'Arsenal badge' })
		expect(img).toHaveAttribute('src', getTeamBadgeUrl(11, 100))
		expect(img).toHaveAttribute('width', '80')
		expect(img).toHaveAttribute('height', '80')
	})
})
