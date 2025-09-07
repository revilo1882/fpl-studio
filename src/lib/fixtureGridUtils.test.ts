import { describe, it, expect } from 'vitest'

import { getDifficultyUI, getOpponentTeam } from './fixtureGridUtils'
import { mockTeams } from './test-mocks'

describe('fixtureGridUtils', () => {
	describe('getDifficultyUI', () => {
		it('returns correct colors for FPL difficulty scores', () => {
			expect(getDifficultyUI(1, 'FPL')).toEqual({
				bg: 'bg-green-500/60',
				text: 'text-green-500',
			})
			expect(getDifficultyUI(5, 'FPL')).toEqual({
				bg: 'bg-red-500/60',
				text: 'text-red-500',
			})
		})

		it('returns correct colors for studio difficulty scores', () => {
			expect(getDifficultyUI(1.2, 'Overall')).toEqual({
				bg: 'bg-green-500/60',
				text: 'text-green-500',
			})
			expect(getDifficultyUI(4.8, 'Overall')).toEqual({
				bg: 'bg-red-600/60',
				text: 'text-red-600',
			})
		})

		it('handles edge cases', () => {
			expect(getDifficultyUI(0, 'Overall')).toEqual({
				bg: 'bg-slate-400/60',
				text: 'text-slate-500',
			})
			expect(getDifficultyUI(99, 'FPL')).toEqual({
				bg: 'bg-slate-400/60',
				text: 'text-slate-500',
			})
		})
	})

	describe('getOpponentTeam', () => {
		it('returns correct team object based on full name', () => {
			const team = getOpponentTeam('Man City', mockTeams)
			expect(team?.name).toBe('Man City')
		})

		it('returns undefined for invalid name', () => {
			const team = getOpponentTeam('ZZZ', mockTeams)
			expect(team).toBeUndefined()
		})
	})
})
