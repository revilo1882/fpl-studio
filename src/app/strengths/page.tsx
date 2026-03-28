import type { Team } from '@/types/fpl'

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

	const formattedNow = new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Europe/London',
	}).format(new Date())

	return (
		<div className='container mx-auto flex flex-col gap-4 px-4 py-6 sm:h-full sm:overflow-hidden sm:py-8'>
			<div className='shrink-0 flex items-end justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Team Strength Snapshot</h1>
					<p className='mt-1 text-sm text-muted-foreground'>
						The raw FPL strength metrics used as base inputs to the FDR algorithm.
						Click any column header to sort.
					</p>
				</div>
				<p className='shrink-0 text-sm text-muted-foreground'>As of {formattedNow}</p>
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
