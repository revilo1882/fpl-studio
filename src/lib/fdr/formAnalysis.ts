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
		.sort((a, b) => (b.event || 0) - (a.event || 0)) // Most recent first
		.slice(0, 5)

	if (recentFixtures.length < 3) {
		return 0 // Not enough data
	}

	const teamMap = new Map(teams.map((team) => [team.id, team]))
	const performances: MatchPerformance[] = []

	// Analyze each recent match
	for (const fixture of recentFixtures) {
		const isHome = fixture.team_h === teamId
		const opponentId = isHome ? fixture.team_a : fixture.team_h
		const opponent = teamMap.get(opponentId)

		if (!opponent) continue

		const goalsFor = isHome ? fixture.team_h_score! : fixture.team_a_score!
		const goalsAgainst = isHome ? fixture.team_a_score! : fixture.team_h_score!
		const goalDifference = goalsFor - goalsAgainst

		// Get opponent strength (average of home/away overall strength)
		const opponentStrength =
			(opponent.strength_overall_home + opponent.strength_overall_away) / 2

		// Calculate basic points
		let points = 0
		if (goalDifference > 0)
			points = 3 // Win
		else if (goalDifference === 0) points = 1 // Draw
		// Loss = 0

		// Calculate strength-adjusted score
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
	const strengthFactor = opponentStrength / 1200 // Normalize around 1.0

	if (points === 3) {
		// Win: Bonus for beating strong teams
		adjustedScore += Math.max(0, (strengthFactor - 1) * 2) // Up to +2 for beating very strong teams
	} else if (points === 0) {
		// Loss: Penalty for losing to weak teams
		adjustedScore -= Math.max(0, (1 - strengthFactor) * 1.5) // Up to -1.5 for losing to weak teams
	}

	if (goalsFor >= 3)
		adjustedScore += 0.5 // 3+ goals = good attack
	else if (goalsFor >= 2)
		adjustedScore += 0.25 // 2 goals = decent attack
	else if (goalsFor === 0) adjustedScore -= 0.25 // No goals = poor attack

	if (goalsAgainst === 0)
		adjustedScore += 0.3 // Clean sheet bonus
	else if (goalsAgainst >= 3)
		adjustedScore -= 0.5 // 3+ conceded = poor defence
	else if (goalsAgainst >= 2) adjustedScore -= 0.25 // 2 conceded = decent defence

	if (isHome) {
		adjustedScore *= 0.95 // 5% discount for home advantage
	} else {
		adjustedScore *= 1.05 // 5% bonus for away performance
	}

	return adjustedScore
}

function calculateWeightedFormScore(performances: MatchPerformance[]): number {
	if (performances.length === 0) return 0

	const weights = [1.0, 0.8, 0.6, 0.4, 0.2] // Most recent = highest weight

	let totalWeightedScore = 0
	let totalWeights = 0

	performances.forEach((perf, index) => {
		const weight = weights[index] || 0.1
		totalWeightedScore += perf.strengthAdjustedScore * weight
		totalWeights += weight
	})

	const averageScore = totalWeights > 0 ? totalWeightedScore / totalWeights : 0

	// Convert to adjustment range (-0.5 to +0.5)
	// Score of 3.0 = excellent form (+0.5)
	// Score of 1.5 = average form (0.0)
	// Score of 0.0 = terrible form (-0.5)
	return Math.max(-0.5, Math.min(0.5, (averageScore - 1.5) / 3))
}
