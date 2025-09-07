'use client'

import type { Team } from '@/types/fpl'
import type { DifficultyType } from '@/lib/generateFixtureMatrix'
import { ViewToggle } from '@/components/ViewToggle'
import { TeamFilter } from '@/components/TeamFilter'
import { DifficultySelector } from '@/components/DifficultySelector'
import { GameweekSelector } from '@/components/GameweekSelector'

import { type ViewMode } from './FixtureGridPage'

type FixtureControlsProps = {
	view: ViewMode
	onViewChange: (view: ViewMode) => void
	teams: Team[]
	selectedTeams: string[]
	onSelectionChange: (teams: string[]) => void
	maxTeams?: number
	difficultyType: DifficultyType
	onDifficultyTypeChange: (d: DifficultyType) => void
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
		<div className='flex flex-wrap items-end gap-6'>
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
	)
}
