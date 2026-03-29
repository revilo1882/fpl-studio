'use client'

import type { Fixtures, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/fixtures/generateFixtureMatrix'
import { TeamBadge } from '@/components/team/TeamBadge'
import { FormBadges } from '@/components/team/FormBadges'

type FixtureChipPopoverContentProps = {
	fixture: SingleFixture
	difficultyType: DifficultyType
	opponentTeam?: Team
	formSummary: string
	fixtures: Fixtures
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const FixtureChipPopoverContent = ({
	fixture,
	difficultyType,
	opponentTeam,
	formSummary,
}: FixtureChipPopoverContentProps) => {
	const labelSuffix = (fixture.label ?? '').slice(-4)

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
				{opponentTeam && (
					<TeamBadge code={opponentTeam.code} name={fixture.opponentName} />
				)}
					<span className='font-semibold text-foreground'>{fixture.opponentName}</span>
				</div>
				{labelSuffix && (
					<span className='text-xs text-muted-foreground'>{labelSuffix}</span>
				)}
			</div>

			<div className='grid grid-cols-2 gap-x-3 gap-y-1 text-xs'>
				<div className='col-span-2 flex justify-between'>
					<span className='text-muted-foreground'>
						{titleCase(String(difficultyType))}:
					</span>
					<span className='font-semibold tabular-nums'>
						{typeof fixture.difficulty === 'number'
							? fixture.difficulty.toFixed(2)
							: String(fixture.difficulty)}
					</span>
				</div>

			{opponentTeam && (
				<div className='col-span-2 flex items-start justify-between gap-2'>
					<span className='mt-0.5 text-muted-foreground'>Form:</span>
					<FormBadges formSummary={formSummary} />
				</div>
			)}

				{fixture.kickoffTime && (
					<div className='col-span-2 flex justify-between'>
						<span className='text-muted-foreground'>Kickoff:</span>
						<span className='font-medium'>
							{new Date(fixture.kickoffTime).toLocaleString('en-GB', {
								weekday: 'short',
								day: 'numeric',
								month: 'short',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
					</div>
				)}
			</div>

		{fixture.confidenceInterval && typeof fixture.confidenceScore === 'number' && (
			<div className='space-y-1 border-t pt-2'>
				<div className='flex items-center justify-between text-xs'>
					<span className='text-muted-foreground'>Confidence:</span>
					<span className='font-semibold'>
						{(fixture.confidenceScore * 100).toFixed(0)}%
					</span>
				</div>
				<div className='flex items-center justify-between text-xs'>
					<span className='text-muted-foreground'>Range:</span>
					<span className='font-semibold'>
						{fixture.confidenceInterval[0].toFixed(1)} –{' '}
						{fixture.confidenceInterval[1].toFixed(1)}
					</span>
				</div>
			</div>
		)}
		</div>
	)
}
