import { describe, it, expect } from 'vitest'

import { mockTeams, mockFixtures, mockBootstrapData } from '../lib/test-mocks'

import { generateFixtureMatrix } from './generateFixtureMatrix'

const allDifficultyTypes = ['fpl', 'overall', 'attack', 'defence'] as const

describe('generateFixtureMatrix', () => {
	it.each(allDifficultyTypes)(
		'returns correct structure for difficultyType = %s',
		async (difficultyType) => {
			const result = await generateFixtureMatrix({
				fixtures: mockFixtures,
				teams: mockTeams,
				bootstrapData: mockBootstrapData,
				firstGameweek: 1,
				numberOfGameweeks: 2,
				difficultyType,
			})

			expect(result.teamNames).toEqual(mockTeams.map((t) => t.name))
			expect(result.fixtureMatrix.length).toBe(mockTeams.length)
			expect(result.totalAttractivenessScores.length).toBe(mockTeams.length)

			for (const row of result.fixtureMatrix) {
				expect(row.length).toBe(2)
				for (const gameweek of row) {
					for (const fixture of gameweek) {
						expect(typeof fixture.label).toBe('string')
						expect(typeof fixture.difficulty).toBe('number')
						expect(typeof fixture.opponentName).toBe('string')
						expect(fixture.difficulty >= 0 && fixture.difficulty <= 5).toBe(true)
					}
				}
			}
		},
	)

	it('returns empty matrix when no fixtures exist', async () => {
		const result = await generateFixtureMatrix({
			fixtures: [],
			teams: mockTeams,
			bootstrapData: mockBootstrapData,
			firstGameweek: 1,
			numberOfGameweeks: 3,
			difficultyType: 'fpl',
		})

		expect(result.teamNames.length).toBe(mockTeams.length)
		expect(result.fixtureMatrix.length).toBe(mockTeams.length)
		expect(result.totalAttractivenessScores.length).toBe(mockTeams.length)

		for (const row of result.fixtureMatrix) {
			expect(row.length).toBe(3)
			for (const cell of row) {
				expect(Array.isArray(cell)).toBe(true)
				expect(cell).toHaveLength(1)
				const placeholder = cell[0]
				expect(placeholder.label).toBe('-')
				expect(placeholder.opponentName).toBe('Blank')
				expect(placeholder.difficulty).toBe(0)
				expect(placeholder.kickoffTime).toBeNull()
			}
		}
	})
})
