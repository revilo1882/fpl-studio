import type { Fixture, Fixtures, Team } from '@/types/fpl'
import { calculateDynamicFDR, pickDifficultyFromFDR } from '@/lib/fdr'

import type { DifficultyType } from './generateFixtureMatrix'

/**
 * Home/away FDR for a single fixture, aligned with the grid matrix (FPL vs Studio, Attack/Defence/Overall).
 */
export function getHomeAwayFdrForFixture(
	fixture: Fixture,
	teams: Team[],
	allFixtures: Fixtures,
	gameweek: number,
	difficultyType: DifficultyType,
): { home: number; away: number } {
	const teamMap = new Map(teams.map((t) => [t.id, t]))
	const homeTeam = teamMap.get(fixture.team_h)
	const awayTeam = teamMap.get(fixture.team_a)

	if (!homeTeam || !awayTeam) {
		return {
			home: fixture.team_h_difficulty,
			away: fixture.team_a_difficulty,
		}
	}

	if (difficultyType === 'FPL') {
		return {
			home: fixture.team_h_difficulty,
			away: fixture.team_a_difficulty,
		}
	}

	const homeFDR = calculateDynamicFDR(homeTeam, awayTeam, allFixtures, teams, true, gameweek)
	const awayFDR = calculateDynamicFDR(homeTeam, awayTeam, allFixtures, teams, false, gameweek)

	return {
		home: pickDifficultyFromFDR(homeFDR, difficultyType),
		away: pickDifficultyFromFDR(awayFDR, difficultyType),
	}
}
