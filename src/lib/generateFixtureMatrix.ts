import type { Fixtures, Team } from '@/types/fpl'

export type SingleFixture = {
	label: string
	difficulty: number
}

export type FixtureCell = SingleFixture[]

type IGenerateFixtureMatrix = {
	teamNames: string[]
	fixtureMatrix: FixtureCell[][]
	averages: number[]
}

type GenerateFixtureMatrixProps = {
	teams: Team[]
	fixtures: Fixtures
	firstGameweek: number
	numberOfGameweeks: number
}

export const generateFixtureMatrix = ({
	teams,
	fixtures,
	firstGameweek,
	numberOfGameweeks,
}: GenerateFixtureMatrixProps): IGenerateFixtureMatrix => {
	const teamMap = new Map(teams.map((team) => [team.id, team]))
	const teamNames = teams.map((team) => team.name)
	const averages: number[] = []

	const fixtureMatrix: FixtureCell[][] = teams.map((team) => {
		const row: FixtureCell[] = []
		let totalDifficulty = 0
		let fixtureCount = 0

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
				const opponentShort = teamMap.get(opponentId)?.short_name ?? '?'
				const label = `${opponentShort} (${isHome ? 'H' : 'A'})`
				const difficulty = isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty

				totalDifficulty += difficulty
				fixtureCount++

				return { label, difficulty }
			})

			row.push(fixturesForWeek)
		}

		const averageDifficulty = fixtureCount > 0 ? totalDifficulty / fixtureCount : 0
		averages.push(parseFloat(averageDifficulty.toFixed(2)))

		return row
	})

	return { teamNames, fixtureMatrix, averages }
}
