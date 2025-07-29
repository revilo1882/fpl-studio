'use client'

import { useState, useMemo, useEffect } from 'react'

import {
	type FixtureCell,
	generateFixtureMatrix,
	type DifficultyType,
} from '@/lib/generateFixtureMatrix'
import type { BootstrapData, Fixtures } from '@/types/fpl'

export type SortConfig = {
	key: 'team' | 'score'
	direction: 'ascending' | 'descending'
}

export const useFplTable = (bootstrapData: BootstrapData, fixtures: Fixtures) => {
	const { teams, events } = bootstrapData
	const [difficultyType, setDifficultyType] = useState<DifficultyType>('fpl')
	const [selectedTeams, setSelectedTeams] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [fixtureData, setFixtureData] = useState<{
		teamNames: string[]
		fixtureMatrix: FixtureCell[][]
		scores: number[]
	} | null>(null)

	const currentGameweek = events.find((event) => event.is_current)?.id
	const nextGameweek = events.find((event) => event.is_next)?.id
	const firstGameweek = currentGameweek || nextGameweek || 1
	const remainingGameweeks = events.length - (firstGameweek - 1)

	const preferredOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 19]
	const gameweekOptions = preferredOptions.filter((option) => option <= remainingGameweeks)
	if (gameweekOptions.length === 0 && remainingGameweeks > 0) {
		gameweekOptions.push(remainingGameweeks)
	}

	const [numberOfGameweeks, setNumberOfGameweeks] = useState(
		6 > remainingGameweeks ? remainingGameweeks : 6,
	)

	// Generate fixture matrix when dependencies change
	useEffect(() => {
		const generateData = async () => {
			setIsLoading(true)
			try {
				const result = await generateFixtureMatrix({
					teams,
					fixtures,
					bootstrapData,
					firstGameweek,
					numberOfGameweeks,
					difficultyType,
				})
				setFixtureData(result)
			} catch (error) {
				console.error('Error generating fixture matrix:', error)
				// Fallback to FPL ratings if dynamic fails
				if (difficultyType !== 'fpl') {
					const fallbackResult = await generateFixtureMatrix({
						teams,
						fixtures,
						bootstrapData,
						firstGameweek,
						numberOfGameweeks,
						difficultyType: 'fpl',
					})
					setFixtureData(fallbackResult)
				}
			} finally {
				setIsLoading(false)
			}
		}

		generateData()
	}, [teams, fixtures, bootstrapData, firstGameweek, numberOfGameweeks, difficultyType])

	const combinedData = useMemo(() => {
		if (!fixtureData) return []

		return fixtureData.teamNames.map((team, index) => ({
			team,
			fixtures: fixtureData.fixtureMatrix[index],
			score: fixtureData.scores[index],
		}))
	}, [fixtureData])

	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: 'team',
		direction: 'ascending',
	})

	const filteredData = useMemo(() => {
		if (selectedTeams.length === 0) {
			return combinedData
		}
		return combinedData.filter((row) => selectedTeams.includes(row.team))
	}, [combinedData, selectedTeams])

	const sortedData = useMemo(() => {
		const sortableItems = [...filteredData]
		sortableItems.sort((a, b) => {
			const isAsc = sortConfig.direction === 'ascending'
			switch (sortConfig.key) {
				case 'team':
					return isAsc ? a.team.localeCompare(b.team) : b.team.localeCompare(a.team)
				case 'score':
					return isAsc ? a.score - b.score : b.score - a.score
				default:
					return 0
			}
		})
		return sortableItems
	}, [filteredData, sortConfig])

	const handleSort = (key: 'team' | 'score') => {
		let direction: 'ascending' | 'descending' = 'ascending'
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending'
		}
		// Default to sorting score descending first, as a higher score is better
		if (key === 'score' && sortConfig.key !== 'score') {
			direction = 'descending'
		}
		setSortConfig({ key, direction })
	}

	return {
		teams,
		events,
		firstGameweek,
		numberOfGameweeks,
		setNumberOfGameweeks,
		gameweekOptions,
		sortedData,
		sortConfig,
		handleSort,
		difficultyType,
		setDifficultyType,
		selectedTeams,
		setSelectedTeams,
		isLoading,
	}
}
