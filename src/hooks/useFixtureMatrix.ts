'use client'

import { useEffect, useMemo, useState } from 'react'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import {
	generateFixtureMatrix,
	type DifficultyType,
	type FixtureCell,
} from '@/lib/fixtures/generateFixtureMatrix'

import type { FixtureGridSortConfig } from './useDifficultyFilters'

type FixtureData = ReturnType<typeof generateFixtureMatrix>

export type GridRow = {
	team: string
	fixtures: FixtureCell[]
	score: number
	gameweekScores: number[]
}

// Module-level cache — persists across client-side navigations for the session.
// Key encodes the parameters that determine the output; fixture count is a
// lightweight proxy for data freshness (changes on full reload = cache miss).
const matrixCache = new Map<string, FixtureData>()

const matrixCacheKey = (
	difficultyType: DifficultyType,
	firstGameweek: number,
	numberOfGameweeks: number,
	fixtureCount: number,
): string => `${difficultyType}|${firstGameweek}|${numberOfGameweeks}|${fixtureCount}`

type UseFixtureMatrixParams = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
	firstGameweek: number
	effectiveWindow: number
	difficultyType: DifficultyType
	selectedTeams: string[]
	sortConfig: FixtureGridSortConfig
}

export type UseFixtureMatrixResult = {
	fixtureData: FixtureData | null
	isLoading: boolean
	sortedData: GridRow[]
	sortedTeams: string[]
	teamAverageByName: Record<string, number>
}

export const useFixtureMatrix = ({
	bootstrapData,
	fixtures,
	firstGameweek,
	effectiveWindow,
	difficultyType,
	selectedTeams,
	sortConfig,
}: UseFixtureMatrixParams): UseFixtureMatrixResult => {
	const [fixtureData, setFixtureData] = useState<FixtureData | null>(() => {
		const key = matrixCacheKey(difficultyType, firstGameweek, effectiveWindow, fixtures.length)
		return matrixCache.get(key) ?? null
	})
	const [isLoading, setIsLoading] = useState<boolean>(() => {
		const key = matrixCacheKey(difficultyType, firstGameweek, effectiveWindow, fixtures.length)
		return !matrixCache.has(key)
	})

	useEffect(() => {
		const cacheKey = matrixCacheKey(difficultyType, firstGameweek, effectiveWindow, fixtures.length)
		const cached = matrixCache.get(cacheKey)
		if (cached) {
			setFixtureData(cached)
			setIsLoading(false)
			return
		}

		let cancelled = false
		setIsLoading(true)
		const result = generateFixtureMatrix({
			teams: bootstrapData.teams ?? [],
			fixtures,
			bootstrapData,
			firstGameweek,
			numberOfGameweeks: effectiveWindow,
			difficultyType,
		})
		if (!cancelled) {
			matrixCache.set(cacheKey, result)
			setFixtureData(result)
			setIsLoading(false)
		}
		return () => {
			cancelled = true
		}
	}, [bootstrapData, fixtures, firstGameweek, effectiveWindow, difficultyType])

	const gridRows = useMemo(() => {
		if (!fixtureData) return []
		const rows: GridRow[] = []
		const { fixtureMatrix, gameweekAttractivenessMatrix, teamNames } = fixtureData
		for (let i = 0; i < teamNames.length; i += 1) {
			const fixturesSlice = fixtureMatrix[i]?.slice(0, effectiveWindow) ?? []
			const scoresSlice = gameweekAttractivenessMatrix[i]?.slice(0, effectiveWindow) ?? []
			const total = scoresSlice.reduce((sum, v) => sum + (v ?? 0), 0)
			rows.push({
				team: teamNames[i]!,
				fixtures: fixturesSlice,
				score: total,
				gameweekScores: scoresSlice,
			})
		}
		return rows
	}, [fixtureData, effectiveWindow])

	const sortedData = useMemo(() => {
		let base = [...gridRows]
		if (selectedTeams.length > 0) {
			const selected = new Set(selectedTeams)
			base = base.filter((row) => selected.has(row.team))
		}
		if (sortConfig.key === 'team') {
			base.sort((a, b) =>
				sortConfig.direction === 'ascending'
					? a.team.localeCompare(b.team)
					: b.team.localeCompare(a.team),
			)
		} else {
			base.sort((a, b) =>
				sortConfig.direction === 'ascending' ? a.score - b.score : b.score - a.score,
			)
		}
		return base
	}, [gridRows, sortConfig, selectedTeams])

	const sortedTeams = useMemo(() => sortedData.map((row) => row.team), [sortedData])

	const teamAverageByName = useMemo(
		() => Object.fromEntries(sortedData.map((row) => [row.team, row.score / (effectiveWindow || 1)])),
		[sortedData, effectiveWindow],
	)

	return { fixtureData, isLoading, sortedData, sortedTeams, teamAverageByName }
}
