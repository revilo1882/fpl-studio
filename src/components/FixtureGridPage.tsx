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

type FixtureGridPageProps = {
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

const FixtureGridPage = ({ bootstrapData, fixtures }: FixtureGridPageProps) => {
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
		<section className='container mx-auto grid h-[100dvh] grid-rows-[auto_auto_1fr] gap-6 px-4 py-6'>
			<FixturePageHeader
				title='Fixture Difficulty'
				subtitle='Analyse upcoming fixtures with Studio FDR ratings'
			/>

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

			{/* Grid View */}
			{view === 'grid' && (
				<div className='min-h-0 overflow-auto'>
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
				</div>
			)}

			{/* Chart View */}
			{canShowChart && (
				<div className='h-full min-h-0 overflow-auto'>
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

			{/* Empty State */}
			{isChartEmpty && (
				<div className='flex min-h-0 flex-col'>
					<ChartEmptyState />
				</div>
			)}

			{/* Too Many Teams */}
			{isChartTooMany && (
				<div className='flex min-h-0 flex-col'>
					<ChartTooManyTeams
						selectedCount={selectionCount}
						maxTeams={MAX_CHART_TEAMS}
						onClearTeams={() => setSelectedTeams([])}
					/>
				</div>
			)}

			{/* Loading State */}
			{isLoading && isChart && !fixtureData && (
				<div className='h-96 w-full animate-pulse rounded-md bg-muted' />
			)}
		</section>
	)
}

export default FixtureGridPage
