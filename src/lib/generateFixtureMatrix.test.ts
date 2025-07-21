import { describe, it, expect } from 'vitest'

import type { Fixtures } from '@/types/fpl'

import { mockTeams, mockFixtures } from '../lib/test-mocks'

import { generateFixtureMatrix, type IGenerateFixtureMatrix } from './generateFixtureMatrix'

describe('generateFixtureMatrix', () => {
	it('returns an object with fixtureMatrix, teamNames, and scores', () => {
		const result: IGenerateFixtureMatrix = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		expect(result).toBeDefined()
		expect(result).toHaveProperty('fixtureMatrix')
		expect(result).toHaveProperty('teamNames')
		expect(result).toHaveProperty('scores')
	})

	it('returns the correct number of teams in fixtureMatrix and teamNames', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		expect(result.fixtureMatrix.length).toBe(mockTeams.length)
		expect(result.teamNames.length).toBe(mockTeams.length)
	})

	it('each team row in fixtureMatrix has correct number of gameweeks', () => {
		const gameweeks = 2
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: gameweeks,
			difficultyType: 'fpl',
		})
		for (const row of result.fixtureMatrix) {
			expect(row.length).toBe(gameweeks)
		}
	})

	it('scores array length matches number of teams', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		expect(result.scores.length).toBe(mockTeams.length)
		for (const score of result.scores) {
			expect(typeof score).toBe('number')
		}
	})

	it('handles empty fixtures gracefully', () => {
		const result = generateFixtureMatrix({
			fixtures: [],
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		expect(result.fixtureMatrix.length).toBe(mockTeams.length)
		for (const row of result.fixtureMatrix) {
			for (const cell of row) {
				expect(cell).toEqual([{ label: '-', difficulty: 0 }])
			}
		}
	})

	it('handles empty teams gracefully', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: [],
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		expect(result.fixtureMatrix.length).toBe(0)
		expect(result.teamNames.length).toBe(0)
		expect(result.scores.length).toBe(0)
	})

	it('handles double gameweeks (DGW) and stores multiple fixtures as an array', () => {
		const dgwFixtures: Fixtures = [
			...mockFixtures,
			{
				id: 1003,
				event: 1,
				team_a: 1,
				team_a_difficulty: 3,
				team_a_score: null,
				team_h: 2,
				team_h_difficulty: 4,
				team_h_score: null,
				kickoff_time: '2024-08-13T15:00:00Z',
				started: false,
				finished: false,
			},
		]
		const result = generateFixtureMatrix({
			fixtures: dgwFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		const hasDgw = result.fixtureMatrix.some((row) => row.some((cell) => cell.length > 1))
		expect(hasDgw).toBe(true)
	})

	it('matches the expected output snapshot', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'fpl',
		})
		expect(result).toMatchSnapshot()
	})
})
