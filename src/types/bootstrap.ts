export type BootstrapData = {
	elements: Player[]
	teams: Team[]
	element_types: ElementType[]
	events: Gameweek[]
	game_settings: GameSettings
	total_players: number
}

export type Player = {
	id: number
	first_name: string
	second_name: string
	web_name: string
	team: number
	element_type: number
	now_cost: number
	selected_by_percent: string
	total_points: number
	form: string
}

export type Team = {
	id: number
	name: string
	short_name: string
	strength: number
	strength_overall_home: number
	strength_overall_away: number
	strength_attack_home: number
	strength_attack_away: number
	strength_defence_home: number
	strength_defence_away: number
	pulse_id: number
}

export type ElementType = {
	id: number
	singular_name: string
	squad_select: number
	squad_min_play: number
}

export type Gameweek = {
	id: number
	name: string
	deadline_time: string
	average_entry_score: number
	highest_scoring_entry: number | null
	most_captained: number | null
	is_next: boolean
	is_current: boolean
	is_finished: boolean
}

export type GameSettings = {
	transfers_limit: number
	chips: {
		name: string
		number: number
	}[]
}
