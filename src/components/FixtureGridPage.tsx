'use client'

import { FixtureGrid } from '@/components/FixtureGrid'
import { GameweekSelector } from '@/components/GameweekSelector'
import { DifficultySelector } from '@/components/DifficultySelector'
import { useFplTable } from '@/hooks/useFplTable'
import type { BootstrapData, Fixtures } from '@/types/fpl'
type FixtureGridPageProps = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

export const FixtureGridPage = ({ bootstrapData, fixtures }: FixtureGridPageProps) => {
	const {
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
	} = useFplTable(bootstrapData, fixtures)

	return (
		<main className='p-4'>
			<div className='mb-4 mt-8 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Fixture Difficulty</h1>
				<div className='flex items-end gap-4'>
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
