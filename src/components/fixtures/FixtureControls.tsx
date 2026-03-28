'use client'

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
	return (
		<div className='-mx-4 shrink-0 border-b border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none'>
			<div
				className='flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin] sm:gap-3'
				role='toolbar'
				aria-label='Fixture filters'
			>
				<ViewToggle compact view={view} onViewChange={onViewChange} />
				<TeamFilter
					compact
					teams={teams}
					selectedTeams={selectedTeams}
					onSelectionChange={onSelectionChange}
					maxTeams={maxTeams}
				/>
				<DifficultySelector
					compact
					difficultyType={difficultyType}
					setDifficultyType={onDifficultyTypeChange}
				/>
				<GameweekSelector
					compact
					numberOfGameweeks={numberOfGameweeks}
					setNumberOfGameweeks={onNumberOfGameweeksChange}
					gameweekOptions={gameweekOptions}
				/>
			</div>
		</div>
	)
}
