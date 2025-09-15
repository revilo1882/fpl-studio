'use client'

import * as React from 'react'

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
import type { DifficultyType } from '@/lib/generateFixtureMatrix'
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
			<div className='sticky top-0 z-30 -mx-4 border-b bg-background/80 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden'>
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
			</div>

			<div className='hidden sm:flex sm:flex-wrap sm:items-end sm:gap-6'>
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
			</div>
		</>
	)
}
