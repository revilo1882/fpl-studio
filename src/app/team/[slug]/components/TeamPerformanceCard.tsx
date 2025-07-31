import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFormSummary } from '@/lib/fixtureGridUtils'
import type { Fixtures } from '@/types/fpl'

interface TeamPerformanceCardProps {
	teamPerformance: {
		gamesPlayed: number
		points: number
		wins: number
		draws: number
		losses: number
		goalsFor: number
		goalsAgainst: number
	}
	teamId: number
	allFixtures: Fixtures
}

export function TeamPerformanceCard({
	teamPerformance,
	teamId,
	allFixtures,
}: TeamPerformanceCardProps) {
	const formSummary = getFormSummary(teamId, allFixtures)
	const goalDifference = teamPerformance.goalsFor - teamPerformance.goalsAgainst
	const pointsPerGame =
		teamPerformance.gamesPlayed > 0
			? (teamPerformance.points / teamPerformance.gamesPlayed).toFixed(1)
			: '0.0'

	return (
		<Card className='flex h-full flex-col overflow-hidden border'>
			<CardHeader className='border-b pb-4'>
				<CardTitle className='flex items-center justify-between'>
					<span>Season Performance</span>
					<span className='text-sm font-normal text-muted-foreground'>
						{teamPerformance.gamesPlayed} games
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex-1 space-y-6 overflow-y-auto pt-6'>
				{/* Points and PPG */}
				<div className='grid grid-cols-2 gap-4'>
					<div className='text-center'>
						<div className='text-3xl font-bold text-foreground'>
							{teamPerformance.points}
						</div>
						<div className='text-sm text-muted-foreground'>Points</div>
					</div>
					<div className='text-center'>
						<div className='text-3xl font-bold text-foreground'>{pointsPerGame}</div>
						<div className='text-sm text-muted-foreground'>PPG</div>
					</div>
				</div>

				{/* Win/Draw/Loss */}
				<div className='grid grid-cols-3 gap-3 rounded-lg bg-muted/30 p-4'>
					<div className='text-center'>
						<div className='text-xl font-bold text-green-600 dark:text-green-400'>
							{teamPerformance.wins}
						</div>
						<div className='text-sm text-muted-foreground'>Wins</div>
					</div>
					<div className='text-center'>
						<div className='text-xl font-bold text-yellow-600 dark:text-yellow-400'>
							{teamPerformance.draws}
						</div>
						<div className='text-sm text-muted-foreground'>Draws</div>
					</div>
					<div className='text-center'>
						<div className='text-xl font-bold text-red-600 dark:text-red-400'>
							{teamPerformance.losses}
						</div>
						<div className='text-sm text-muted-foreground'>Losses</div>
					</div>
				</div>

				{/* Goals */}
				<div className='grid grid-cols-3 gap-4 text-center'>
					<div>
						<div className='text-xl font-bold text-foreground'>
							{teamPerformance.goalsFor}
						</div>
						<div className='text-sm text-muted-foreground'>Goals For</div>
					</div>
					<div>
						<div
							className={`text-xl font-bold ${
								goalDifference > 0
									? 'text-green-600 dark:text-green-400'
									: goalDifference < 0
										? 'text-red-600 dark:text-red-400'
										: 'text-foreground'
							}`}
						>
							{goalDifference > 0 ? '+' : ''}
							{goalDifference}
						</div>
						<div className='text-sm text-muted-foreground'>Goal Diff</div>
					</div>
					<div>
						<div className='text-xl font-bold text-foreground'>
							{teamPerformance.goalsAgainst}
						</div>
						<div className='text-sm text-muted-foreground'>Goals Against</div>
					</div>
				</div>

				{/* Recent Form */}
				<div className='rounded-lg bg-muted/30 p-4'>
					<div className='flex items-center justify-between'>
						<span className='text-sm font-medium text-muted-foreground'>
							Recent Form
						</span>
						<span className='font-mono text-lg font-bold text-foreground'>
							{formSummary || 'No recent games'}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
