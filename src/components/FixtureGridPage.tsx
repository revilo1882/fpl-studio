'use client'

import { FixtureGrid } from '@/components/FixtureGrid'
import { GameweekSelector } from '@/components/GameweekSelector'
import { DifficultySelector } from '@/components/DifficultySelector'
import { TeamFilter } from '@/components/TeamFilter'
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
		<main className='container mx-auto px-4 py-6'>
			<div className='mb-8'>
				<div className='mb-6'>
					<h1 className='mb-2 text-3xl font-bold tracking-tight text-foreground'>
						Fixture Difficulty
					</h1>
					<p className='text-lg text-muted-foreground'>
						Analyze upcoming fixtures with Studio FDR ratings
					</p>
				</div>

				<div className='flex flex-wrap items-end gap-6'>
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
			</div>

			<div className='rounded-lg border bg-card shadow-sm'>
				<FixtureGrid
					data={sortedData}
					events={events}
					teams={teams}
					firstGameweek={firstGameweek}
					numberOfGameweeks={numberOfGameweeks}
					onSort={handleSort}
					sortConfig={sortConfig}
					difficultyType={difficultyType}
				/>
			</div>
		</main>
	)
}
