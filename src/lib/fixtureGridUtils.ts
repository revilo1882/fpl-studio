import { type Fixtures, type Team } from '@/types/fpl'

import { type DifficultyType } from './generateFixtureMatrix'

export function getDifficultyUI(score: number, difficultyType: DifficultyType) {
	const roundedScore = Math.round(score)

	if (difficultyType === 'fpl') {
		switch (roundedScore) {
			case 1:
				return { bg: 'bg-green-500/60', text: 'text-green-500' }
			case 2:
				return { bg: 'bg-green-300/60', text: 'text-green-300' }
			case 3:
				return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
			case 4:
				return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
			case 5:
				return { bg: 'bg-red-500/60', text: 'text-red-500' }
			default:
				return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
		}
	}

	if (score === 0) return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
	if (score < 1.5) return { bg: 'bg-green-500/60', text: 'text-green-500' }
	if (score < 2.0) return { bg: 'bg-green-400/60', text: 'text-green-400' }
	if (score < 2.5) return { bg: 'bg-yellow-300/60', text: 'text-yellow-300' }
	if (score < 3.0) return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
	if (score < 3.5) return { bg: 'bg-orange-400/60', text: 'text-orange-400' }
	if (score < 4.0) return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
	if (score < 4.5) return { bg: 'bg-red-500/60', text: 'text-red-500' }
	return { bg: 'bg-red-600/60', text: 'text-red-600' }
}

export function getDifficultyName(type: DifficultyType) {
	switch (type) {
		case 'fpl':
			return 'FPL Difficulty'
		case 'attack':
			return 'Studio Attack'
		case 'defence':
			return 'Studio Defence'
		case 'overall':
			return 'Studio Overall'
		default:
			return 'Difficulty'
	}
}

export function getOpponentTeam(opponentName: string, teams: Team[]) {
	return teams.find((team) => team.name === opponentName)
}

export function getFormSummary(teamId: number, fixtures: Fixtures): string {
	const recentFixtures = fixtures
		.filter(
			(fixture) =>
				(fixture.team_h === teamId || fixture.team_a === teamId) &&
				fixture.finished === true &&
				fixture.team_h_score !== null &&
				fixture.team_a_score !== null,
		)
		.sort((a, b) => (b.event || 0) - (a.event || 0))
		.slice(0, 5)

	if (recentFixtures.length === 0) return 'No recent games'

	const results: string[] = []
	let totalGoalsFor = 0
	let totalGoalsAgainst = 0

	for (const fixture of recentFixtures) {
		const isHome = fixture.team_h === teamId

		const goalsFor = isHome ? fixture.team_h_score! : fixture.team_a_score!
		const goalsAgainst = isHome ? fixture.team_a_score! : fixture.team_h_score!

		totalGoalsFor += goalsFor
		totalGoalsAgainst += goalsAgainst

		let result = 'L'
		if (goalsFor > goalsAgainst) result = 'W'
		else if (goalsFor === goalsAgainst) result = 'D'

		results.push(result)
	}

	return `${results.reverse().join('')} (${totalGoalsFor} GF, ${totalGoalsAgainst} GA)`
}
