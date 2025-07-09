import { describe, it, expect } from 'vitest'

import type { Team, Fixtures } from '@/types/fpl'

import { generateFixtureMatrix, type IGenerateFixtureMatrix } from './generateFixtureMatrix'

const teams: Team[] = [
	{
		id: 1,
		name: 'Arsenal',
		short_name: 'ARS',
		strength: 4,
	},
	{
		id: 2,
		name: 'Man City',
		short_name: 'MCI',
		strength: 5,
	},
]

const fixtures: Fixtures = [
	{
		id: 1001,
		event: 1,
		team_a: 2,
		team_a_difficulty: 2,
		team_a_score: null,
		team_h: 1,
		team_h_difficulty: 3,
		team_h_score: null,
		kickoff_time: '2024-08-12T15:00:00Z',
		started: false,
		finished: false,
	},
	{
		id: 1002,
		event: 2,
		team_a: 1,
		team_a_difficulty: 1,
		team_a_score: null,
		team_h: 2,
		team_h_difficulty: 4,
		team_h_score: null,
		kickoff_time: '2024-08-19T15:00:00Z',
		started: false,
		finished: false,
	},
]

describe('generateFixtureMatrix', () => {
	it('returns an object with fixtureMatrix, teamNames, and averages', () => {
		const result: IGenerateFixtureMatrix = generateFixtureMatrix({
			fixtures,
			teams,
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
			fixtures,
			teams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result.fixtureMatrix.length).toBe(teams.length)
		expect(result.teamNames.length).toBe(teams.length)
	})

	it('each team row in fixtureMatrix has correct number of gameweeks', () => {
		const gameweeks = 2
		const result = generateFixtureMatrix({
			fixtures,
			teams,
			firstGameweek: 1,
			numberOfGameweeks: gameweeks,
		})
		for (const row of result.fixtureMatrix) {
			expect(row.length).toBe(gameweeks)
		}
	})

	it('averages array length matches number of teams', () => {
		const result = generateFixtureMatrix({
			fixtures,
			teams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result.averages.length).toBe(teams.length)
		for (const avg of result.averages) {
			expect(typeof avg).toBe('number')
		}
	})

	it('handles empty fixtures gracefully', () => {
		const result = generateFixtureMatrix({
			fixtures: [],
			teams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result.fixtureMatrix.length).toBe(teams.length)
		for (const row of result.fixtureMatrix) {
			for (const cell of row) {
				expect(cell).toEqual([{ label: '-', difficulty: 0 }])
			}
		}
		// Averages should all be 0 or whatever your function returns for empty
	})

	it('handles empty teams gracefully', () => {
		const result = generateFixtureMatrix({
			fixtures,
			teams: [],
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result.fixtureMatrix.length).toBe(0)
		expect(result.teamNames.length).toBe(0)
		expect(result.averages.length).toBe(0)
	})

	it('returns correct output for single gameweek', () => {
		const result = generateFixtureMatrix({
			fixtures,
			teams,
			firstGameweek: 2,
			numberOfGameweeks: 1,
		})
		expect(result.fixtureMatrix.length).toBe(teams.length)
		for (const row of result.fixtureMatrix) {
			expect(row.length).toBe(1)
		}
	})

	it('handles double gameweeks (multiple fixtures for one team in one GW)', () => {
		const dgFixtures: Fixtures = [
			...fixtures,
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
			fixtures: dgFixtures,
			teams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result.fixtureMatrix.length).toBe(teams.length)
		expect(Array.isArray(result.fixtureMatrix[0][0])).toBe(true)
	})

	it('matches the expected output snapshot', () => {
		const result = generateFixtureMatrix({
			fixtures,
			teams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})
		expect(result).toMatchSnapshot()
	})

	it('handles double gameweeks (DGW) and stores multiple fixtures as an array in the matrix cell', () => {
		const dgFixtures: Fixtures = [
			{
				id: 1001,
				event: 1,
				team_a: 2,
				team_a_difficulty: 2,
				team_a_score: null,
				team_h: 1,
				team_h_difficulty: 3,
				team_h_score: null,
				kickoff_time: '2024-08-12T15:00:00Z',
				started: false,
				finished: false,
			},
			{
				id: 1002,
				event: 2,
				team_a: 1,
				team_a_difficulty: 1,
				team_a_score: null,
				team_h: 2,
				team_h_difficulty: 4,
				team_h_score: null,
				kickoff_time: '2024-08-19T15:00:00Z',
				started: false,
				finished: false,
			},
			{
				id: 1003,
				event: 1, // Second fixture for Arsenal in GW1 (DGW)
				team_a: 1,
				team_a_difficulty: 2,
				team_a_score: null,
				team_h: 2,
				team_h_difficulty: 4,
				team_h_score: null,
				kickoff_time: '2024-08-13T19:00:00Z',
				started: false,
				finished: false,
			},
		]

		const result = generateFixtureMatrix({
			fixtures: dgFixtures,
			teams: [
				{
					id: 1,
					name: 'Arsenal',
					short_name: 'ARS',
					strength: 4,
				},
				{
					id: 2,
					name: 'Man City',
					short_name: 'MCI',
					strength: 5,
				},
			],
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})

		expect(result.fixtureMatrix.length).toBe(2)
		expect(result.teamNames).toEqual(['Arsenal', 'Man City'])
		expect(Array.isArray(result.fixtureMatrix[0][0])).toBe(true) // Arsenal's GW1
		expect(result.fixtureMatrix[0][0].length).toBe(2) // Two fixtures for Arsenal in GW1
		expect(Array.isArray(result.fixtureMatrix[1][0])).toBe(true) // Man City's GW1 fixtures (should be one)
		expect(result.fixtureMatrix[1][0].length).toBe(2)

		expect(result.fixtureMatrix[0][0][0]).toHaveProperty('difficulty')
		expect(result.averages.length).toBe(2)
		expect(typeof result.averages[0]).toBe('number')
		expect(typeof result.averages[1]).toBe('number')
	})

	it('handles triple gameweeks (TGW) for a team', () => {
		const tgwFixtures: Fixtures = [
			// Arsenal with three fixtures in GW1
			{
				id: 2001,
				event: 1,
				team_a: 2,
				team_a_difficulty: 2,
				team_a_score: null,
				team_h: 1,
				team_h_difficulty: 3,
				team_h_score: null,
				kickoff_time: '2024-08-12T15:00:00Z',
				started: false,
				finished: false,
			},
			{
				id: 2002,
				event: 1,
				team_a: 3,
				team_a_difficulty: 4,
				team_a_score: null,
				team_h: 1,
				team_h_difficulty: 3,
				team_h_score: null,
				kickoff_time: '2024-08-13T19:00:00Z',
				started: false,
				finished: false,
			},
			{
				id: 2003,
				event: 1,
				team_a: 1,
				team_a_difficulty: 3,
				team_a_score: null,
				team_h: 4,
				team_h_difficulty: 4,
				team_h_score: null,
				kickoff_time: '2024-08-14T19:00:00Z',
				started: false,
				finished: false,
			},
		]

		const multiTeams: Team[] = [
			{ id: 1, name: 'Arsenal', short_name: 'ARS', strength: 4 },
			{ id: 2, name: 'Man City', short_name: 'MCI', strength: 5 },
			{ id: 3, name: 'Chelsea', short_name: 'CHE', strength: 4 },
			{ id: 4, name: 'Spurs', short_name: 'TOT', strength: 4 },
		]

		const result = generateFixtureMatrix({
			fixtures: tgwFixtures,
			teams: multiTeams,
			firstGameweek: 1,
			numberOfGameweeks: 1,
		})

		// Arsenal should have 3 fixtures in GW1
		expect(result.fixtureMatrix[0][0].length).toBe(3)

		// Other teams should have at least one, or possibly empty depending on fixture data
		expect(Array.isArray(result.fixtureMatrix[1][0])).toBe(true)
	})

	it('calculates correct difficulty values in matrix', () => {
		const result = generateFixtureMatrix({
			fixtures,
			teams,
			firstGameweek: 1,
			numberOfGameweeks: 2,
		})

		const arsenalGW1Fixtures = result.fixtureMatrix[0][0]
		expect(Array.isArray(arsenalGW1Fixtures)).toBe(true)

		expect(arsenalGW1Fixtures.length).toBe(1)
		expect(arsenalGW1Fixtures[0].difficulty).toBe(3)

		const manCityGW1Fixtures = result.fixtureMatrix[1][0]
		expect(Array.isArray(manCityGW1Fixtures)).toBe(true)
		expect(manCityGW1Fixtures.length).toBe(1)
		expect(manCityGW1Fixtures[0].difficulty).toBe(2)
	})

	it('handles a blank gameweek for a team', () => {
		const blankGWFixtures: Fixtures = [
			{
				id: 3001,
				event: 1,
				team_a: 2,
				team_a_difficulty: 2,
				team_a_score: null,
				team_h: 1,
				team_h_difficulty: 3,
				team_h_score: null,
				kickoff_time: '2024-08-12T15:00:00Z',
				started: false,
				finished: false,
			},
			// No event 2 fixtures for any team
		]

		const multiTeams: Team[] = [
			{ id: 1, name: 'Arsenal', short_name: 'ARS', strength: 4 },
			{ id: 2, name: 'Man City', short_name: 'MCI', strength: 5 },
			{ id: 3, name: 'Chelsea', short_name: 'CHE', strength: 4 },
		]

		const result = generateFixtureMatrix({
			fixtures: blankGWFixtures,
			teams: multiTeams,
			firstGameweek: 2, // GW2 has no fixtures!
			numberOfGameweeks: 1,
		})

		// All teams should have the default "blank" cell in GW2
		multiTeams.forEach((_, idx) => {
			expect(result.fixtureMatrix[idx][0]).toEqual([{ label: '-', difficulty: 0 }])
		})
	})

	it('handles fixtures with finished games and scores', () => {
		const scoredFixtures: Fixtures = [
			{
				id: 4001,
				event: 1,
				team_a: 2,
				team_a_difficulty: 2,
				team_a_score: 2,
				team_h: 1,
				team_h_difficulty: 3,
				team_h_score: 1,
				kickoff_time: '2024-08-12T15:00:00Z',
				started: true,
				finished: true,
			},
		]

		const twoTeams: Team[] = [
			{ id: 1, name: 'Arsenal', short_name: 'ARS', strength: 4 },
			{ id: 2, name: 'Man City', short_name: 'MCI', strength: 5 },
		]

		const result = generateFixtureMatrix({
			fixtures: scoredFixtures,
			teams: twoTeams,
			firstGameweek: 1,
			numberOfGameweeks: 1,
		})

		expect(result.fixtureMatrix[0][0][0]).toMatchObject({
			label: 'MCI (H)',
			difficulty: 3,
		})
		expect(result.fixtureMatrix[1][0][0]).toEqual({
			label: 'ARS (A)',
			difficulty: 2,
		})
	})
})
