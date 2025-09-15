'use client'

import { useEffect, useState } from 'react'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import type { Fixtures, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/generateFixtureMatrix'
import { getDifficultyUI, getOpponentTeam, getFormSummary } from '@/lib/fixtureGridUtils'
import { cn } from '@/lib/utils'

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
					className={cn(
						'group/chip flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md',
						'px-1.5 py-1 sm:px-3 sm:py-2',
						'text-xs sm:text-sm',
						'transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md hover:shadow-black/10',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
						getDifficultyUI(fixture.difficulty, difficultyType).bg,
					)}
				>
					<div className='flex flex-col items-center leading-tight sm:flex-row sm:items-center sm:gap-1'>
						<span className='font-medium text-black dark:text-white'>
							{fixture.label}
						</span>

						<span className='mt-0.5 font-mono text-[11px] tabular-nums text-black/60 dark:text-white/60 sm:ml-1 sm:mt-0'>
							(
							{difficultyType === 'FPL'
								? fixture.difficulty
								: fixture.difficulty.toFixed(2)}
							)
						</span>
					</div>

					{typeof fixture.attractivenessScore === 'number' &&
						fixture.attractivenessScore > 0 && (
							<span className='ml-1 hidden text-xs text-blue-600 dark:text-blue-400 sm:inline'>
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
