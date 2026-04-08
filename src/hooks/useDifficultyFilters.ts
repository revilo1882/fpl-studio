'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { BootstrapData } from '@/types/fpl'
import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'
import {
	readDifficultyFiltersFromStorage,
	writeDifficultyFiltersToStorage,
	type StoredDifficultyFilters,
} from '@/lib/fixtures/difficultyFiltersStorage'

export type FixtureGridSortKey = 'team' | 'score'
export type SortDirection = 'ascending' | 'descending'

export type FixtureGridSortConfig = {
	key: FixtureGridSortKey
	direction: SortDirection
}

type UseDifficultyFiltersParams = {
	bootstrapData: BootstrapData
	initialFirstGameweek: number
	initialNumberOfGameweeks: number
	initialDifficultyType: DifficultyType
}

export type UseDifficultyFiltersResult = {
	firstGameweek: number
	numberOfGameweeks: number
	effectiveWindow: number
	difficultyType: DifficultyType
	selectedTeams: string[]
	sortConfig: FixtureGridSortConfig
	gameweekOptions: number[]
	setFirstGameweek: (value: number) => void
	setNumberOfGameweeks: (value: number) => void
	setDifficultyType: (value: DifficultyType) => void
	setSelectedTeams: (teams: string[]) => void
	handleSort: (key: FixtureGridSortKey) => void
	setSortConfig: (config: FixtureGridSortConfig) => void
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export const useDifficultyFilters = ({
	bootstrapData,
	initialFirstGameweek,
	initialNumberOfGameweeks,
	initialDifficultyType,
}: UseDifficultyFiltersParams): UseDifficultyFiltersResult => {
	const events = bootstrapData.events ?? []
	const maxGameweekId = events.length > 0 ? Math.max(...events.map((e) => e.id)) : 0

	const [firstGameweek, setFirstGameweek] = useState(initialFirstGameweek)
	const [numberOfGameweeks, setNumberOfGameweeks] = useState(initialNumberOfGameweeks)
	const [difficultyType, setDifficultyType] = useState<DifficultyType>(initialDifficultyType)
	const [selectedTeams, setSelectedTeams] = useState<string[]>([])
	const [sortConfig, setSortConfig] = useState<FixtureGridSortConfig>({
		key: 'team',
		direction: 'ascending',
	})

	// Read persisted filters from localStorage only after hydration to avoid
	// a server/client mismatch (localStorage is unavailable during SSR).
	useEffect(() => {
		const persisted = readDifficultyFiltersFromStorage(bootstrapData, {
			firstGameweek: initialFirstGameweek,
			numberOfGameweeks: initialNumberOfGameweeks,
			difficultyType: initialDifficultyType,
		})
		setFirstGameweek(persisted.firstGameweek)
		setNumberOfGameweeks(persisted.numberOfGameweeks)
		setDifficultyType(persisted.difficultyType)
		setSelectedTeams(persisted.selectedTeams)
		setSortConfig({ key: persisted.sortKey, direction: persisted.sortDirection })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const effectiveWindow = useMemo(() => {
		const remaining = Math.max(0, maxGameweekId - firstGameweek + 1)
		return clamp(numberOfGameweeks, 1, Math.max(1, remaining))
	}, [firstGameweek, numberOfGameweeks, maxGameweekId])

	const gameweekOptions = useMemo(() => {
		const remaining = Math.max(0, maxGameweekId - firstGameweek + 1)
		const candidates = [4, 5, 6, 8, 10, 12, 15, 20]
		const options = new Set<number>()
		options.add(effectiveWindow)
		for (const value of candidates) {
			if (value >= 1 && value <= remaining) {
				options.add(value)
			}
		}
		return Array.from(options).sort((a, b) => a - b)
	}, [firstGameweek, maxGameweekId, effectiveWindow])

	useEffect(() => {
		const payload: StoredDifficultyFilters = {
			eventsLength: events.length,
			firstGameweek,
			numberOfGameweeks: effectiveWindow,
			difficultyType,
			selectedTeams,
			sortKey: sortConfig.key,
			sortDirection: sortConfig.direction,
		}
		writeDifficultyFiltersToStorage(payload)
	}, [
		events.length,
		firstGameweek,
		effectiveWindow,
		difficultyType,
		selectedTeams,
		sortConfig.key,
		sortConfig.direction,
	])

	const handleSort = useCallback((key: FixtureGridSortKey) => {
		setSortConfig((prev) => {
			if (prev.key === key) {
				const nextDirection: SortDirection =
					prev.direction === 'ascending' ? 'descending' : 'ascending'
				return { key, direction: nextDirection }
			}
			return { key, direction: 'ascending' }
		})
	}, [])

	const setNumberOfGameweeksClamped = useCallback(
		(value: number) => {
			const remaining = Math.max(0, maxGameweekId - firstGameweek + 1)
			setNumberOfGameweeks(clamp(value, 1, Math.max(1, remaining)))
		},
		[firstGameweek, maxGameweekId],
	)

	return {
		firstGameweek,
		numberOfGameweeks,
		effectiveWindow,
		difficultyType,
		selectedTeams,
		sortConfig,
		gameweekOptions,
		setFirstGameweek,
		setNumberOfGameweeks: setNumberOfGameweeksClamped,
		setDifficultyType,
		setSelectedTeams,
		handleSort,
		setSortConfig,
	}
}
