'use client'

import React, { useMemo, useCallback } from 'react'

import { useTheme } from 'next-themes'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	type ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import type { Team } from '@/types/fpl'
import type { DifficultyType, FixtureCell, SingleFixture } from '@/lib/generateFixtureMatrix'
import { ChartPanel } from '@/components/charts/ChartPanel'
import { useChartPalette } from '@/components/charts/useChartPalette'
import { useChartOptions } from '@/components/charts/useChartOptions'
import { BuildLineDatasets } from '@/components/charts/BuildLineDatasets'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export type FixtureAttractivenessChartProps = {
	gameweekAttractivenessMatrix: number[][]
	fixtureMatrix: FixtureCell[][]
	teamNames: string[]
	selectedTeams: string[]
	firstGameweek: number
	numberOfGameweeks: number
	difficultyType: DifficultyType
	teams: Team[]
	sortedTeams: string[]
	teamAverageByName: Record<string, number>
}

export const FixtureAttractivenessChart: React.FC<FixtureAttractivenessChartProps> = ({
	gameweekAttractivenessMatrix,
	fixtureMatrix,
	teamNames,
	selectedTeams,
	firstGameweek,
	numberOfGameweeks,
	difficultyType,
	teams,
	sortedTeams,
	teamAverageByName,
}) => {
	const { resolvedTheme } = useTheme()
	const isDarkTheme = resolvedTheme === 'dark'

	const labels = useMemo(
		() => Array.from({ length: numberOfGameweeks }, (_, i) => `GW${firstGameweek + i}`),
		[firstGameweek, numberOfGameweeks],
	)

	const teamsToShow =
		selectedTeams.length > 0 ? selectedTeams : sortedTeams.length > 0 ? sortedTeams : teamNames

	const codeToShort = useMemo(
		() => new Map<number, string>(teams.map((t) => [t.code, t.short_name])),
		[teams],
	)

	const fixturesTextFor = useCallback(
		(cells: SingleFixture[] | undefined): string => {
			if (!cells || cells.length === 0) return 'Blank'
			return cells
				.map((fixture) => {
					const short =
						codeToShort.get(fixture.opponentCode) ??
						fixture.opponentName.slice(0, 3).toUpperCase()
					return `${short} ${fixture.isHome ? 'H' : 'A'}`
				})
				.join(', ')
		},
		[codeToShort],
	)

	const { grid: gridColor, ticks: tickColor, palette: colorByTeam } = useChartPalette(teamNames)

	const datasets = useMemo(
		() =>
			BuildLineDatasets({
				shownTeams: teamsToShow,
				teamNames,
				gameweekAttractivenessMatrix,
				numberOfGameweeks,
				teamAverageByName,
				colorByTeam,
			}),
		[
			teamsToShow,
			teamNames,
			gameweekAttractivenessMatrix,
			numberOfGameweeks,
			teamAverageByName,
			colorByTeam,
		],
	)

	const data: ChartData<'line', number[], string> = useMemo(
		() => ({ labels, datasets }),
		[labels, datasets],
	)

	const panelBg = isDarkTheme ? 'rgba(255,255,255,0.98)' : 'rgba(17,24,39,0.95)'
	const panelFg = isDarkTheme ? '#111827' : '#E5E7EB'
	const panelTitle = isDarkTheme ? '#111827' : '#FFFFFF'
	const panelBorder = isDarkTheme ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.2)'

	const options = useChartOptions({
		title: `Fixture Attractiveness (${difficultyType.charAt(0).toUpperCase() + difficultyType.slice(1)})`,
		yMin: 0,
		yMax: 5,
		gridColor,
		tickColor,
		panelBg,
		panelBorder,
		panelTitle,
		panelFg,
		fixtureMatrix,
		fixturesTextFor,
	})

	if (datasets.length === 0) return null

	return (
		<ChartPanel
			header={<h3 className='text-sm font-semibold'>Fixture Attractiveness</h3>}
			footer={
				<p className='text-xs text-muted-foreground'>
					Scores are 1–5 per fixture (higher is better). DGWs included for that GW; blanks
					= 0.
					{teamsToShow.length > 0 &&
						` Showing ${teamsToShow.length} selected team${teamsToShow.length > 1 ? 's' : ''}.`}
				</p>
			}
		>
			<div aria-label='Fixture attractiveness line chart' className='relative h-full w-full'>
				<Line datasetIdKey='label' data={data} options={options} />
			</div>
		</ChartPanel>
	)
}
