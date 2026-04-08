import { describe, expect, it } from 'vitest'

import type { Fixture } from '@/types/fixtures'
import type { Team } from '@/types/bootstrap'

import {
	getDefaultScheduleGameweek,
	groupFixturesForSchedule,
	localDateKeyFromKickoff,
} from './scheduleFixtures'

const teams: Team[] = [
	{
		id: 1,
		name: 'Arsenal',
		short_name: 'ARS',
		strength: 4,
		strength_overall_home: 1,
		strength_overall_away: 1,
		strength_attack_home: 1,
		strength_attack_away: 1,
		strength_defence_home: 1,
		strength_defence_away: 1,
		pulse_id: 1,
		code: 1,
		form: '0',
	},
	{
		id: 2,
		name: 'Chelsea',
		short_name: 'CHE',
		strength: 4,
		strength_overall_home: 1,
		strength_overall_away: 1,
		strength_attack_home: 1,
		strength_attack_away: 1,
		strength_defence_home: 1,
		strength_defence_away: 1,
		pulse_id: 2,
		code: 2,
		form: '0',
	},
	{
		id: 3,
		name: 'Brighton',
		short_name: 'BHA',
		strength: 3,
		strength_overall_home: 1,
		strength_overall_away: 1,
		strength_attack_home: 1,
		strength_attack_away: 1,
		strength_defence_home: 1,
		strength_defence_away: 1,
		pulse_id: 3,
		code: 3,
		form: '0',
	},
]

describe('getDefaultScheduleGameweek', () => {
	it('uses current gameweek when not finished', () => {
		expect(
			getDefaultScheduleGameweek([
				{ id: 1, is_current: false, is_next: false, is_finished: true },
				{ id: 2, is_current: true, is_next: false, is_finished: false },
			]),
		).toBe(2)
	})

	it('uses next when current is finished', () => {
		expect(
			getDefaultScheduleGameweek([
				{ id: 1, is_current: true, is_next: false, is_finished: true },
				{ id: 2, is_current: false, is_next: true, is_finished: false },
			]),
		).toBe(2)
	})
})

describe('groupFixturesForSchedule', () => {
	const mk = (partial: Partial<Fixture> & Pick<Fixture, 'id' | 'team_h' | 'team_a'>): Fixture => ({
		id: partial.id,
		event: 1,
		team_h: partial.team_h,
		team_a: partial.team_a,
		team_h_difficulty: 3,
		team_a_difficulty: 3,
		kickoff_time: partial.kickoff_time ?? null,
		started: false,
		finished: false,
		team_h_score: null,
		team_a_score: null,
	})

	it('sorts same kickoff by home name', () => {
		const fixtures: Fixture[] = [
			mk({
				id: 1,
				team_h: 2,
				team_a: 3,
				kickoff_time: '2025-08-17T14:00:00.000Z',
			}),
			mk({
				id: 2,
				team_h: 1,
				team_a: 3,
				kickoff_time: '2025-08-17T14:00:00.000Z',
			}),
		]
		const groups = groupFixturesForSchedule(fixtures, teams, 1)
		expect(groups).toHaveLength(1)
		expect(groups[0]!.rows.map((r) => r.homeName)).toEqual(['Arsenal', 'Chelsea'])
	})
})

describe('localDateKeyFromKickoff', () => {
	it('returns __tbc__ for null', () => {
		expect(localDateKeyFromKickoff(null)).toBe('__tbc__')
	})
})
