'use client'

import * as React from 'react'

import type { ReactNode } from 'react'

import { SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
} from '@/components/ui/sheet'
import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'
import type { Team } from '@/types/fpl'

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
	/** Optional element rendered right-aligned on the desktop controls row */
	rightSlot?: ReactNode
	/** Optional element rendered below the button row inside the mobile sticky bar */
	mobileLegend?: ReactNode
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
	rightSlot,
	mobileLegend,
}: FixtureControlsProps) => {
	const diffShort =
		difficultyType === 'FPL'
			? 'FPL'
			: difficultyType === 'Overall'
				? 'Ovr'
				: difficultyType === 'Attack'
					? 'Att'
					: 'Def'
	return (
		<>
		<div className='-mx-4 border-b bg-background/80 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden'>
			<div className='flex w-full items-center justify-between'>
				<div className='[&>div>label]:sr-only'>
					<ViewToggle view={view} onViewChange={onViewChange} />
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline' size='sm' className='shrink-0'>
							<SlidersHorizontal className='mr-2 h-4 w-4' />
							{`Filters · ${diffShort} · ${numberOfGameweeks} GW`}
						</Button>
					</SheetTrigger>

						<SheetContent
							side='bottom'
							className='h-auto max-h-[85vh] overflow-auto pb-[env(safe-area-inset-bottom)] data-[state=closed]:animate-slideOutDown data-[state=open]:animate-slideInUp'
						>
							<SheetHeader>
								<SheetTitle>Filters</SheetTitle>
							</SheetHeader>

							<div className='mt-4 grid gap-4'>
								<TeamFilter
									teams={teams}
									selectedTeams={selectedTeams}
									onSelectionChange={onSelectionChange}
									maxTeams={maxTeams}
								/>
								<DifficultySelector
									difficultyType={difficultyType}
									setDifficultyType={onDifficultyTypeChange}
								/>
								<GameweekSelector
									numberOfGameweeks={numberOfGameweeks}
									setNumberOfGameweeks={onNumberOfGameweeksChange}
									gameweekOptions={gameweekOptions}
								/>
							</div>

							<SheetFooter className='mt-6' />
						</SheetContent>
				</Sheet>
			</div>
			{mobileLegend && <div className='mt-1.5 pb-0.5'>{mobileLegend}</div>}
		</div>

	<div className='hidden shrink-0 sm:flex sm:items-end sm:justify-between sm:gap-6'>
			<div className='flex flex-wrap items-end gap-4'>
				<ViewToggle view={view} onViewChange={onViewChange} />
				<TeamFilter
					teams={teams}
					selectedTeams={selectedTeams}
					onSelectionChange={onSelectionChange}
					maxTeams={maxTeams}
				/>
				<DifficultySelector
					difficultyType={difficultyType}
					setDifficultyType={onDifficultyTypeChange}
				/>
				<GameweekSelector
					numberOfGameweeks={numberOfGameweeks}
					setNumberOfGameweeks={onNumberOfGameweeksChange}
					gameweekOptions={gameweekOptions}
				/>
			</div>
			{rightSlot && <div className='shrink-0 self-end pb-0.5'>{rightSlot}</div>}
		</div>
		</>
	)
}
