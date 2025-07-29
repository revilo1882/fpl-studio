import type { WeightConfig } from './types'

/**
 * Calculate dynamic weights based on season progress and available data
 */
export function calculateDynamicWeights(
	currentGameweek: number,
	gamesPlayed: number,
): WeightConfig {
	// Season progress factor (0 to 1)
	const seasonProgress = Math.min(1, currentGameweek / 38)

	// Data availability factor (0 to 1)
	const dataAvailability = Math.min(1, gamesPlayed / 10)

	// Early season (GW 1-5): Rely heavily on base ratings and form
	if (currentGameweek <= 5) {
		return {
			base: 0.8, // High reliance on pre-season ratings
			season: 0.05, // Very low season adjustment
			form: 0.1, // Some form consideration
			home: 0.05, // Basic home advantage
		}
	}

	// Early-mid season (GW 6-15): Gradually increase season weight
	if (currentGameweek <= 15) {
		const seasonWeight = 0.05 + seasonProgress * 0.2 // 5% to 25%
		const baseWeight = 0.8 - seasonProgress * 0.2 // 80% to 60%

		return {
			base: baseWeight,
			season: seasonWeight * dataAvailability, // Scale by data quality
			form: 0.15,
			home: 0.05,
		}
	}

	// Mid-late season (GW 16+): Full season performance weighting
	return {
		base: 0.5, // Reduced base weight
		season: 0.35 * dataAvailability, // High season weight if data available
		form: 0.1, // Reduced form weight
		home: 0.05, // Consistent home advantage
	}
}
