'use client'

import { useEffect, useRef, useState } from 'react'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import type { Fixtures, Team } from '@/types/fpl'
import type { DifficultyType, SingleFixture } from '@/lib/fixtures/generateFixtureMatrix'
import { getDifficultyUI, getOpponentTeam, getFormSummary } from '@/lib/fixtures/fixtureGridUtils'
import { cn } from '@/lib/utils'

import { FixtureChipPopoverContent } from './FixtureChipPopoverContent'

type FixtureChipProps = {
	fixture: SingleFixture
	teams: Team[]
	difficultyType: DifficultyType
	fixtures: Fixtures
	/** Compact mode: shows only the FDR score as an inline pill (no opponent label). Hover popover still works. */
	compact?: boolean
}

export const FixtureChip = ({ fixture, teams, difficultyType, fixtures, compact = false }: FixtureChipProps) => {
	const opponentTeam = getOpponentTeam(fixture.opponentName, teams)
	const [formSummary, setFormSummary] = useState<string>('Loading...')
	const [open, setOpen] = useState(false)
	const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const mountedAt = useRef(Date.now())

	useEffect(() => {
		if (opponentTeam) setFormSummary(getFormSummary(opponentTeam.id, fixtures))
		else setFormSummary('N/A')
	}, [opponentTeam, fixtures])

	useEffect(() => () => {
		if (openTimer.current) clearTimeout(openTimer.current)
		if (closeTimer.current) clearTimeout(closeTimer.current)
	}, [])

	const openPopover = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current)
		openTimer.current = setTimeout(() => setOpen(true), 300)
	}
	const scheduleClose = () => {
		if (openTimer.current) clearTimeout(openTimer.current)
		closeTimer.current = setTimeout(() => setOpen(false), 150)
	}

	const handleOpenChange = (isOpen: boolean) => {
		// Ignore the ghost tap that fires when navigating to this page on touch devices
		if (isOpen && Date.now() - mountedAt.current < 400) return
		setOpen(isOpen)
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
			{compact ? (
				/* Compact pill — opponent label + score stacked, narrower than full chip */
				<div
					role='button'
					aria-label='Show fixture details'
					onPointerEnter={(e) => { if (e.pointerType === 'mouse') openPopover() }}
					onPointerLeave={(e) => { if (e.pointerType === 'mouse') scheduleClose() }}
					className={cn(
						'flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md',
						'px-1 sm:px-2',
						'transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:shadow-black/10',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
						getDifficultyUI(fixture.difficulty, difficultyType).bg,
					)}
				>
					<span className='whitespace-nowrap text-xs font-medium leading-tight text-black dark:text-white'>
						{fixture.label}
					</span>
					<span className='font-mono text-[10px] tabular-nums text-black/60 dark:text-white/60'>
						{difficultyType === 'FPL'
							? fixture.difficulty
							: fixture.difficulty.toFixed(2)}
					</span>
				</div>
				) : (
					/* Full chip — opponent label + score */
					<div
						role='button'
						aria-label='Show fixture details'
						onPointerEnter={(e) => { if (e.pointerType === 'mouse') openPopover() }}
						onPointerLeave={(e) => { if (e.pointerType === 'mouse') scheduleClose() }}
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
				)}
			</PopoverTrigger>

		<PopoverContent
			side='top'
			align='center'
			sideOffset={8}
			avoidCollisions
			collisionPadding={8}
			className='w-64 rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-lg'
			// Keep open while mouse is over the content panel
			onPointerEnter={(e) => { if (e.pointerType === 'mouse') openPopover() }}
			onPointerLeave={(e) => { if (e.pointerType === 'mouse') scheduleClose() }}
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
