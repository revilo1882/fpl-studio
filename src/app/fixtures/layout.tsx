import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Fixture difficulty grid',
	description:
		'Browse every Premier League club in a live grid with Studio FDR ratings, gameweek windows, and attractiveness charts.',
}

export default function FixturesLayout({ children }: { children: React.ReactNode }) {
	return children
}
