import type { Team } from '@/types/fpl'
import { FixturePageHeader } from '@/components/FixturePageHeader'

import { StrengthsTable } from './StrengthsTable'

const fetchTeams = async (): Promise<Team[]> => {
	const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
		cache: 'no-store',
	})
	if (!res.ok) throw new Error('Failed to fetch FPL bootstrap')
	const data = await res.json()
	return data.teams as Team[]
}

const StrengthsPage = async () => {
	const teams = await fetchTeams()

	return (
		<div className='container mx-auto flex flex-col gap-4 px-4 py-4 sm:h-full sm:overflow-hidden sm:gap-6 sm:py-6'>
			<div className='shrink-0'>
				<FixturePageHeader
					title='Team Strength Snapshot'
					subtitle='The raw FPL strength metrics used as base inputs to the FDR algorithm. Click any column header to sort.'
					className='mb-2 sm:mb-0'
				/>
			</div>

			<div className='sm:min-h-0 sm:flex-1'>
				<StrengthsTable teams={teams} />
			</div>

			<p className='shrink-0 text-xs text-muted-foreground'>
				Source: Official FPL API (
				<code className='text-xs'>bootstrap-static</code>). Strength values are on a
				1000–1400 scale; FPL Studio normalises these to a 1–5 rating for the FDR model.
			</p>
		</div>
	)
}

export default StrengthsPage
