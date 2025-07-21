'use client'

import { FixtureGrid } from '@/components/FixtureGrid'
import { GameweekSelector } from '@/components/GameweekSelector'
import { DifficultySelector } from '@/components/DifficultySelector'
import { TeamFilter } from '@/components/TeamFilter' // Import the new component
import { useFplTable } from '@/hooks/useFplTable'
import type { BootstrapData, Fixtures } from '@/types/fpl'

type FixtureGridPageProps = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

export const FixtureGridPage = ({ bootstrapData, fixtures }: FixtureGridPageProps) => {
	const {
		teams,
		events,
		firstGameweek,
		numberOfGameweeks,
		setNumberOfGameweeks,
		gameweekOptions,
		sortedData,
		sortConfig,
		handleSort,
		difficultyType,
		setDifficultyType,
		selectedTeams,
		setSelectedTeams,
	} = useFplTable(bootstrapData, fixtures)

	return (
		<main className='container mx-auto p-4'>
			<div className='mb-4 mt-8 flex flex-wrap items-end justify-between gap-4'>
				<h1 className='text-2xl font-bold'>Fixture Difficulty</h1>
				<div className='flex flex-wrap items-end gap-4'>
					<TeamFilter
						teams={teams}
						selectedTeams={selectedTeams}
						onSelectionChange={setSelectedTeams}
					/>
					<DifficultySelector
						difficultyType={difficultyType}
						setDifficultyType={setDifficultyType}
					/>
					<GameweekSelector
						numberOfGameweeks={numberOfGameweeks}
						setNumberOfGameweeks={setNumberOfGameweeks}
						gameweekOptions={gameweekOptions}
					/>
				</div>
			</div>

			<FixtureGrid
				data={sortedData}
				events={events}
				firstGameweek={firstGameweek}
				numberOfGameweeks={numberOfGameweeks}
				onSort={handleSort}
				sortConfig={sortConfig}
				difficultyType={difficultyType}
			/>
		</main>
	)
}
