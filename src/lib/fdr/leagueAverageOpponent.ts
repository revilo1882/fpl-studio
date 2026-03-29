import type { Team } from '@/types/fpl'

const SYNTHETIC_ID = -1

const fallbackAverageOpponent = (): Team => ({
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
})

/**
 * Synthetic opponent with each strength field set to the league mean.
 * Used for "vs average opponent" style ratings so results vary by the subject team
 * (home/away strength splits differ from a flat 1200 placeholder).
 */
export const buildLeagueAverageOpponent = (teams: Team[]): Team => {
	if (teams.length === 0) {
		return fallbackAverageOpponent()
	}

	const teamCount = teams.length
	const sumField = (getValue: (team: Team) => number) =>
		teams.reduce((acc, team) => acc + getValue(team), 0)
	const roundAvg = (getValue: (team: Team) => number) =>
		Math.round(sumField(getValue) / teamCount)

	return {
		id: SYNTHETIC_ID,
		name: 'League average',
		short_name: 'AVG',
		strength: roundAvg((team) => team.strength),
		strength_overall_home: roundAvg((team) => team.strength_overall_home),
		strength_overall_away: roundAvg((team) => team.strength_overall_away),
		strength_attack_home: roundAvg((team) => team.strength_attack_home),
		strength_attack_away: roundAvg((team) => team.strength_attack_away),
		strength_defence_home: roundAvg((team) => team.strength_defence_home),
		strength_defence_away: roundAvg((team) => team.strength_defence_away),
		pulse_id: 0,
		code: 0,
		form: '',
	}
}
