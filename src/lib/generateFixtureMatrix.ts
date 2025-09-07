import type { Fixtures, Team, BootstrapData } from '@/types/fpl'

import { calculateAttractivenessScore } from './attractivenessScore'
import { calculateDynamicFDR } from './fdr/dynamicFDR'

export type SingleFixture = {
	label: string
	difficulty: number
	opponentName: string
	opponentCode: number
	isHome: boolean
	kickoffTime: string | null
	gameweekId: number
	confidenceInterval?: [number, number]
	confidenceScore?: number
	attractivenessScore?: number
}
export type FixtureCell = SingleFixture[]

export type IGenerateFixtureMatrix = {
	teamNames: string[]
	fixtureMatrix: FixtureCell[][]
	totalAttractivenessScores: number[]
	gameweekAttractivenessMatrix: number[][]
}

export type DifficultyType = 'FPL' | 'Overall' | 'Attack' | 'Defence'

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

	const studioFDRCache: Map<
		string,
		{ difficulty: number; confidenceInterval?: [number, number]; confidenceScore?: number }
	> = new Map()

	if (difficultyType !== 'FPL') {
		const fixturesForCalculation: Array<{
			homeTeam: Team
			awayTeam: Team
			gameweek: number
			fixtureId: number
		}> = []

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
						case 'Attack':
							homeDifficulty = homeFDR.attacking
							awayDifficulty = awayFDR.attacking
							break
						case 'Defence':
							homeDifficulty = homeFDR.defensive
							awayDifficulty = awayFDR.defensive
							break
						case 'Overall':
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
						isHome: true,
						kickoffTime: null,
						gameweekId: gameweek,
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
					if (difficultyType === 'FPL') {
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
					opponentCode: opponent?.code ?? 0,
					isHome,
					kickoffTime: fixture.kickoff_time,
					gameweekId: gameweek,
					confidenceInterval: calculatedConfidenceInterval,
					confidenceScore: calculatedConfidenceScore,
				}
			})

			row.push(fixturesForWeek)
		}

		return row
	})

	const gameweekAttractivenessMatrix: number[][] = fixtureMatrix.map((teamRow) => {
		return teamRow.map((gameweekFixtures) => {
			if (
				gameweekFixtures.length === 0 ||
				gameweekFixtures.every((f) => f.difficulty === 0)
			) {
				return 0
			}

			const validFixtures = gameweekFixtures.filter((f) => f.difficulty > 0)
			const avgDifficulty =
				validFixtures.reduce((sum, f) => sum + f.difficulty, 0) / validFixtures.length

			const rawScore = 6 - avgDifficulty

			const dgwBonus = calculateMultiFixtureBonus(validFixtures.length, avgDifficulty)

			return Number((rawScore + dgwBonus).toFixed(2))
		})
	})

	const totalAttractivenessScores: number[] = teams.map((_, teamIndex) => {
		const teamFixtures = fixtureMatrix[teamIndex]
		const attractivenessResult = calculateAttractivenessScore(teamFixtures)
		return attractivenessResult.totalScore
	})

	return {
		teamNames,
		fixtureMatrix,
		totalAttractivenessScores,
		gameweekAttractivenessMatrix,
	}
}

function calculateMultiFixtureBonus(numFixtures: number, avgDifficulty: number): number {
	if (numFixtures <= 1) return 0

	let bonus = 0

	if (numFixtures === 2) {
		if (avgDifficulty <= 2.5) bonus = 3.0
		else if (avgDifficulty <= 3.5) bonus = 2.0
		else if (avgDifficulty <= 4.0) bonus = 1.0
		else bonus = 0.5
	} else if (numFixtures >= 3) {
		if (avgDifficulty <= 3.0) bonus = 5.0
		else if (avgDifficulty <= 4.0) bonus = 3.5
		else bonus = 2.0
	}

	return bonus
}
