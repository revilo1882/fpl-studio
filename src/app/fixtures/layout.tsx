import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Fixture difficulty grid',
	description:
		'Browse every Premier League club in a live grid with Studio FDR ratings, gameweek windows, and attractiveness charts.',
}

const FixturesLayout = ({ children }: { children: React.ReactNode }) => children

export default FixturesLayout
