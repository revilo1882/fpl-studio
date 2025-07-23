'use client'

import Image from 'next/image'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/generateFixtureMatrix'
import {
	getDifficultyUI,
	getDifficultyName,
	getOpponentTeam,
	getFormIndicator,
} from '@/lib/fixtureGridUtils'
import { getTeamBadgeUrl } from '@/lib/utils'

type FixtureChipProps = {
	fixture: SingleFixture
	teams: Team[]
	difficultyType: DifficultyType
}

export const FixtureChip = ({ fixture, teams, difficultyType }: FixtureChipProps) => {
	const opponentTeam = getOpponentTeam(fixture.opponentName, teams)
	const formData = opponentTeam ? getFormIndicator(opponentTeam.form || '0') : null

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div
					className={`group/chip flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-2 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] active:transition-none ${getDifficultyUI(fixture.difficulty, difficultyType).bg} `}
				>
					<span className='text-sm font-medium text-black dark:text-white'>
						{fixture.label}
					</span>
					<span className='ml-1.5 inline-block w-[5ch] text-left font-mono text-xs tabular-nums text-black/60 dark:text-white/60'>
						(
						{difficultyType === 'fpl'
							? fixture.difficulty
							: fixture.difficulty.toFixed(2)}
						)
					</span>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className='w-auto border p-4 text-sm shadow-lg'
				side='top'
				align='center'
			>
				<div className='grid gap-3'>
					<div className='relative border-b border-border pb-3'>
						<div className='flex items-start justify-between gap-3'>
							<div className='flex-1'>
								<h4 className='text-base font-bold text-foreground'>
									{fixture.opponentName}
								</h4>
								<p className='text-sm font-medium text-muted-foreground'>
									{fixture.label.slice(-4)}
								</p>
							</div>
							{opponentTeam && (
								<div className='relative h-8 w-8 flex-shrink-0'>
									<Image
										src={
											getTeamBadgeUrl(opponentTeam.code) || '/placeholder.svg'
										}
										alt={`${fixture.opponentName} badge`}
										width={32}
										height={32}
										className='object-contain'
										unoptimized // Since these are external images from Premier League
										onError={(e) => {
											// Hide image container if it fails to load
											const container = e.currentTarget.parentElement
											if (container) container.style.display = 'none'
										}}
									/>
								</div>
							)}
						</div>
					</div>

					<div className='grid gap-2'>
						<div className='flex items-center justify-between'>
							<span className='font-medium text-muted-foreground'>
								{getDifficultyName(difficultyType)}:
							</span>
							<span className='font-bold tabular-nums text-foreground'>
								{fixture.difficulty.toFixed(2)}
							</span>
						</div>

						{opponentTeam && (
							<div className='flex items-center justify-between'>
								<span className='font-medium text-muted-foreground'>Form:</span>
								<div className='text-right'>
									<span className={`font-bold tabular-nums ${formData?.color}`}>
										{!opponentTeam.form ||
										opponentTeam.form === '0' ||
										opponentTeam.form === '0.0'
											? 'N/A'
											: opponentTeam.form}
									</span>
									<span className={`ml-1 text-xs ${formData?.color}`}>
										({formData?.label})
									</span>
								</div>
							</div>
						)}

						{fixture.kickoffTime && (
							<div className='flex items-center justify-between'>
								<span className='pr-2 font-medium text-muted-foreground'>
									Kickoff:
								</span>
								<span className='text-right font-medium text-foreground'>
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
				</div>
			</PopoverContent>
		</Popover>
	)
}
