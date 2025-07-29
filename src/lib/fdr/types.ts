export interface SeasonPerformance {
	points: number
	goalsFor: number
	goalsAgainst: number
	gamesPlayed: number
	wins: number
	draws: number
	losses: number
	homeRecord: { w: number; d: number; l: number; gf: number; ga: number }
	awayRecord: { w: number; d: number; l: number; gf: number; ga: number }
	xPoints: number
	strengthTrend: number
}

export interface EnhancedFDRResult {
	overall: number
	attacking: number
	defensive: number
	confidence: 'high' | 'medium' | 'low'
	confidenceInterval: {
		overall: [number, number]
		attacking: [number, number]
		defensive: [number, number]
		confidenceScore: number
	}
	adjustments: {
		seasonForm: number
		recentForm: number
		homeAdvantage: number
		strengthEvolution: number
	}
	debug?: {
		baseStrength: number
		seasonAdjustment: number
		formAdjustment: number
		homeAdvantage: number
		rawScore: number
		weights: WeightConfig
	}
}

export interface WeightConfig {
	base: number
	season: number
	form: number
	home: number
}

export interface TeamPerformanceData {
	teamId: number
	ppg: number
	gamesPlayed: number
	goalsFor: number
	goalsAgainst: number
	goalDifferencePerGame: number
	homeRecord: { ppg: number; games: number }
	awayRecord: { ppg: number; games: number }
}

export interface MatchPerformance {
	points: number
	goalsFor: number
	goalsAgainst: number
	goalDifference: number
	opponentStrength: number
	strengthAdjustedScore: number
	isHome: boolean
}
