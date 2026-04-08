import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Fixtures',
	description:
		'Premier League fixtures and results by gameweek, plus Studio FDR difficulty grid and attractiveness charts.',
}

const FixturesLayout = ({ children }: { children: React.ReactNode }) => children

export default FixturesLayout
