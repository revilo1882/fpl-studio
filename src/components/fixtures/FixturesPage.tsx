'use client'

import { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import type { DifficultyType, FixtureCell } from '@/lib/fixtures/generateFixtureMatrix'
import {
	clampGameweekId,
	getDefaultScheduleGameweek,
	type FixturesMainTab,
} from '@/lib/fixtures/scheduleFixtures'
import { useFplTable } from '@/hooks/useFplTable'
import { useFixturesQuerySync } from '@/hooks/useFixturesQuerySync'
import type { FixtureGridSortConfig, FixtureGridSortKey } from '@/hooks/useDifficultyFilters'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { FixtureGrid } from './FixtureGrid'
import { FixtureGridSkeleton } from './FixtureGridSkeleton'
import { FixturePageHeader } from './FixturePageHeader'
import { FixtureControls } from './FixtureControls'
import { DifficultyLegend } from './DifficultyLegend'
import { ChartEmptyState } from './ChartEmptyState'
import { ChartTooManyTeams } from './ChartTooManyTeams'
import type { FixtureAttractivenessChartProps } from './FixtureAttractivenessChart'
import { FixtureSchedulePanel } from './FixtureSchedulePanel'

export type ViewMode = 'grid' | 'chart'

type FixturesPageProps = {
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

/** Static tab selector — values never change so this can live outside the component. */
const MainTabSelector = (
	<TabsList className='grid h-9 w-full max-w-[220px] shrink-0 grid-cols-2 gap-0.5 p-0.5 sm:max-w-[260px]'>
		<TabsTrigger value='difficulty' className='px-2 text-xs sm:text-sm'>
			Difficulty
		</TabsTrigger>
		<TabsTrigger value='schedule' className='px-2 text-xs sm:text-sm'>
			Schedule
		</TabsTrigger>
	</TabsList>
)

// ─── Difficulty tab content ───────────────────────────────────────────────────

type DifficultyContentProps = {
	view: ViewMode
	isLoading: boolean
	numberOfGameweeks: number
	firstGameweek: number
	difficultyType: DifficultyType
	selectedTeams: string[]
	sortConfig: FixtureGridSortConfig
	sortedData: ReturnType<typeof useFplTable>['data']['sortedData']
	sortedTeams: string[]
	teamAverageByName: Record<string, number>
	fixtureData: ReturnType<typeof useFplTable>['data']['fixtureData']
	fixtures: Fixtures
	events: BootstrapData['events']
	teams: BootstrapData['teams']
	onSort: (key: FixtureGridSortKey) => void
	onClearTeams: () => void
}

const DifficultyContent = ({
	view,
	isLoading,
	numberOfGameweeks,
	firstGameweek,
	difficultyType,
	selectedTeams,
	sortConfig,
	sortedData,
	sortedTeams,
	teamAverageByName,
	fixtureData,
	fixtures,
	events,
	teams,
	onSort,
	onClearTeams,
}: DifficultyContentProps) => {
	const selectionCount = selectedTeams.length
	const isChart = view === 'chart'
	const isChartEmpty = isChart && selectionCount === 0
	const isChartTooMany = isChart && selectionCount > MAX_CHART_TEAMS
	const canShowChart = isChart && !isChartEmpty && !isChartTooMany && !!fixtureData

	return (
		<>
			{view === 'grid' && isLoading && (
				<FixtureGridSkeleton numberOfGameweeks={numberOfGameweeks} />
			)}

			{view === 'grid' && !isLoading && (
				<FixtureGrid
					data={sortedData}
					events={events}
					teams={teams}
					firstGameweek={firstGameweek}
					numberOfGameweeks={numberOfGameweeks}
					onSort={onSort}
					sortConfig={sortConfig}
					difficultyType={difficultyType}
					allFixtures={fixtures}
				/>
			)}

			{view === 'grid' && (
				<div className='sticky bottom-0 z-30 -mt-px h-px w-full shrink-0 bg-border' />
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
					onClearTeams={onClearTeams}
				/>
			)}

			{isLoading && isChart && !fixtureData && (
				<div className='h-96 w-full animate-pulse rounded-md bg-muted' />
			)}
		</>
	)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_COPY = {
	schedule: {
		title: 'Fixtures & results',
		subtitle: 'Premier League schedule and scores by gameweek',
	},
	difficulty: {
		title: 'Fixture difficulty',
		subtitle: 'Analyse upcoming fixtures with Studio FDR ratings',
	},
} satisfies Record<FixturesMainTab, { title: string; subtitle: string }>

const FixturesPage = ({ bootstrapData, fixtures }: FixturesPageProps) => {
	const events = bootstrapData.events ?? []
	const teams = bootstrapData.teams ?? []
	const maxGw = events.length

	const defaultScheduleGw = useMemo(() => getDefaultScheduleGameweek(events), [events])

	const [mainTab, setMainTab] = useState<FixturesMainTab>('difficulty')
	const [scheduleGw, setScheduleGw] = useState(defaultScheduleGw)
	const [view, setView] = useState<ViewMode>('grid')

	useEffect(() => {
		setScheduleGw((g) => clampGameweekId(g, maxGw))
	}, [maxGw])

	const nextEvent = events.find((e) => e.is_next)
	const currentEvent = events.find((e) => e.is_current)
	const initialFirstGameweek = nextEvent?.id ?? currentEvent?.id ?? events[0]?.id ?? 1
	const remainingFromFirst = Math.max(0, events.length - (initialFirstGameweek - 1))
	const initialNumberOfGameweeks = Math.min(6, Math.max(1, remainingFromFirst))

	const { state, actions, data } = useFplTable({
		bootstrapData,
		fixtures,
		initialFirstGameweek,
		initialNumberOfGameweeks,
		initialDifficultyType: 'Overall',
	})

	const { firstGameweek, numberOfGameweeks, difficultyType, selectedTeams, sortConfig } = state
	const { setNumberOfGameweeks, setDifficultyType, setFirstGameweek, setSelectedTeams, handleSort, setSortConfig } = actions
	const { gameweekOptions, sortedData, fixtureData, isLoading, sortedTeams, teamAverageByName } = data

	useFixturesQuerySync({
		tab: { value: mainTab, onChange: setMainTab },
		schedule: { gameweek: scheduleGw, onChange: setScheduleGw },
		view: { value: view, onChange: setView },
		filters: {
			selectedTeams,
			difficultyType,
			firstGameweek,
			numberOfGameweeks,
			sortConfig,
			setSelectedTeams,
			setDifficultyType,
			setFirstGameweek,
			setNumberOfGameweeks,
			setSortConfig,
			handleSort,
		},
	})

	const isChart = view === 'chart'
	const canShowChart = isChart && selectedTeams.length > 0 && selectedTeams.length <= MAX_CHART_TEAMS && !!fixtureData

	/** Only the chart view needs a flex-growing middle so the line chart can use h-full. */
	const needsFillHeight = mainTab === 'difficulty' && isChart && canShowChart

	const { title, subtitle } = PAGE_COPY[mainTab]

	return (
		<section
			className={cn(
				'container mx-auto flex min-w-0 flex-col px-4 sm:px-4',
				needsFillHeight && 'h-full min-h-0 flex-1',
			)}
		>
			<div className='hidden shrink-0 pb-1 pt-3 lg:block'>
				<FixturePageHeader title={title} subtitle={subtitle} className='mb-1 sm:mb-0' />
			</div>

			<div className='sticky left-0 top-0 z-50 -mx-4 shrink-0 border-b border-border/60 bg-background/95 px-4 py-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:mx-0 sm:px-0 sm:py-2'>
				<Tabs value={mainTab} onValueChange={(v) => setMainTab(v as FixturesMainTab)} className='w-full'>
					<FixtureControls
						prependSlot={MainTabSelector}
						variant={mainTab === 'schedule' ? 'schedule' : 'full'}
						scheduleRoundId={scheduleGw}
						scheduleRoundMax={maxGw}
						onScheduleRoundChange={setScheduleGw}
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
				</Tabs>
			</div>

			<div
				className={cn(
					'-mx-4 flex min-h-0 min-w-0 flex-col sm:mx-0 sm:border',
					needsFillHeight ? 'flex-1 overflow-auto' : 'overflow-x-auto',
				)}
			>
				<div className='sticky left-0 z-10 shrink-0 bg-background px-4 pb-1 pt-3 sm:px-0 lg:hidden'>
					<FixturePageHeader title={title} subtitle={subtitle} className='mb-1 sm:mb-0' />
				</div>

				{mainTab === 'schedule' && (
					<div className='px-4 pb-6 sm:px-4'>
						<FixtureSchedulePanel
							bootstrapData={bootstrapData}
							fixtures={fixtures}
							gameweekId={scheduleGw}
							onGameweekChange={setScheduleGw}
							difficultyType={difficultyType}
						/>
					</div>
				)}

				{mainTab === 'difficulty' && (
					<DifficultyContent
						view={view}
						isLoading={isLoading}
						numberOfGameweeks={numberOfGameweeks}
						firstGameweek={firstGameweek}
						difficultyType={difficultyType}
						selectedTeams={selectedTeams}
						sortConfig={sortConfig}
						sortedData={sortedData}
						sortedTeams={sortedTeams}
						teamAverageByName={teamAverageByName}
						fixtureData={fixtureData}
						fixtures={fixtures}
						events={events}
						teams={teams}
						onSort={handleSort}
						onClearTeams={() => setSelectedTeams([])}
					/>
				)}
			</div>

			{(mainTab === 'difficulty' && view === 'grid' || mainTab === 'schedule') && (
				<div className='-mx-4 shrink-0 bg-background px-4 pb-3 pt-2 sm:mx-0 sm:px-0'>
					<DifficultyLegend difficultyType={difficultyType} />
				</div>
			)}
		</section>
	)
}

export default FixturesPage
