import type { Team } from '@/types/fpl'

const SYNTHETIC_ID = -1

/**
 * Synthetic opponent with each strength field set to the league mean.
 * Used for "vs average opponent" style ratings so results vary by the subject team
 * (home/away strength splits differ from a flat 1200 placeholder).
 */
export function buildLeagueAverageOpponent(teams: Team[]): Team {
	if (teams.length === 0) {
		return fallbackAverageOpponent()
	}

	const n = teams.length
	const sum = (pick: (t: Team) => number) => teams.reduce((s, t) => s + pick(t), 0)
	const roundAvg = (pick: (t: Team) => number) => Math.round(sum(pick) / n)

	return {
		id: SYNTHETIC_ID,
		name: 'League average',
		short_name: 'AVG',
		strength: roundAvg((t) => t.strength),
		strength_overall_home: roundAvg((t) => t.strength_overall_home),
		strength_overall_away: roundAvg((t) => t.strength_overall_away),
		strength_attack_home: roundAvg((t) => t.strength_attack_home),
		strength_attack_away: roundAvg((t) => t.strength_attack_away),
		strength_defence_home: roundAvg((t) => t.strength_defence_home),
		strength_defence_away: roundAvg((t) => t.strength_defence_away),
		pulse_id: 0,
		code: 0,
		form: '',
	}
}

function fallbackAverageOpponent(): Team {
	return {
		id: SYNTHETIC_ID,
		name: 'League average',
		short_name: 'AVG',
		strength: 3,
		strength_overall_home: 1200,
		strength_overall_away: 1200,
		strength_attack_home: 1100,
		strength_attack_away: 1100,
		strength_defence_home: 1100,
		strength_defence_away: 1100,
		pulse_id: 0,
		code: 0,
		form: '',
	}
}
