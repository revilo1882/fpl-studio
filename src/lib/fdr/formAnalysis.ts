import type { Team, Fixtures } from '@/types/fpl'

import type { MatchPerformance } from './types'

export async function calculateFormAdjustment(
	teamId: number,
	fixtures: Fixtures,
	teams: Team[],
): Promise<number> {
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

	if (recentFixtures.length < 3) {
		return 0
	}

	const teamMap = new Map(teams.map((team) => [team.id, team]))
	const performances: MatchPerformance[] = []
	for (const fixture of recentFixtures) {
		const isHome = fixture.team_h === teamId
		const opponentId = isHome ? fixture.team_a : fixture.team_h
		const opponent = teamMap.get(opponentId)

		if (!opponent) continue

		const goalsFor = isHome ? fixture.team_h_score! : fixture.team_a_score!
		const goalsAgainst = isHome ? fixture.team_a_score! : fixture.team_h_score!
		const goalDifference = goalsFor - goalsAgainst

		const opponentStrength =
			(opponent.strength_overall_home + opponent.strength_overall_away) / 2

		let points = 0
		if (goalDifference > 0) points = 3
		else if (goalDifference === 0) points = 1

		const strengthAdjustedScore = calculateStrengthAdjustedScore(
			points,
			goalsFor,
			goalsAgainst,
			opponentStrength,
			isHome,
		)

		performances.push({
			points,
			goalsFor,
			goalsAgainst,
			goalDifference,
			opponentStrength,
			strengthAdjustedScore,
			isHome,
		})
	}

	return calculateWeightedFormScore(performances)
}

function calculateStrengthAdjustedScore(
	points: number,
	goalsFor: number,
	goalsAgainst: number,
	opponentStrength: number,
	isHome: boolean,
): number {
	let adjustedScore = points
	const strengthFactor = opponentStrength / 1200

	if (points === 3) {
		adjustedScore += Math.max(0, (strengthFactor - 1) * 2)
	} else if (points === 0) {
		adjustedScore -= Math.max(0, (1 - strengthFactor) * 1.5)
	}

	if (goalsFor >= 3) adjustedScore += 0.5
	else if (goalsFor >= 2) adjustedScore += 0.25
	else if (goalsFor === 0) adjustedScore -= 0.25

	if (goalsAgainst === 0) adjustedScore += 0.3
	else if (goalsAgainst >= 3) adjustedScore -= 0.5
	else if (goalsAgainst >= 2) adjustedScore -= 0.25

	if (isHome) {
		adjustedScore *= 0.95
	} else {
		adjustedScore *= 1.05
	}

	return adjustedScore
}

function calculateWeightedFormScore(performances: MatchPerformance[]): number {
	if (performances.length === 0) return 0

	const weights = [1.0, 0.8, 0.6, 0.4, 0.2]

	let totalWeightedScore = 0
	let totalWeights = 0

	performances.forEach((perf, index) => {
		const weight = weights[index] || 0.1
		totalWeightedScore += perf.strengthAdjustedScore * weight
		totalWeights += weight
	})

	const averageScore = totalWeights > 0 ? totalWeightedScore / totalWeights : 0

	return Math.max(-0.5, Math.min(0.5, (averageScore - 1.5) / 3))
}
