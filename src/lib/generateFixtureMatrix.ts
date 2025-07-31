import type { Fixtures, Team, BootstrapData } from '@/types/fpl'

import { calculateAttractivenessScore } from './attractivenessScore'
import { calculateDynamicFDR } from './fdr/dynamicFDR'

export type SingleFixture = {
	label: string
	difficulty: number
	opponentName: string
	opponentCode: number // Add opponentCode for badge lookup
	isHome: boolean // Add isHome to know if the fixture is home or away for the current team
	kickoffTime: string | null
	gameweekId: number // Add gameweekId
	// Add confidence properties
	confidenceInterval?: [number, number]
	confidenceScore?: number
}

export type FixtureCell = SingleFixture[]

export type IGenerateFixtureMatrix = {
	teamNames: string[]
	fixtureMatrix: FixtureCell[][]
	scores: number[]
}

export type DifficultyType = 'fpl' | 'overall' | 'attack' | 'defence'

type GenerateFixtureMatrixProps = {
	teams: Team[]
	fixtures: Fixtures
	bootstrapData: BootstrapData
	firstGameweek: number
	numberOfGameweeks: number
	difficultyType: DifficultyType
}

export const generateFixtureMatrix = async ({
	teams,
	fixtures,
	firstGameweek,
	numberOfGameweeks,
	difficultyType,
}: GenerateFixtureMatrixProps): Promise<IGenerateFixtureMatrix> => {
	const teamMap = new Map(teams.map((team) => [team.id, team]))
	const teamNames = teams.map((team) => team.name)

	// For Studio views, pre-calculate FDR ratings
	const studioFDRCache: Map<
		string,
		{ difficulty: number; confidenceInterval?: [number, number]; confidenceScore?: number }
	> = new Map()

	if (difficultyType !== 'fpl') {
		const fixturesForCalculation: Array<{
			homeTeam: Team
			awayTeam: Team
			gameweek: number
			fixtureId: number
		}> = []

		// Collect all fixtures that need calculation within the requested gameweek range
		for (
			let gameweek = firstGameweek;
			gameweek < firstGameweek + numberOfGameweeks;
			gameweek++
		) {
			const gameweekFixtures = fixtures.filter((fixture) => fixture.event === gameweek)

			for (const fixture of gameweekFixtures) {
				const homeTeam = teamMap.get(fixture.team_h)
				const awayTeam = teamMap.get(fixture.team_a)

				if (homeTeam && awayTeam) {
					fixturesForCalculation.push({
						homeTeam,
						awayTeam,
						gameweek,
						fixtureId: fixture.id,
					})
				}
			}
		}

		// Calculate simplified FDR for all collected fixtures
		try {
			const fdrResults = await Promise.all(
				fixturesForCalculation.map(async ({ homeTeam, awayTeam, gameweek, fixtureId }) => {
					const [homeFDR, awayFDR] = await Promise.all([
						calculateDynamicFDR(homeTeam, awayTeam, fixtures, teams, true, gameweek),
						calculateDynamicFDR(homeTeam, awayTeam, fixtures, teams, false, gameweek),
					])

					let homeDifficulty: number
					let awayDifficulty: number

					switch (difficultyType) {
						case 'attack':
							homeDifficulty = homeFDR.attacking
							awayDifficulty = awayFDR.attacking
							break
						case 'defence':
							homeDifficulty = homeFDR.defensive
							awayDifficulty = awayFDR.defensive
							break
						case 'overall':
						default:
							homeDifficulty = homeFDR.overall
							awayDifficulty = awayFDR.overall
							break
					}

					return {
						homeKey: `${homeTeam.id}-${fixtureId}-${gameweek}`,
						awayKey: `${awayTeam.id}-${fixtureId}-${gameweek}`,
						homeDifficulty,
						awayDifficulty,
						homeConfidenceInterval: homeFDR.confidenceInterval.overall,
						homeConfidenceScore: homeFDR.confidenceInterval.confidenceScore,
						awayConfidenceInterval: awayFDR.confidenceInterval.overall,
						awayConfidenceScore: awayFDR.confidenceInterval.confidenceScore,
					}
				}),
			)

			// Cache the results
			for (const {
				homeKey,
				awayKey,
				homeDifficulty,
				awayDifficulty,
				homeConfidenceInterval,
				homeConfidenceScore,
				awayConfidenceInterval,
				awayConfidenceScore,
			} of fdrResults) {
				studioFDRCache.set(homeKey, {
					difficulty: homeDifficulty,
					confidenceInterval: homeConfidenceInterval,
					confidenceScore: homeConfidenceScore,
				})
				studioFDRCache.set(awayKey, {
					difficulty: awayDifficulty,
					confidenceInterval: awayConfidenceInterval,
					confidenceScore: awayConfidenceScore,
				})
			}
		} catch (error) {
			console.error('Error calculating simplified FDR, falling back to FPL ratings:', error)
		}
	}

	const fixtureMatrix: FixtureCell[][] = teams.map((team) => {
		const row: FixtureCell[] = []

		for (
			let gameweek = firstGameweek;
			gameweek < firstGameweek + numberOfGameweeks;
			gameweek++
		) {
			const teamFixtures = fixtures
				.filter(
					(fixture) =>
						fixture.event === gameweek &&
						(fixture.team_h === team.id || fixture.team_a === team.id),
				)
				.sort(
					(a, b) =>
						new Date(a.kickoff_time ?? '').getTime() -
						new Date(b.kickoff_time ?? '').getTime(),
				)

			if (teamFixtures.length === 0) {
				row.push([
					{
						label: '-',
						difficulty: 0,
						opponentName: 'Blank',
						opponentCode: 0,
						isHome: true, // Default, doesn't matter for blank
						kickoffTime: null,
						gameweekId: gameweek, // Ensure gameweekId is set for blank
					},
				])
				continue
			}

			const fixturesForWeek: FixtureCell = teamFixtures.map((fixture) => {
				const isHome = fixture.team_h === team.id
				const opponentId = isHome ? fixture.team_a : fixture.team_h
				const opponent = teamMap.get(opponentId)
				const opponentShort = opponent?.short_name ?? '?'
				const label = `${opponentShort} (${isHome ? 'H' : 'A'})`

				let difficulty: number
				let calculatedConfidenceInterval: [number, number] | undefined
				let calculatedConfidenceScore: number | undefined

				if (!opponent) {
					difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty
				} else {
					if (difficultyType === 'fpl') {
						difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty
					} else {
						const teamSpecificKey = `${team.id}-${fixture.id}-${gameweek}`
						const cachedData = studioFDRCache.get(teamSpecificKey)

						if (cachedData !== undefined) {
							difficulty = cachedData.difficulty
							calculatedConfidenceInterval = cachedData.confidenceInterval
							calculatedConfidenceScore = cachedData.confidenceScore
						} else {
							difficulty = isHome
								? fixture.team_h_difficulty
								: fixture.team_a_difficulty
							console.warn(
								`No calculated difficulty for ${teamSpecificKey}, using FPL rating`,
							)
						}
					}
				}

				return {
					label,
					difficulty: Number(difficulty.toFixed(2)),
					opponentName: opponent?.name ?? 'Unknown',
					opponentCode: opponent?.code ?? 0, // Pass opponent code
					isHome, // Pass if it's a home fixture for the current team
					kickoffTime: fixture.kickoff_time,
					gameweekId: gameweek, // Pass gameweek ID
					confidenceInterval: calculatedConfidenceInterval,
					confidenceScore: calculatedConfidenceScore,
				}
			})

			row.push(fixturesForWeek)
		}

		return row
	})

	// Calculate improved attractiveness scores
	const scores: number[] = teams.map((_, teamIndex) => {
		const teamFixtures = fixtureMatrix[teamIndex]
		const attractivenessResult = calculateAttractivenessScore(teamFixtures)
		return attractivenessResult.totalScore
	})

	return { teamNames, fixtureMatrix, scores }
}
