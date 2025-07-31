'use client'

import { useEffect, useState, useRef } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import type { Fixtures, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/generateFixtureMatrix'
import {
	getDifficultyUI,
	getDifficultyName,
	getOpponentTeam,
	getFormSummary,
} from '@/lib/fixtureGridUtils'
import { getTeamBadgeUrl } from '@/lib/utils'

type FixtureChipProps = {
	fixture: SingleFixture
	teams: Team[]
	difficultyType: DifficultyType
	fixtures: Fixtures
}

export const FixtureChip = ({ fixture, teams, difficultyType, fixtures }: FixtureChipProps) => {
	const opponentTeam = getOpponentTeam(fixture.opponentName, teams)
	const [formSummary, setFormSummary] = useState<string>('Loading...')
	const [showPopover, setShowPopover] = useState(false)
	const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
	const chipRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (opponentTeam) {
			const summary = getFormSummary(opponentTeam.id, fixtures)
			setFormSummary(summary)
		} else {
			setFormSummary('N/A')
		}
	}, [opponentTeam, fixtures])

	const handleClick = () => {
		if (chipRef.current) {
			const rect = chipRef.current.getBoundingClientRect()
			setPopoverPosition({
				top: rect.top - 10,
				left: rect.left + rect.width / 2,
			})
		}
		setShowPopover(!showPopover)
	}

	const PopoverContent = () => (
		<div className='fixed inset-0 z-[9999]'>
			<div className='absolute inset-0' onClick={() => setShowPopover(false)} />
			<div
				className='absolute w-64 -translate-x-1/2 -translate-y-full transform rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-lg'
				style={{
					top: popoverPosition.top,
					left: popoverPosition.left,
				}}
			>
				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							{opponentTeam && (
								<Image
									src={getTeamBadgeUrl(opponentTeam.code) || '/placeholder.svg'}
									alt={`${fixture.opponentName} badge`}
									width={20}
									height={20}
									className='object-contain'
									unoptimized
									onError={(e) => {
										const container = e.currentTarget.parentElement
										if (container) container.style.display = 'none'
									}}
								/>
							)}
							<span className='font-semibold text-foreground'>
								{fixture.opponentName}
							</span>
						</div>
						<span className='text-xs text-muted-foreground'>
							{fixture.label.slice(-4)}
						</span>
					</div>

					<div className='grid grid-cols-2 gap-x-3 gap-y-1 text-xs'>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>
								{getDifficultyName(difficultyType)}:
							</span>
							<span className='font-semibold tabular-nums'>
								{fixture.difficulty.toFixed(2)}
							</span>
						</div>

						{opponentTeam && (
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>Form:</span>
								<span className='font-mono'>{formSummary}</span>
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

					{fixture.confidenceInterval && fixture.confidenceScore !== undefined && (
						<div className='space-y-2 border-t pt-2'>
							<div className='flex items-center justify-between text-xs'>
								<span className='text-muted-foreground'>Confidence:</span>
								<span className='font-semibold'>
									{(fixture.confidenceScore * 100).toFixed(0)}%
								</span>
							</div>
							<div className='text-xs text-muted-foreground'>
								<div>
									Range: {fixture.confidenceInterval[0].toFixed(1)} -{' '}
									{fixture.confidenceInterval[1].toFixed(1)}
								</div>
								<div className='mt-1'>
									{fixture.confidenceScore >= 0.8
										? 'High confidence - trust this rating'
										: fixture.confidenceScore >= 0.5
											? 'Moderate confidence - watch for changes'
											: 'Low confidence - high uncertainty'}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)

	return (
		<>
			<div
				ref={chipRef}
				className={`group/chip flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-2 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] active:transition-none ${getDifficultyUI(fixture.difficulty, difficultyType).bg}`}
				onClick={handleClick}
			>
				<span className='text-sm font-medium text-black dark:text-white'>
					{fixture.label}
				</span>
				<span className='ml-1.5 inline-block w-[5ch] text-left font-mono text-xs tabular-nums text-black/60 dark:text-white/60'>
					({difficultyType === 'fpl' ? fixture.difficulty : fixture.difficulty.toFixed(2)}
					)
				</span>
			</div>

			{showPopover &&
				typeof window !== 'undefined' &&
				createPortal(<PopoverContent />, document.body)}
		</>
	)
}
