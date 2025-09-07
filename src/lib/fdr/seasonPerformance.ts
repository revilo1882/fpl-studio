import type { Team, Fixtures } from '@/types/fpl'

import type { SeasonPerformance, TeamPerformanceData } from './types'

export async function calculateSeasonPerformance(
	teamId: number,
	fixtures: Fixtures,
	currentGameweek: number,
): Promise<SeasonPerformance> {
	const teamFixtures = fixtures
		.filter(
			(fixture) =>
				(fixture.team_h === teamId || fixture.team_a === teamId) &&
				fixture.finished === true &&
				fixture.team_h_score !== null &&
				fixture.team_a_score !== null &&
				(fixture.event || 0) < currentGameweek,
		)
		.sort((a, b) => (a.event || 0) - (b.event || 0))

	let points = 0,
		goalsFor = 0,
		goalsAgainst = 0
	let wins = 0,
		draws = 0,
		losses = 0
	const homeRecord = { w: 0, d: 0, l: 0, gf: 0, ga: 0 }
	const awayRecord = { w: 0, d: 0, l: 0, gf: 0, ga: 0 }

	for (const fixture of teamFixtures) {
		const isHome = fixture.team_h === teamId
		const gf = isHome ? fixture.team_h_score! : fixture.team_a_score!
		const ga = isHome ? fixture.team_a_score! : fixture.team_h_score!

		goalsFor += gf
		goalsAgainst += ga

		const record = isHome ? homeRecord : awayRecord
		record.gf += gf
		record.ga += ga

		if (gf > ga) {
			points += 3
			wins++
			record.w++
		} else if (gf === ga) {
			points += 1
			draws++
			record.d++
		} else {
			losses++
			record.l++
		}
	}

	const goalDifference = goalsFor - goalsAgainst
	const xPoints = Math.max(0, points + goalDifference * 0.1)

	return {
		points,
		goalsFor,
		goalsAgainst,
		gamesPlayed: teamFixtures.length,
		wins,
		draws,
		losses,
		homeRecord,
		awayRecord,
		xPoints,
		strengthTrend: 0,
	}
}

export async function calculateAllTeamsPerformance(
	teams: Team[],
	fixtures: Fixtures,
	currentGameweek: number,
): Promise<TeamPerformanceData[]> {
	const performancePromises = teams.map(async (team) => {
		const performance = await calculateSeasonPerformance(team.id, fixtures, currentGameweek)

		return {
			teamId: team.id,
			ppg: performance.gamesPlayed > 0 ? performance.points / performance.gamesPlayed : 0,
			gamesPlayed: performance.gamesPlayed,
			goalsFor: performance.goalsFor,
			goalsAgainst: performance.goalsAgainst,
			goalDifferencePerGame:
				performance.gamesPlayed > 0
					? (performance.goalsFor - performance.goalsAgainst) / performance.gamesPlayed
					: 0,
			homeRecord: {
				ppg:
					performance.homeRecord.w + performance.homeRecord.d + performance.homeRecord.l >
					0
						? (performance.homeRecord.w * 3 + performance.homeRecord.d) /
							(performance.homeRecord.w +
								performance.homeRecord.d +
								performance.homeRecord.l)
						: 0,
				games:
					performance.homeRecord.w + performance.homeRecord.d + performance.homeRecord.l,
			},
			awayRecord: {
				ppg:
					performance.awayRecord.w + performance.awayRecord.d + performance.awayRecord.l >
					0
						? (performance.awayRecord.w * 3 + performance.awayRecord.d) /
							(performance.awayRecord.w +
								performance.awayRecord.d +
								performance.awayRecord.l)
						: 0,
				games:
					performance.awayRecord.w + performance.awayRecord.d + performance.awayRecord.l,
			},
		}
	})

	return Promise.all(performancePromises)
}

export function calculateSeasonAdjustment(
	team: Team,
	performance: SeasonPerformance,
	allTeamsPerformance: TeamPerformanceData[],
	allTeams: Team[],
	currentGameweek: number,
	isHome: boolean,
): number {
	if (performance.gamesPlayed < 2) return 0

	const teamData = allTeamsPerformance.find((t) => t.teamId === team.id)
	if (!teamData) return 0

	const expectedPPG = calculateExpectedPPG(team, allTeams)
	const actualPPG = teamData.ppg

	const ppgDifference = actualPPG - expectedPPG
	const ppgAdjustment = Math.max(-0.8, Math.min(0.8, ppgDifference * 0.4))

	const teamsWithData = allTeamsPerformance.filter((t) => t.gamesPlayed >= 2)
	const avgGD =
		teamsWithData.length > 0
			? teamsWithData.reduce((sum, t) => sum + t.goalDifferencePerGame, 0) /
				teamsWithData.length
			: 0

	const gdDifference = teamData.goalDifferencePerGame - avgGD
	const gdAdjustment = Math.max(-0.4, Math.min(0.4, gdDifference * 0.2))

	let venueAdjustment = 0
	const relevantRecord = isHome ? teamData.homeRecord : teamData.awayRecord

	if (relevantRecord.games >= 2) {
		const venuePPGDifference = relevantRecord.ppg - teamData.ppg
		venueAdjustment = Math.max(-0.3, Math.min(0.3, venuePPGDifference * 0.3))
	}

	const sampleWeight = Math.min(1, performance.gamesPlayed / 8)
	const seasonWeight = Math.min(1, currentGameweek / 20)
	const confidenceWeight = (sampleWeight + seasonWeight) / 2

	const totalAdjustment = (ppgAdjustment + gdAdjustment + venueAdjustment) * confidenceWeight

	return Math.max(-1.0, Math.min(1.0, totalAdjustment))
}

function calculateExpectedPPG(team: Team, allTeams: Team[]): number {
	const teamStrengths = allTeams.map((t) => ({
		id: t.id,
		strength: (t.strength_overall_home + t.strength_overall_away) / 2,
	}))

	teamStrengths.sort((a, b) => b.strength - a.strength)

	const teamRank = teamStrengths.findIndex((t) => t.id === team.id) + 1
	const totalTeams = allTeams.length

	const rankPercentile = teamRank / totalTeams

	if (rankPercentile <= 0.3) {
		const topPosition = (rankPercentile - 0) / 0.3
		return 2.2 - topPosition * 0.4
	}

	if (rankPercentile <= 0.6) {
		const midPosition = (rankPercentile - 0.3) / 0.3
		return 1.8 - midPosition * 0.4
	}

	if (rankPercentile <= 0.8) {
		const lowerMidPosition = (rankPercentile - 0.6) / 0.2
		return 1.4 - lowerMidPosition * 0.3
	}

	const bottomPosition = (rankPercentile - 0.8) / 0.2
	return 1.1 - bottomPosition * 0.3
}
