'use client'

import { useMemo } from 'react'

import type { ChartOptions, TooltipItem } from 'chart.js'

import type { FixtureCell } from '@/lib/generateFixtureMatrix'

import type { LineDataset } from './BuildLineDatasets'

export const useChartOptions = ({
	title,
	yMin,
	yMax,
	gridColor,
	tickColor,
	panelBg,
	panelBorder,
	panelTitle,
	panelFg,
	fixtureMatrix,
	fixturesTextFor,
}: {
	title: string
	yMin?: number
	yMax?: number
	gridColor: string
	tickColor: string
	panelBg: string
	panelBorder: string
	panelTitle: string
	panelFg: string
	fixtureMatrix: FixtureCell[][]
	fixturesTextFor: (cells: FixtureCell | undefined) => string
}) =>
	useMemo<ChartOptions<'line'>>(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			resizeDelay: 0,
			spanGaps: false,
			layout: {
				padding: {
					top: -26,
					bottom: -8,
					left: 0,
					right: 0,
				},
			},
			plugins: {
				title: {
					display: true,
					text: title,
					font: { size: 16, weight: 'bold' },
					padding: { bottom: 16 },
					color: panelTitle,
				},
				legend: {
					display: true,
					position: 'bottom',
					labels: {
						color: tickColor,
						usePointStyle: true,
						boxWidth: 10,
						boxHeight: 10,
						padding: 15,
						font: {
							size: 12,
						},
					},
				},
				tooltip: {
					mode: 'index',
					intersect: false,
					itemSort: (a, b) => (b.parsed.y as number) - (a.parsed.y as number),
					displayColors: true,
					backgroundColor: panelBg,
					borderColor: panelBorder,
					borderWidth: 1,
					titleColor: panelTitle,
					bodyColor: panelFg,
					titleFont: { size: 12, weight: 600 },
					bodyFont: { size: 12 },
					padding: 10,
					callbacks: {
						title: (items: TooltipItem<'line'>[]): string =>
							String(items[0]?.label ?? ''),
						label: (tooltipItem: TooltipItem<'line'>): string => {
							const dataset = tooltipItem.dataset as LineDataset
							const gameweekIndex = tooltipItem.dataIndex
							const cell = fixtureMatrix[dataset.metaTeamIndex]?.[gameweekIndex]
							const fixturesText = cell ? fixturesTextFor(cell) : ''
							const score =
								typeof tooltipItem.parsed.y === 'number'
									? tooltipItem.parsed.y.toFixed(2)
									: String(tooltipItem.parsed.y)
							const prefix =
								fixturesText && fixturesText !== 'Blank' ? `${fixturesText} • ` : ''
							return `${dataset.metaTeamName}: ${prefix}${score}`
						},
					},
				},
			},
			scales: {
				x: {
					grid: { color: gridColor, drawBorder: false },
					ticks: {
						color: tickColor,
						maxRotation: 0,
						font: {
							size: 11,
						},
					},
					title: {
						display: true,
						text: 'Gameweek',
						color: tickColor,
						font: { size: 14, weight: 'bold' },
					},
				},
				y: {
					min: yMin,
					max: yMax,
					grid: { color: gridColor, drawBorder: false },
					ticks: {
						color: tickColor,
						precision: 0,
						font: {
							size: 11,
						},
					},
					title: {
						display: true,
						text: 'Attractiveness',
						color: tickColor,
						font: { size: 14, weight: 'bold' },
					},
				},
			},
			elements: {
				point: {
					hoverBorderWidth: 3,
					radius: 3,
					hoverRadius: 5,
				},
				line: {
					borderWidth: 2,
				},
			},
		}),
		[
			title,
			yMin,
			yMax,
			gridColor,
			tickColor,
			panelBg,
			panelBorder,
			panelTitle,
			panelFg,
			fixtureMatrix,
			fixturesTextFor,
		],
	)
