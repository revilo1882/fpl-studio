import { describe, expect, it } from 'vitest'

import type { Fixture } from '@/types/fixtures'
import type { Team } from '@/types/bootstrap'

import { getHomeAwayFdrForFixture } from './scheduleFdr'

const team = (id: number, name: string): Team => ({
	id,
	name,
	short_name: name.slice(0, 3).toUpperCase(),
	strength: 3,
	strength_overall_home: 1200,
	strength_overall_away: 1200,
	strength_attack_home: 1200,
	strength_attack_away: 1200,
	strength_defence_home: 1200,
	strength_defence_away: 1200,
	pulse_id: id,
	code: id,
	form: '0',
})

const teams: Team[] = [team(1, 'Alpha'), team(2, 'Beta')]

const baseFixture: Fixture = {
	id: 99,
	event: 1,
	team_h: 1,
	team_a: 2,
	team_h_difficulty: 2,
	team_a_difficulty: 4,
	kickoff_time: '2025-08-17T12:30:00.000Z',
	started: false,
	finished: false,
	team_h_score: null,
	team_a_score: null,
}

describe('getHomeAwayFdrForFixture', () => {
	it('returns FPL difficulties when type is FPL', () => {
		const r = getHomeAwayFdrForFixture(baseFixture, teams, [baseFixture], 1, 'FPL')
		expect(r.home).toBe(2)
		expect(r.away).toBe(4)
	})
})
