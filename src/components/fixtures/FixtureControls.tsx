'use client'

import type { ReactNode } from 'react'

import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'
import type { Team } from '@/types/fpl'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { type View, ViewToggle } from './ViewToggle'
import { TeamFilter } from './TeamFilter'
import { DifficultySelector } from './DifficultySelector'
import { GameweekSelector } from './GameweekSelector'

type FixtureControlsProps = {
	view: View
	onViewChange: (v: View) => void

	teams: Team[]
	selectedTeams: string[]
	onSelectionChange: (selected: string[]) => void
	maxTeams?: number

	difficultyType: DifficultyType
	onDifficultyTypeChange: (t: DifficultyType) => void

	numberOfGameweeks: number
	onNumberOfGameweeksChange: (n: number) => void
	gameweekOptions: number[]
	/** Placed first in the toolbar (e.g. Matches / Difficulty tabs). */
	prependSlot?: ReactNode
	/** `schedule` — round dropdown + rating (prev/next live in the schedule panel). `full` — grid/chart filters. */
	variant?: 'full' | 'schedule'
	/** Current round (1-based), total rounds, and change handler — used when `variant` is `schedule`. */
	scheduleRoundId?: number
	scheduleRoundMax?: number
	onScheduleRoundChange?: (roundId: number) => void
	/** Extra classes on the outer wrapper (e.g. when chrome is provided by a sticky parent) */
	className?: string
}

export const FixtureControls = ({
	view,
	onViewChange,
	teams,
	selectedTeams,
	onSelectionChange,
	maxTeams,
	difficultyType,
	onDifficultyTypeChange,
	numberOfGameweeks,
	onNumberOfGameweeksChange,
	gameweekOptions,
	prependSlot,
	variant = 'full',
	scheduleRoundId,
	scheduleRoundMax,
	onScheduleRoundChange,
	className,
}: FixtureControlsProps) => {
	const isSchedule = variant === 'schedule'
	const sr = scheduleRoundId ?? 1
	const smax = scheduleRoundMax ?? 1

	return (
		<div className={cn('shrink-0', className)}>
			<div
				className={cn(
					'flex flex-nowrap items-center overflow-x-auto pb-0.5 [scrollbar-width:thin]',
					isSchedule ? 'gap-4 sm:gap-5' : 'gap-2 sm:gap-3',
				)}
				role='toolbar'
				aria-label='Fixture filters'
			>
				{prependSlot}
				{isSchedule && onScheduleRoundChange ? (
					<div className='flex shrink-0 flex-row items-center gap-2'>
						<Label
							htmlFor='fixtures-schedule-gw'
							className='shrink-0 whitespace-nowrap text-xs text-muted-foreground'
						>
							GW
						</Label>
						<Select value={String(sr)} onValueChange={(v) => onScheduleRoundChange(Number(v))}>
							<SelectTrigger
								id='fixtures-schedule-gw'
								aria-label='Gameweek'
								className='h-9 w-auto min-w-[5.25rem] shrink-0 tabular-nums focus:ring-0 data-[state=open]:border-primary/70 data-[state=open]:text-primary sm:min-w-[5.5rem]'
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: smax }, (_, i) => i + 1).map((id) => (
									<SelectItem key={id} value={String(id)}>
										GW {id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				) : null}
				{!isSchedule && (
					<>
						<ViewToggle compact view={view} onViewChange={onViewChange} />
						<TeamFilter
							compact
							teams={teams}
							selectedTeams={selectedTeams}
							onSelectionChange={onSelectionChange}
							maxTeams={maxTeams}
						/>
					</>
				)}
				<div className={cn('min-w-0', isSchedule && 'shrink-0 pl-1 sm:pl-2')}>
					<DifficultySelector
						compact
						difficultyType={difficultyType}
						setDifficultyType={onDifficultyTypeChange}
					/>
				</div>
				{!isSchedule && (
					<GameweekSelector
						compact
						numberOfGameweeks={numberOfGameweeks}
						setNumberOfGameweeks={onNumberOfGameweeksChange}
						gameweekOptions={gameweekOptions}
					/>
				)}
			</div>
		</div>
	)
}
