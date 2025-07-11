import { describe, it, expect } from 'vitest'

import type { Fixtures } from '@/types/fpl'

import { mockTeams, mockFixtures } from '../lib/test-mocks'

import { generateFixtureMatrix, type IGenerateFixtureMatrix } from './generateFixtureMatrix'

describe('generateFixtureMatrix', () => {
	it('returns an object with fixtureMatrix, teamNames, and averages', () => {
		const result: IGenerateFixtureMatrix = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result).toBeDefined()
		expect(result).toHaveProperty('fixtureMatrix')
		expect(result).toHaveProperty('teamNames')
		expect(result).toHaveProperty('averages')
	})

	it('returns the correct number of teams in fixtureMatrix and teamNames', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
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
		})
		for (const row of result.fixtureMatrix) {
			expect(row.length).toBe(gameweeks)
		}
	})

	it('averages array length matches number of teams', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result.averages.length).toBe(mockTeams.length)
		for (const avg of result.averages) {
			expect(typeof avg).toBe('number')
		}
	})

	it('handles empty fixtures gracefully', () => {
		const result = generateFixtureMatrix({
			fixtures: [],
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
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
		})
		expect(result.fixtureMatrix.length).toBe(0)
		expect(result.teamNames.length).toBe(0)
		expect(result.averages.length).toBe(0)
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
		})
		// Test that at least one gameweek cell contains more than one fixture
		const hasDgw = result.fixtureMatrix.some((row) => row.some((cell) => cell.length > 1))
		expect(hasDgw).toBe(true)
	})

	it('matches the expected output snapshot', () => {
		const result = generateFixtureMatrix({
			fixtures: mockFixtures,
			teams: mockTeams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		// You will need to run `vitest --update` to update the snapshot
		expect(result).toMatchSnapshot()
	})
})
