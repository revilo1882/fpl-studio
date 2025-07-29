import type { SeasonPerformance } from './types'

/**
 * Calculate confidence intervals based on various uncertainty factors
 */
export function calculateConfidenceInterval(
	rating: number,
	gamesPlayed: number,
	currentGameweek: number,
	adjustmentMagnitude: number,
): { interval: [number, number]; confidenceScore: number } {
	// Simple uncertainty calculation based on data availability
	const sampleSizeUncertainty = gamesPlayed < 5 ? 0.6 : gamesPlayed < 10 ? 0.4 : 0.2

	const earlySeasonUncertainty = currentGameweek <= 8 ? 0.5 : 0.2

	const adjustmentUncertainty = Math.min(0.4, adjustmentMagnitude * 0.3)

	// Total uncertainty (margin of error)
	const totalUncertainty = sampleSizeUncertainty + earlySeasonUncertainty + adjustmentUncertainty

	// Confidence score (higher = more confident)
	const confidenceScore = Math.max(0.1, Math.min(1, 1 - totalUncertainty / 1.5))

	// Create interval
	const lowerBound = Math.max(1, rating - totalUncertainty)
	const upperBound = Math.min(5, rating + totalUncertainty)

	return {
		interval: [Number(lowerBound.toFixed(1)), Number(upperBound.toFixed(1))],
		confidenceScore: Number(confidenceScore.toFixed(2)),
	}
}

export function calculateConfidence(
	performance: SeasonPerformance,
	currentGameweek: number,
): 'high' | 'medium' | 'low' {
	const gamesPlayed = performance.gamesPlayed

	// Early season: Always low/medium confidence
	if (currentGameweek <= 8) {
		return gamesPlayed >= 5 ? 'medium' : 'low'
	}

	// Mid season: Confidence based on games played
	if (currentGameweek <= 20) {
		if (gamesPlayed >= 8) return 'high'
		if (gamesPlayed >= 4) return 'medium'
		return 'low'
	}

	// Late season: Should have plenty of data
	if (gamesPlayed >= 15) return 'high'
	if (gamesPlayed >= 8) return 'medium'
	return 'low'
}
