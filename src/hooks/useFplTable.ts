import { useState, useMemo } from 'react'

import { generateFixtureMatrix, type DifficultyType } from '@/lib/generateFixtureMatrix'
import type { BootstrapData, Fixtures } from '@/types/fpl'

type SortConfig = {
	key: 'team' | 'score'
	direction: 'ascending' | 'descending'
}

export const useFplTable = (bootstrapData: BootstrapData, fixtures: Fixtures) => {
	const { teams, events } = bootstrapData

	const [difficultyType, setDifficultyType] = useState<DifficultyType>('fpl')
	const [selectedTeams, setSelectedTeams] = useState<string[]>([])

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

	const { teamNames, fixtureMatrix, scores } = useMemo(
		() =>
			generateFixtureMatrix({
				teams,
				fixtures,
				firstGameweek,
				numberOfGameweeks,
				difficultyType,
			}),
		[teams, fixtures, firstGameweek, numberOfGameweeks, difficultyType],
	)

	const combinedData = useMemo(
		() =>
			teamNames.map((team, index) => ({
				team,
				fixtures: fixtureMatrix[index],
				score: scores[index],
			})),
		[teamNames, fixtureMatrix, scores],
	)

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
	}
}
