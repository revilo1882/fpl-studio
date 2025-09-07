import type { WeightConfig } from './types'

export function calculateDynamicWeights(
	currentGameweek: number,
	gamesPlayed: number,
): WeightConfig {
	const seasonProgress = Math.min(1, currentGameweek / 38)

	const dataAvailability = Math.min(1, gamesPlayed / 10)

	if (currentGameweek <= 5) {
		return {
			base: 0.8,
			season: 0.05,
			form: 0.1,
			home: 0.05,
		}
	}

	if (currentGameweek <= 15) {
		const seasonWeight = 0.05 + seasonProgress * 0.2
		const baseWeight = 0.8 - seasonProgress * 0.2

		return {
			base: baseWeight,
			season: seasonWeight * dataAvailability,
			form: 0.15,
			home: 0.05,
		}
	}

	return {
		base: 0.5,
		season: 0.35 * dataAvailability,
		form: 0.1,
		home: 0.05,
	}
}
