import type { Fixtures, Team, BootstrapData } from '@/types/fpl'

import { calculateDynamicFDR, pickDifficultyFromFDR } from '../fdr'

import { calculateAttractivenessScore, calculateMultiFixtureBonus } from './attractivenessScore'

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

type StudioFdrCache = Map<
	string,
	{ difficulty: number; confidenceInterval?: [number, number]; confidenceScore?: number }
>


const fillStudioFdrCache = (
	teamMap: Map<number, Team>,
	teams: Team[],
	fixtures: Fixtures,
	firstGameweek: number,
	numberOfGameweeks: number,
	difficultyType: DifficultyType,
	onlyTeamId?: number,
): StudioFdrCache => {
	const studioFDRCache: StudioFdrCache = new Map()

	if (difficultyType === 'FPL') {
		return studioFDRCache
	}

	try {
		for (
			let gameweek = firstGameweek;
			gameweek < firstGameweek + numberOfGameweeks;
			gameweek++
		) {
			const gameweekFixtures = fixtures.filter((fixture) => fixture.event === gameweek)

			for (const fixture of gameweekFixtures) {
				if (
					onlyTeamId !== undefined &&
					fixture.team_h !== onlyTeamId &&
					fixture.team_a !== onlyTeamId
				) {
					continue
				}

				const homeTeam = teamMap.get(fixture.team_h)
				const awayTeam = teamMap.get(fixture.team_a)

				if (!homeTeam || !awayTeam) continue

				const homeFDR = calculateDynamicFDR(
					homeTeam,
					awayTeam,
					fixtures,
					teams,
					true,
					gameweek,
				)
				const awayFDR = calculateDynamicFDR(
					homeTeam,
					awayTeam,
					fixtures,
					teams,
					false,
					gameweek,
				)

			const homeDifficulty = pickDifficultyFromFDR(homeFDR, difficultyType)
			const awayDifficulty = pickDifficultyFromFDR(awayFDR, difficultyType)

				const homeKey = `${homeTeam.id}-${fixture.id}-${gameweek}`
				const awayKey = `${awayTeam.id}-${fixture.id}-${gameweek}`

				studioFDRCache.set(homeKey, {
					difficulty: homeDifficulty,
					confidenceInterval: homeFDR.confidenceInterval.overall,
					confidenceScore: homeFDR.confidenceInterval.confidenceScore,
				})
				studioFDRCache.set(awayKey, {
					difficulty: awayDifficulty,
					confidenceInterval: awayFDR.confidenceInterval.overall,
					confidenceScore: awayFDR.confidenceInterval.confidenceScore,
				})
			}
		}
	} catch (error) {
		console.error('Error calculating simplified FDR, falling back to FPL ratings:', error)
	}

	return studioFDRCache
}

const buildFixtureRowForTeam = (
	team: Team,
	teamMap: Map<number, Team>,
	fixtures: Fixtures,
	firstGameweek: number,
	numberOfGameweeks: number,
	difficultyType: DifficultyType,
	studioFDRCache: StudioFdrCache,
): FixtureCell[] => {
	const row: FixtureCell[] = []

	for (let gameweek = firstGameweek; gameweek < firstGameweek + numberOfGameweeks; gameweek++) {
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
						difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty
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
}

/** Full-season (or window) fixture row for one club — same cells as `generateFixtureMatrix` but ~20× fewer FDR evaluations. */
export const generateTeamFixtureRow = (
	params: GenerateFixtureMatrixProps & { teamId: number },
): FixtureCell[] => {
	const { teamId, teams, fixtures, firstGameweek, numberOfGameweeks, difficultyType } = params
	const teamMap = new Map(teams.map((t) => [t.id, t]))
	const team = teamMap.get(teamId)
	if (!team) {
		return []
	}

	const studioFDRCache = fillStudioFdrCache(
		teamMap,
		teams,
		fixtures,
		firstGameweek,
		numberOfGameweeks,
		difficultyType,
		teamId,
	)

	return buildFixtureRowForTeam(
		team,
		teamMap,
		fixtures,
		firstGameweek,
		numberOfGameweeks,
		difficultyType,
		studioFDRCache,
	)
}

export const generateFixtureMatrix = ({
	teams,
	fixtures,
	firstGameweek,
	numberOfGameweeks,
	difficultyType,
}: GenerateFixtureMatrixProps): IGenerateFixtureMatrix => {
	const teamMap = new Map(teams.map((team) => [team.id, team]))
	const teamNames = teams.map((team) => team.name)

	const studioFDRCache = fillStudioFdrCache(
		teamMap,
		teams,
		fixtures,
		firstGameweek,
		numberOfGameweeks,
		difficultyType,
	)

	const fixtureMatrix: FixtureCell[][] = teams.map((team) =>
		buildFixtureRowForTeam(
			team,
			teamMap,
			fixtures,
			firstGameweek,
			numberOfGameweeks,
			difficultyType,
			studioFDRCache,
		),
	)

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
