import { type Team } from '@/types/fpl'

import { type DifficultyType } from './generateFixtureMatrix'

export function getDifficultyUI(score: number, difficultyType: DifficultyType) {
	const roundedScore = Math.round(score)

	if (difficultyType === 'fpl') {
		switch (roundedScore) {
			case 1:
				return { bg: 'bg-green-500/60', text: 'text-green-500' }
			case 2:
				return { bg: 'bg-green-300/60', text: 'text-green-300' }
			case 3:
				return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
			case 4:
				return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
			case 5:
				return { bg: 'bg-red-500/60', text: 'text-red-500' }
			default:
				return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
		}
	}

	if (score === 0) return { bg: 'bg-slate-400/60', text: 'text-slate-500' }
	if (score < 1.5) return { bg: 'bg-green-500/60', text: 'text-green-500' }
	if (score < 2.0) return { bg: 'bg-green-400/60', text: 'text-green-400' }
	if (score < 2.5) return { bg: 'bg-yellow-300/60', text: 'text-yellow-300' }
	if (score < 3.0) return { bg: 'bg-yellow-400/60', text: 'text-yellow-400' }
	if (score < 3.5) return { bg: 'bg-orange-400/60', text: 'text-orange-400' }
	if (score < 4.0) return { bg: 'bg-orange-500/60', text: 'text-orange-500' }
	if (score < 4.5) return { bg: 'bg-red-500/60', text: 'text-red-500' }
	return { bg: 'bg-red-600/60', text: 'text-red-600' }
}

export function getDifficultyName(type: DifficultyType) {
	switch (type) {
		case 'fpl':
			return 'FPL Difficulty'
		case 'attack':
			return 'Studio Attack'
		case 'defence':
			return 'Studio Defence'
		case 'overall':
			return 'Studio Overall'
		default:
			return 'Difficulty'
	}
}

export function getOpponentTeam(opponentName: string, teams: Team[]) {
	return teams.find((team) => team.name === opponentName)
}

export function getFormIndicator(form: string) {
	if (!form || form === 'N/A' || form === '0' || form === '0.0') {
		return { color: 'text-muted-foreground', label: 'No data' }
	}

	const formValue = Number.parseFloat(form)
	if (isNaN(formValue)) {
		return { color: 'text-muted-foreground', label: 'No data' }
	}

	if (formValue >= 4.0) return { color: 'text-green-600', label: 'Excellent' }
	if (formValue >= 3.0) return { color: 'text-green-500', label: 'Good' }
	if (formValue >= 2.0) return { color: 'text-yellow-500', label: 'Average' }
	if (formValue >= 1.0) return { color: 'text-orange-500', label: 'Poor' }
	return { color: 'text-red-500', label: 'Very Poor' }
}
