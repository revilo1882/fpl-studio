'use client'

import { useState } from 'react'

import dynamic from 'next/dynamic'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import type { DifficultyType, FixtureCell } from '@/lib/fixtures/generateFixtureMatrix'
import { useFplTable } from '@/hooks/useFplTable'
import { useQuerySync } from '@/hooks/useQuerySync'

import { FixtureGrid } from './FixtureGrid'
import { FixturePageHeader } from './FixturePageHeader'
import { FixtureControls } from './FixtureControls'
import { DifficultyLegend } from './DifficultyLegend'
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
		setSortConfig,
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
		setSortConfig,
	})

	const selectionCount = selectedTeams.length
	const isChart = view === 'chart'
	const isChartEmpty = isChart && selectionCount === 0
	const isChartTooMany = isChart && selectionCount > MAX_CHART_TEAMS
	const canShowChart = isChart && !isChartEmpty && !isChartTooMany && !!fixtureData

	return (
		<section className='container mx-auto flex h-full min-w-0 flex-col px-4 sm:px-4'>
			{/* Desktop: title sits above filter bar */}
			<div className='hidden shrink-0 pb-1 pt-3 lg:block'>
				<FixturePageHeader
					title='Fixture Difficulty'
					subtitle='Analyse upcoming fixtures with Studio FDR ratings'
					className='mb-1 sm:mb-0'
				/>
			</div>

			{/* Filter bar — always visible, never scrolls */}
			<div className='sticky left-0 top-0 z-50 -mx-4 shrink-0 border-b border-border/60 bg-background/95 px-4 py-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:mx-0 sm:px-0 sm:py-2'>
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

			{/* Single scroll container — handles both X and Y.
			    On mobile the title lives inside so it can scroll away; on desktop it's above. */}
			<div className='-mx-4 flex min-h-0 flex-1 flex-col overflow-auto sm:mx-0'>
				{/* Mobile-only title — scrolls away vertically, anchored left via sticky */}
				<div className='sticky left-0 z-10 shrink-0 bg-background px-4 pb-1 pt-3 sm:px-0 lg:hidden'>
					<FixturePageHeader
						title='Fixture Difficulty'
						subtitle='Analyse upcoming fixtures with Studio FDR ratings'
						className='mb-1 sm:mb-0'
					/>
				</div>

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
					<div className='flex-1 px-4 pb-4 sm:px-0'>
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

			{/* Legend outside scroll container — content can never scroll over it */}
			{view === 'grid' && (
				<div className='-mx-4 shrink-0 bg-background px-4 pb-3 pt-2 sm:mx-0 sm:px-0'>
					<DifficultyLegend difficultyType={difficultyType} />
				</div>
			)}
		</section>
	)
}

export default FixtureDifficultyPage
