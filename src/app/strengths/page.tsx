import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { Team } from '@/types/fpl'

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

	const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name))

	return (
		<div className='mt-20 space-y-4'>
			<div className='flex items-end justify-between'>
				<h1 className='text-2xl font-bold tracking-tight'>Team Strength Snapshot</h1>
				<p className='text-sm text-muted-foreground'>As of {formattedNow}</p>
			</div>

			<div className='overflow-x-auto rounded-lg border'>
				<Table className='text-sm'>
					<TableHeader>
						<TableRow>
							<TableHead className='whitespace-nowrap'>Team</TableHead>
							<TableHead className='whitespace-nowrap text-right'>Strength</TableHead>
							<TableHead className='whitespace-nowrap text-right'>
								Overall (Home)
							</TableHead>
							<TableHead className='whitespace-nowrap text-right'>
								Overall (Away)
							</TableHead>
							<TableHead className='whitespace-nowrap text-right'>
								Attack (Home)
							</TableHead>
							<TableHead className='whitespace-nowrap text-right'>
								Attack (Away)
							</TableHead>
							<TableHead className='whitespace-nowrap text-right'>
								Defence (Home)
							</TableHead>
							<TableHead className='whitespace-nowrap text-right'>
								Defence (Away)
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedTeams.map((team) => (
							<TableRow key={team.id} className='hover:bg-muted/30'>
								<TableCell className='font-medium'>
									{team.name} ({team.short_name})
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength}
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength_overall_home}
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength_overall_away}
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength_attack_home}
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength_attack_away}
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength_defence_home}
								</TableCell>
								<TableCell className='text-right tabular-nums'>
									{team.strength_defence_away}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<p className='text-xs text-muted-foreground'>
				Data from FPL bootstrap; take a screenshot now and compare again in ~5 weeks.
			</p>
		</div>
	)
}

export default StrengthsPage
