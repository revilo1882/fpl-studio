import { useState, useMemo } from 'react'

import { generateFixtureMatrix, type DifficultyType } from '@/lib/generateFixtureMatrix'
import type { BootstrapData, Fixtures } from '@/types/fpl'

type SortConfig = {
	key: 'team' | 'average'
	direction: 'ascending' | 'descending'
}

export const useFplTable = (bootstrapData: BootstrapData, fixtures: Fixtures) => {
	const { teams, events } = bootstrapData

	const [difficultyType, setDifficultyType] = useState<DifficultyType>('fpl')

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

	const { teamNames, fixtureMatrix, averages } = useMemo(
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
				average: averages[index],
			})),
		[teamNames, fixtureMatrix, averages],
	)

	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: 'team',
		direction: 'ascending',
	})

	const sortedData = useMemo(() => {
		const sortableItems = [...combinedData]
		sortableItems.sort((a, b) => {
			const isAsc = sortConfig.direction === 'ascending'
			switch (sortConfig.key) {
				case 'team':
					return isAsc ? a.team.localeCompare(b.team) : b.team.localeCompare(a.team)
				case 'average':
					return isAsc ? a.average - b.average : b.average - a.average
				default:
					return 0
			}
		})
		return sortableItems
	}, [combinedData, sortConfig])

	const handleSort = (key: 'team' | 'average') => {
		let direction: 'ascending' | 'descending' = 'ascending'
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending'
		}
		setSortConfig({ key, direction })
	}

	return {
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
	}
}
