'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import type { DifficultyType, FixtureCell } from '@/lib/generateFixtureMatrix'
import { useFplTable } from '@/hooks/useFplTable'
import { useQuerySync } from '@/hooks/useQuerySync'

import { FixtureGrid } from './FixtureGrid'
import { FixturePageHeader } from './FixturePageHeader'
import { FixtureControls } from './FixtureControls'
import { ChartEmptyState } from './ChartEmptyState'
import { ChartTooManyTeams } from './ChartTooManyTeams'
import type { FixtureAttractivenessChartProps } from './FixtureAttractivenessChart'

export type ViewMode = 'grid' | 'chart'

type FixtureDifficultyPageProps = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

const MAX_CHART_TEAMS = 5

const FixtureAttractivenessChart = dynamic<FixtureAttractivenessChartProps>(
	() => import('./FixtureAttractivenessChart').then((m) => m.FixtureAttractivenessChart),
	{
		ssr: false,
		loading: () => <div className='h-96 w-full animate-pulse rounded-md bg-muted' />,
	},
)

const FixtureDifficultyPage = ({ bootstrapData, fixtures }: FixtureDifficultyPageProps) => {
	const events = bootstrapData.events ?? []
	const teams = bootstrapData.teams ?? []

	const nextEvent = events.find((event) => event.is_next)
	const currentEvent = events.find((event) => event.is_current)

	const initialFirstGameweek = nextEvent?.id ?? currentEvent?.id ?? events[0]?.id ?? 1
	const remainingFromFirst = Math.max(0, events.length - (initialFirstGameweek - 1))
	const initialNumberOfGameweeks = Math.min(6, Math.max(1, remainingFromFirst))
	const initialDifficultyType: DifficultyType = 'Overall'

	const { state, actions, data } = useFplTable({
		bootstrapData,
		fixtures,
		initialFirstGameweek,
		initialNumberOfGameweeks,
		initialDifficultyType,
	})

	const { firstGameweek, numberOfGameweeks, difficultyType, selectedTeams, sortConfig } = state
	const {
		setNumberOfGameweeks,
		setDifficultyType,
		setFirstGameweek,
		setSelectedTeams,
		handleSort,
	} = actions
	const { gameweekOptions, sortedData, fixtureData, isLoading, sortedTeams, teamAverageByName } =
		data

	const [view, setView] = useState<ViewMode>('grid')

	useQuerySync({
		view,
		selectedTeams,
		difficultyType,
		firstGameweek,
		numberOfGameweeks,
		sortKey: sortConfig.key,
		sortDirection: sortConfig.direction,
		setView,
		setSelectedTeams,
		setDifficultyType,
		setFirstGameweek,
		setNumberOfGameweeks,
		setSortKey: (key) => handleSort(key),
	})

	const selectionCount = selectedTeams.length
	const isChart = view === 'chart'
	const isChartEmpty = isChart && selectionCount === 0
	const isChartTooMany = isChart && selectionCount > MAX_CHART_TEAMS
	const canShowChart = isChart && !isChartEmpty && !isChartTooMany && !!fixtureData

	return (
		<section className='container mx-auto flex h-[100dvh] flex-col gap-4 px-4 py-6 sm:gap-6'>
			<div className='shrink-0'>
				<FixturePageHeader
					title='Fixture Difficulty'
					subtitle='Analyse upcoming fixtures with Studio FDR ratings'
					className='mb-2 sm:mb-0'
				/>
			</div>

			<div className='shrink-0'>
				<FixtureControls
					view={view}
					onViewChange={setView}
					teams={teams}
					selectedTeams={selectedTeams}
					onSelectionChange={setSelectedTeams}
					maxTeams={isChart ? MAX_CHART_TEAMS : undefined}
					difficultyType={difficultyType}
					onDifficultyTypeChange={setDifficultyType}
					numberOfGameweeks={numberOfGameweeks}
					onNumberOfGameweeksChange={setNumberOfGameweeks}
					gameweekOptions={gameweekOptions}
				/>
			</div>

			<div className='min-h-0 flex-1'>
				{view === 'grid' && (
					<FixtureGrid
						data={sortedData}
						events={events}
						teams={teams}
						firstGameweek={firstGameweek}
						numberOfGameweeks={numberOfGameweeks}
						onSort={handleSort}
						sortConfig={sortConfig}
						difficultyType={difficultyType}
						allFixtures={fixtures}
					/>
				)}

				{canShowChart && (
					<div className='h-full'>
						<FixtureAttractivenessChart
							gameweekAttractivenessMatrix={fixtureData!.gameweekAttractivenessMatrix}
							fixtureMatrix={fixtureData!.fixtureMatrix as FixtureCell[][]}
							teamNames={fixtureData!.teamNames}
							selectedTeams={selectedTeams}
							firstGameweek={firstGameweek}
							numberOfGameweeks={numberOfGameweeks}
							difficultyType={difficultyType}
							teams={teams}
							sortedTeams={sortedTeams}
							teamAverageByName={teamAverageByName}
						/>
					</div>
				)}

				{isChartEmpty && <ChartEmptyState />}

				{isChartTooMany && (
					<ChartTooManyTeams
						selectedCount={selectionCount}
						maxTeams={MAX_CHART_TEAMS}
						onClearTeams={() => setSelectedTeams([])}
					/>
				)}

				{isLoading && isChart && !fixtureData && (
					<div className='h-96 w-full animate-pulse rounded-md bg-muted' />
				)}
			</div>
		</section>
	)
}

export default FixtureDifficultyPage
