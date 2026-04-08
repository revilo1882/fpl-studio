export { calculateDynamicFDR } from './dynamicFDR'
export { calculateConfidenceInterval, calculateConfidence } from './confidence'
export { calculateDynamicWeights } from './weights'
export { calculateSeasonPerformance, calculateAllTeamsPerformance } from './seasonPerformance'
export { calculateFormAdjustment } from './formAnalysis'
export { buildLeagueAverageOpponent } from './leagueAverageOpponent'

export type {
	EnhancedFDRResult,
	WeightConfig,
	SeasonPerformance,
	TeamPerformanceData,
	MatchPerformance,
} from './types'

import type { EnhancedFDRResult } from './types'
import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'

/** Pick the scalar difficulty value from an FDR result based on the active difficulty mode. */
export function pickDifficultyFromFDR(fdr: EnhancedFDRResult, difficultyType: DifficultyType): number {
	switch (difficultyType) {
		case 'Attack':
			return fdr.attacking
		case 'Defence':
			return fdr.defensive
		default:
			return fdr.overall
	}
}
