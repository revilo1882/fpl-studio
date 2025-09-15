'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import {
	generateFixtureMatrix,
	type DifficultyType,
	type FixtureCell,
} from '@/lib/generateFixtureMatrix'

export type FixtureGridSortKey = 'team' | 'score'
export type SortDirection = 'ascending' | 'descending'

export type FixtureGridSortConfig = {
	key: FixtureGridSortKey
	direction: SortDirection
}

export type UseFplTableParams = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
	initialFirstGameweek: number
	initialNumberOfGameweeks: number
	initialDifficultyType: DifficultyType
}

type FixtureData = Awaited<ReturnType<typeof generateFixtureMatrix>>

export type GridRow = {
	team: string
	fixtures: FixtureCell[]
	score: number
	gameweekScores: number[]
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
	}
	data: {
		gameweekOptions: number[]
		sortedData: GridRow[]
		fixtureData: FixtureData | null
		isLoading: boolean
		sortedTeams: string[]
		teamAverageByName: Record<string, number>
	}
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export const useFplTable = ({
	bootstrapData,
	fixtures,
	initialFirstGameweek,
	initialNumberOfGameweeks,
	initialDifficultyType,
}: UseFplTableParams): UseFplTableResult => {
	const events = bootstrapData.events ?? []

	const maxGameweekId = events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0
	const initialFirst = clamp(initialFirstGameweek, 1, Math.max(1, maxGameweekId))
	const maxWindowFromFirst = Math.max(0, maxGameweekId - initialFirst + 1)
	const initialWindow = clamp(initialNumberOfGameweeks, 1, Math.max(1, maxWindowFromFirst))

	const [firstGameweek, setFirstGameweek] = useState<number>(initialFirst)
	const [numberOfGameweeks, setNumberOfGameweeks] = useState<number>(initialWindow)
	const [difficultyType, setDifficultyType] = useState<DifficultyType>(initialDifficultyType)
	const [selectedTeams, setSelectedTeams] = useState<string[]>([])
	const [sortConfig, setSortConfig] = useState<FixtureGridSortConfig>({
		key: 'team',
		direction: 'ascending',
	})

	const [fixtureData, setFixtureData] = useState<FixtureData | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)

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
		let cancelled = false

		const run = async () => {
			setIsLoading(true)
			try {
				const result = await generateFixtureMatrix({
					teams: bootstrapData.teams ?? [],
					fixtures,
					bootstrapData,
					firstGameweek,
					numberOfGameweeks: effectiveWindow,
					difficultyType,
				})
				if (!cancelled) setFixtureData(result)
			} finally {
				if (!cancelled) setIsLoading(false)
			}
		}

		run()
		return () => {
			cancelled = true
		}
	}, [bootstrapData, fixtures, firstGameweek, effectiveWindow, difficultyType])

	const gridRows: GridRow[] = useMemo(() => {
		if (!fixtureData) return []
		const rows: GridRow[] = []
		const { fixtureMatrix, gameweekAttractivenessMatrix, teamNames } = fixtureData

		for (let teamIndex = 0; teamIndex < teamNames.length; teamIndex += 1) {
			const teamName = teamNames[teamIndex]
			const fixturesSlice = fixtureMatrix[teamIndex]?.slice(0, effectiveWindow) ?? []
			const scoresSlice =
				gameweekAttractivenessMatrix[teamIndex]?.slice(0, effectiveWindow) ?? []
			const total = scoresSlice.reduce((sum, value) => sum + (value ?? 0), 0)

			rows.push({
				team: teamName,
				fixtures: fixturesSlice,
				score: total,
				gameweekScores: scoresSlice,
			})
		}
		return rows
	}, [fixtureData, effectiveWindow])

	const sortedData: GridRow[] = useMemo(() => {
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
		() =>
			Object.fromEntries(
				sortedData.map((row) => [row.team, row.score / (effectiveWindow || 1)]),
			),
		[sortedData, effectiveWindow],
	)

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
		state: {
			firstGameweek,
			numberOfGameweeks: effectiveWindow,
			difficultyType,
			selectedTeams,
			sortConfig,
		},
		actions: {
			setFirstGameweek,
			setNumberOfGameweeks: setNumberOfGameweeksClamped,
			setDifficultyType,
			setSelectedTeams,
			handleSort,
		},
		data: {
			gameweekOptions,
			sortedData,
			fixtureData,
			isLoading,
			sortedTeams,
			teamAverageByName,
		},
	}
}
