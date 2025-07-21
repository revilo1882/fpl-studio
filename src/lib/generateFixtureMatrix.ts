import type { Fixtures, Team } from '@/types/fpl'

export type SingleFixture = {
	label: string
	difficulty: number
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
	firstGameweek: number
	numberOfGameweeks: number
	difficultyType: DifficultyType
}

function normalize(value: number, min: number, max: number): number {
	if (max === min) return 3
	const scaled = 1 + (4 * (value - min)) / (max - min)
	return parseFloat(scaled.toFixed(2))
}

// Calculates a score multiplier based on fixture difficulty.
// An easy fixture (1) gets a high multiplier, a hard fixture (5) gets a low one.
function getAttractivenessMultiplier(difficulty: number): number {
	if (difficulty <= 1) return 1.5
	if (difficulty >= 5) return 0.5
	// Linear scaling between 1 and 5
	return 1.5 - (difficulty - 1) * 0.25
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
	const scores: number[] = []

	const minOverall = Math.min(
		...teams.flatMap((t) => [t.strength_overall_home, t.strength_overall_away]),
	)
	const maxOverall = Math.max(
		...teams.flatMap((t) => [t.strength_overall_home, t.strength_overall_away]),
	)
	const minAttack = Math.min(
		...teams.flatMap((t) => [t.strength_attack_home, t.strength_attack_away]),
	)
	const maxAttack = Math.max(
		...teams.flatMap((t) => [t.strength_attack_home, t.strength_attack_away]),
	)
	const minDefence = Math.min(
		...teams.flatMap((t) => [t.strength_defence_home, t.strength_defence_away]),
	)
	const maxDefence = Math.max(
		...teams.flatMap((t) => [t.strength_defence_home, t.strength_defence_away]),
	)

	const fixtureMatrix: FixtureCell[][] = teams.map((team) => {
		const row: FixtureCell[] = []
		let totalAttractivenessScore = 0

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
				row.push([{ label: '-', difficulty: 0 }])
				continue
			}

			const fixturesForWeek: FixtureCell = teamFixtures.map((fixture) => {
				const isHome = fixture.team_h === team.id
				const opponentId = isHome ? fixture.team_a : fixture.team_h
				const opponent = teamMap.get(opponentId)
				const opponentShort = opponent?.short_name ?? '?'
				const label = `${opponentShort} (${isHome ? 'H' : 'A'})`

				let difficulty: number

				if (!opponent) {
					difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty
				} else {
					switch (difficultyType) {
						case 'fpl': {
							difficulty = isHome
								? fixture.team_h_difficulty
								: fixture.team_a_difficulty
							break
						}
						case 'attack': {
							const opponentStrength = isHome
								? opponent.strength_defence_home
								: opponent.strength_defence_away
							difficulty = normalize(opponentStrength, minDefence, maxDefence)
							break
						}
						case 'defence': {
							const opponentStrength = isHome
								? opponent.strength_attack_home
								: opponent.strength_attack_away
							difficulty = normalize(opponentStrength, minAttack, maxAttack)
							break
						}
						case 'overall':
						default: {
							const opponentStrength = isHome
								? opponent.strength_overall_home
								: opponent.strength_overall_away
							difficulty = normalize(opponentStrength, minOverall, maxOverall)
							break
						}
					}
				}

				if (difficulty > 0) {
					totalAttractivenessScore += getAttractivenessMultiplier(difficulty)
				}

				return { label, difficulty }
			})

			row.push(fixturesForWeek)
		}

		scores.push(parseFloat(totalAttractivenessScore.toFixed(2)))

		return row
	})

	return { teamNames, fixtureMatrix, scores }
}
