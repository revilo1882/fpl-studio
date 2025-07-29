import { type FixtureCell } from './generateFixtureMatrix'

export interface GameweekScore {
	numberOfFixtures: number
	avgDifficulty: number
	rawScore: number // Base score before bonuses
	dgwBonus: number // Bonus for multiple fixtures
	totalScore: number // Final score for this gameweek
}

export interface AttractivenessResult {
	totalScore: number
	avgScore: number
	gameweekBreakdown: GameweekScore[]
	summary: {
		blanks: number
		singles: number
		doubles: number
		triples: number
		bestGameweek: number
		worstGameweek: number
	}
}

export function calculateAttractivenessScore(fixtureMatrix: FixtureCell[]): AttractivenessResult {
	const gameweekBreakdown: GameweekScore[] = []
	let totalScore = 0

	// Count different gameweek types for summary
	let blanks = 0,
		singles = 0,
		doubles = 0,
		triples = 0
	let bestScore = 0,
		worstScore = Infinity,
		bestGW = 0,
		worstGW = 0

	fixtureMatrix.forEach((gameweekFixtures, gwIndex) => {
		const numFixtures = gameweekFixtures.length

		// Handle blank gameweeks
		if (numFixtures === 0 || gameweekFixtures.every((f) => f.difficulty === 0)) {
			gameweekBreakdown.push({
				numberOfFixtures: 0,
				avgDifficulty: 0,
				rawScore: 0,
				dgwBonus: 0,
				totalScore: 0,
			})
			blanks++

			// Blank is always worst
			if (0 < worstScore) {
				worstScore = 0
				worstGW = gwIndex + 1
			}
			return
		}

		// Calculate average difficulty of real fixtures
		const validFixtures = gameweekFixtures.filter((f) => f.difficulty > 0)
		const avgDifficulty =
			validFixtures.reduce((sum, f) => sum + f.difficulty, 0) / validFixtures.length

		// Base score from difficulty (inverted - lower difficulty = higher score)
		const rawScore = calculateDifficultyScore(avgDifficulty)

		// DGW/TGW bonus - the key improvement!
		const dgwBonus = calculateMultiFixtureBonus(validFixtures.length, avgDifficulty)

		const totalGameweekScore = rawScore + dgwBonus

		gameweekBreakdown.push({
			numberOfFixtures: validFixtures.length,
			avgDifficulty: Number(avgDifficulty.toFixed(2)),
			rawScore: Number(rawScore.toFixed(2)),
			dgwBonus: Number(dgwBonus.toFixed(2)),
			totalScore: Number(totalGameweekScore.toFixed(2)),
		})

		totalScore += totalGameweekScore

		// Track best/worst gameweeks
		if (totalGameweekScore > bestScore) {
			bestScore = totalGameweekScore
			bestGW = gwIndex + 1
		}
		if (totalGameweekScore < worstScore) {
			worstScore = totalGameweekScore
			worstGW = gwIndex + 1
		}

		// Count gameweek types
		if (validFixtures.length === 1) singles++
		else if (validFixtures.length === 2) doubles++
		else if (validFixtures.length >= 3) triples++
	})

	const avgScore = fixtureMatrix.length > 0 ? totalScore / fixtureMatrix.length : 0

	return {
		totalScore: Number(totalScore.toFixed(2)),
		avgScore: Number(avgScore.toFixed(2)),
		gameweekBreakdown,
		summary: {
			blanks,
			singles,
			doubles,
			triples,
			bestGameweek: bestGW,
			worstGameweek: worstGW,
		},
	}
}

/**
 * Convert difficulty to base score (lower difficulty = higher score)
 * Scale: 1.0 (hardest) to 5.0 (easiest)
 */
function calculateDifficultyScore(avgDifficulty: number): number {
	// Invert difficulty: 1 becomes 5, 5 becomes 1
	return 6 - avgDifficulty
}

/**
 * Calculate bonus for multiple fixtures - this is the key insight!
 * Even mediocre DGWs are often better than good SGWs
 */
function calculateMultiFixtureBonus(numFixtures: number, avgDifficulty: number): number {
	if (numFixtures <= 1) return 0

	// Base DGW bonus
	let bonus = 0

	if (numFixtures === 2) {
		// Double gameweek bonus - depends on difficulty
		if (avgDifficulty <= 2.5)
			bonus = 3.0 // Amazing DGW
		else if (avgDifficulty <= 3.5)
			bonus = 2.0 // Good DGW
		else if (avgDifficulty <= 4.0)
			bonus = 1.0 // OK DGW
		else bonus = 0.5 // Poor DGW but still bonus
	} else if (numFixtures >= 3) {
		// Triple gameweek - massive bonus
		if (avgDifficulty <= 3.0)
			bonus = 5.0 // Incredible TGW
		else if (avgDifficulty <= 4.0)
			bonus = 3.5 // Great TGW
		else bonus = 2.0 // Even hard TGW is valuable
	}

	return bonus
}

/**
 * Get a human-readable summary of the fixture run
 */
export function getFixtureRunSummary(result: AttractivenessResult): string {
	const { summary } = result

	const parts: string[] = []

	if (summary.doubles > 0) parts.push(`${summary.doubles} DGW${summary.doubles > 1 ? 's' : ''}`)
	if (summary.triples > 0) parts.push(`${summary.triples} TGW${summary.triples > 1 ? 's' : ''}`)
	if (summary.blanks > 0) parts.push(`${summary.blanks} blank${summary.blanks > 1 ? 's' : ''}`)

	const specialFixtures = parts.join(', ')

	if (specialFixtures) {
		return `Score: ${result.totalScore} (${specialFixtures})`
	} else {
		return `Score: ${result.totalScore} (${summary.singles} fixtures)`
	}
}

/**
 * Compare two teams' fixture attractiveness
 */
export function compareFixtureRuns(
	team1Result: AttractivenessResult,
	team1Name: string,
	team2Result: AttractivenessResult,
	team2Name: string,
): string {
	const diff = team1Result.totalScore - team2Result.totalScore

	if (Math.abs(diff) < 0.5) {
		return `${team1Name} and ${team2Name} have similar fixture attractiveness`
	}

	const better = diff > 0 ? team1Name : team2Name
	const worse = diff > 0 ? team2Name : team1Name
	const advantage = Math.abs(diff)

	return `${better} has better fixtures than ${worse} (+${advantage.toFixed(1)})`
}
