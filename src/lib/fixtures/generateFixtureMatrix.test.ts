import { describe, it, expect } from 'vitest'

import { mockTeams, mockFixtures, mockBootstrapData } from '../test-mocks'

import { generateFixtureMatrix, generateTeamFixtureRow } from './generateFixtureMatrix'

const allDifficultyTypes = ['FPL', 'Overall', 'Attack', 'Defence'] as const

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
			difficultyType: 'FPL',
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

describe('generateTeamFixtureRow', () => {
	it.each(allDifficultyTypes)(
		'matches full matrix row for difficultyType = %s',
		async (difficultyType) => {
			const firstGameweek = 1
			const numberOfGameweeks = 2
			const teamId = mockTeams[0]!.id

			const [full, single] = await Promise.all([
				generateFixtureMatrix({
					fixtures: mockFixtures,
					teams: mockTeams,
					bootstrapData: mockBootstrapData,
					firstGameweek,
					numberOfGameweeks,
					difficultyType,
				}),
				generateTeamFixtureRow({
					teamId,
					fixtures: mockFixtures,
					teams: mockTeams,
					bootstrapData: mockBootstrapData,
					firstGameweek,
					numberOfGameweeks,
					difficultyType,
				}),
			])

			expect(single).toEqual(full.fixtureMatrix[0])
		},
	)

	it('returns [] for unknown team id', async () => {
		const row = await generateTeamFixtureRow({
			teamId: 99999,
			fixtures: mockFixtures,
			teams: mockTeams,
			bootstrapData: mockBootstrapData,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'FPL',
		})
		expect(row).toEqual([])
	})
})
