import type { Team, Fixtures } from '@/types/fpl'

import type { EnhancedFDRResult } from './types'
import { calculateConfidence, calculateConfidenceInterval } from './confidence'
import { calculateDynamicWeights } from './weights'
import {
	calculateSeasonPerformance,
	calculateAllTeamsPerformance,
	calculateSeasonAdjustment,
} from './seasonPerformance'
import { calculateFormAdjustment } from './formAnalysis'

export async function calculateDynamicFDR(
	homeTeam: Team,
	awayTeam: Team,
	fixtures: Fixtures,
	teams: Team[],
	isHome: boolean = false,
	currentGameweek: number = 1,
): Promise<EnhancedFDRResult> {
	const opponent = isHome ? awayTeam : homeTeam
	const [opponentPerformance, allTeamsPerformance] = await Promise.all([
		calculateSeasonPerformance(opponent.id, fixtures, currentGameweek),
		calculateAllTeamsPerformance(teams, fixtures, currentGameweek),
	])
	const weights = calculateDynamicWeights(currentGameweek, opponentPerformance.gamesPlayed)
	const attackingBase = calculateAttackingDifficulty(opponent, isHome)
	const defensiveBase = calculateDefensiveDifficulty(opponent, isHome)
	const overallBase = (attackingBase + defensiveBase) / 2
	const seasonAdjustment = calculateSeasonAdjustment(
		opponent,
		opponentPerformance,
		allTeamsPerformance,
		teams,
		currentGameweek,
		isHome,
	)
	const formAdjustment = await calculateFormAdjustment(opponent.id, fixtures, teams)
	const homeAdvantage = isHome ? -0.15 : 0.15
	const rawAttacking =
		attackingBase +
		seasonAdjustment * weights.season +
		formAdjustment * weights.form +
		homeAdvantage * weights.home

	const rawDefensive =
		defensiveBase +
		seasonAdjustment * weights.season +
		formAdjustment * weights.form +
		homeAdvantage * weights.home

	const rawOverall = (rawAttacking + rawDefensive) / 2
	const attacking = Math.max(1, Math.min(5, rawAttacking))
	const defensive = Math.max(1, Math.min(5, rawDefensive))
	const overall = Math.max(1, Math.min(5, rawOverall))
	const confidence = calculateConfidence(opponentPerformance, currentGameweek)
	const adjustmentMagnitude = Math.abs(seasonAdjustment) + Math.abs(formAdjustment)

	const overallCI = calculateConfidenceInterval(
		rawOverall,
		opponentPerformance.gamesPlayed,
		currentGameweek,
		adjustmentMagnitude,
	)

	const attackingCI = calculateConfidenceInterval(
		rawAttacking,
		opponentPerformance.gamesPlayed,
		currentGameweek,
		adjustmentMagnitude,
	)

	const defensiveCI = calculateConfidenceInterval(
		rawDefensive,
		opponentPerformance.gamesPlayed,
		currentGameweek,
		adjustmentMagnitude,
	)

	return {
		overall: Number(overall.toFixed(2)),
		attacking: Number(attacking.toFixed(2)),
		defensive: Number(defensive.toFixed(2)),
		confidence,
		confidenceInterval: {
			overall: overallCI.interval,
			attacking: attackingCI.interval,
			defensive: defensiveCI.interval,
			confidenceScore: overallCI.confidenceScore,
		},
		adjustments: {
			seasonForm: Number(seasonAdjustment.toFixed(3)),
			recentForm: Number(formAdjustment.toFixed(3)),
			homeAdvantage: Number(homeAdvantage.toFixed(3)),
			strengthEvolution: 0,
		},
		debug: {
			baseStrength: Number(overallBase.toFixed(2)),
			seasonAdjustment: Number(seasonAdjustment.toFixed(2)),
			formAdjustment: Number(formAdjustment.toFixed(2)),
			homeAdvantage: Number(homeAdvantage.toFixed(2)),
			rawScore: Number(rawOverall.toFixed(2)),
			weights,
		},
	}
}

function calculateAttackingDifficulty(opponent: Team, isHome: boolean): number {
	const opponentDefStrength = isHome
		? opponent.strength_defence_home
		: opponent.strength_defence_away
	return normalizeStrengthToDifficulty(opponentDefStrength)
}

function calculateDefensiveDifficulty(opponent: Team, isHome: boolean): number {
	const opponentAttStrength = isHome
		? opponent.strength_attack_home
		: opponent.strength_attack_away
	return normalizeStrengthToDifficulty(opponentAttStrength)
}

function normalizeStrengthToDifficulty(strength: number): number {
	const minStrength = 1000
	const maxStrength = 1400
	const clampedStrength = Math.max(minStrength, Math.min(maxStrength, strength))
	return 1 + (4 * (clampedStrength - minStrength)) / (maxStrength - minStrength)
}
