'use client'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'

import {
	useDifficultyFilters,
	type FixtureGridSortConfig,
	type FixtureGridSortKey,
	type SortDirection,
} from './useDifficultyFilters'
import { useFixtureMatrix, type GridRow } from './useFixtureMatrix'

export type { FixtureGridSortKey, SortDirection, FixtureGridSortConfig, GridRow }

export type UseFplTableParams = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
	initialFirstGameweek: number
	initialNumberOfGameweeks: number
	initialDifficultyType: DifficultyType
}

export type UseFplTableResult = {
	state: {
		firstGameweek: number
		numberOfGameweeks: number
		difficultyType: DifficultyType
		selectedTeams: string[]
		sortConfig: FixtureGridSortConfig
	}
	actions: {
		setFirstGameweek: (value: number) => void
		setNumberOfGameweeks: (value: number) => void
		setDifficultyType: (value: DifficultyType) => void
		setSelectedTeams: (teams: string[]) => void
		handleSort: (key: FixtureGridSortKey) => void
		setSortConfig: (config: FixtureGridSortConfig) => void
	}
	data: {
		gameweekOptions: number[]
		sortedData: GridRow[]
		fixtureData: ReturnType<typeof import('@/lib/fixtures/generateFixtureMatrix').generateFixtureMatrix> | null
		isLoading: boolean
		sortedTeams: string[]
		teamAverageByName: Record<string, number>
	}
}

export const useFplTable = ({
	bootstrapData,
	fixtures,
	initialFirstGameweek,
	initialNumberOfGameweeks,
	initialDifficultyType,
}: UseFplTableParams): UseFplTableResult => {
	const filters = useDifficultyFilters({
		bootstrapData,
		initialFirstGameweek,
		initialNumberOfGameweeks,
		initialDifficultyType,
	})

	const matrix = useFixtureMatrix({
		bootstrapData,
		fixtures,
		firstGameweek: filters.firstGameweek,
		effectiveWindow: filters.effectiveWindow,
		difficultyType: filters.difficultyType,
		selectedTeams: filters.selectedTeams,
		sortConfig: filters.sortConfig,
	})

	return {
		state: {
			firstGameweek: filters.firstGameweek,
			numberOfGameweeks: filters.effectiveWindow,
			difficultyType: filters.difficultyType,
			selectedTeams: filters.selectedTeams,
			sortConfig: filters.sortConfig,
		},
		actions: {
			setFirstGameweek: filters.setFirstGameweek,
			setNumberOfGameweeks: filters.setNumberOfGameweeks,
			setDifficultyType: filters.setDifficultyType,
			setSelectedTeams: filters.setSelectedTeams,
			handleSort: filters.handleSort,
			setSortConfig: filters.setSortConfig,
		},
		data: {
			gameweekOptions: filters.gameweekOptions,
			...matrix,
		},
	}
}
