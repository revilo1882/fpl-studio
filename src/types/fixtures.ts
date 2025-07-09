export type Fixture = {
	id: number
	event: number | null
	team_h: number
	team_a: number
	team_h_difficulty: number
	team_a_difficulty: number
	kickoff_time: string | null
	started: boolean
	finished: boolean
	team_h_score: number | null
	team_a_score: number | null
}

export type Fixtures = Fixture[]
