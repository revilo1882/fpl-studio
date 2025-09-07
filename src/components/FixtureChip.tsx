'use client'

import { useEffect, useState } from 'react'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import type { Fixtures, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/generateFixtureMatrix'
import { getDifficultyUI, getOpponentTeam, getFormSummary } from '@/lib/fixtureGridUtils'

import { FixtureChipPopoverContent } from './FixtureChipPopoverContent'

type FixtureChipProps = {
	fixture: SingleFixture
	teams: Team[]
	difficultyType: DifficultyType
	fixtures: Fixtures
}

export const FixtureChip = ({ fixture, teams, difficultyType, fixtures }: FixtureChipProps) => {
	const opponentTeam = getOpponentTeam(fixture.opponentName, teams)
	const [formSummary, setFormSummary] = useState<string>('Loading...')

	useEffect(() => {
		if (opponentTeam) setFormSummary(getFormSummary(opponentTeam.id, fixtures))
		else setFormSummary('N/A')
	}, [opponentTeam, fixtures])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div
					role='button'
					aria-label='Show fixture details'
					className={`group/chip flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-2 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] active:transition-none ${getDifficultyUI(fixture.difficulty, difficultyType).bg}`}
				>
					<span className='text-sm font-medium text-black dark:text-white'>
						{fixture.label}
					</span>
					<span className='ml-1.5 inline-block w-[5ch] text-left font-mono text-xs tabular-nums text-black/60 dark:text-white/60'>
						(
						{difficultyType === 'FPL'
							? fixture.difficulty
							: fixture.difficulty.toFixed(2)}
						)
					</span>
					{typeof fixture.attractivenessScore === 'number' &&
						fixture.attractivenessScore > 0 && (
							<span className='ml-1 text-xs text-blue-600 dark:text-blue-400'>
								★{fixture.attractivenessScore.toFixed(1)}
							</span>
						)}
				</div>
			</PopoverTrigger>

			<PopoverContent
				side='top'
				align='center'
				sideOffset={8}
				avoidCollisions
				collisionPadding={8}
				className='w-64 rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-lg'
			>
				<FixtureChipPopoverContent
					fixture={fixture}
					difficultyType={difficultyType}
					opponentTeam={opponentTeam}
					formSummary={formSummary}
					fixtures={fixtures}
				/>
			</PopoverContent>
		</Popover>
	)
}
