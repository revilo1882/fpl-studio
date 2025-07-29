import { describe, it, expect } from 'vitest'

import { getDifficultyUI, getDifficultyName, getOpponentTeam } from './fixtureGridUtils'
import { mockTeams } from './test-mocks'

describe('fixtureGridUtils', () => {
	describe('getDifficultyUI', () => {
		it('returns correct colors for FPL difficulty scores', () => {
			expect(getDifficultyUI(1, 'fpl')).toEqual({
				bg: 'bg-green-500/60',
				text: 'text-green-500',
			})
			expect(getDifficultyUI(5, 'fpl')).toEqual({
				bg: 'bg-red-500/60',
				text: 'text-red-500',
			})
		})

		it('returns correct colors for studio difficulty scores', () => {
			expect(getDifficultyUI(1.2, 'overall')).toEqual({
				bg: 'bg-green-500/60',
				text: 'text-green-500',
			})
			expect(getDifficultyUI(4.8, 'overall')).toEqual({
				bg: 'bg-red-600/60',
				text: 'text-red-600',
			})
		})

		it('handles edge cases', () => {
			expect(getDifficultyUI(0, 'overall')).toEqual({
				bg: 'bg-slate-400/60',
				text: 'text-slate-500',
			})
			expect(getDifficultyUI(99, 'fpl')).toEqual({
				bg: 'bg-slate-400/60',
				text: 'text-slate-500',
			})
		})
	})

	describe('getDifficultyName', () => {
		it('returns human-readable names for valid difficulty types', () => {
			expect(getDifficultyName('fpl')).toBe('FPL Difficulty')
			expect(getDifficultyName('overall')).toBe('Studio Overall')
			expect(getDifficultyName('attack')).toBe('Studio Attack')
			expect(getDifficultyName('defence')).toBe('Studio Defence')
		})
	})

	describe('getOpponentTeam', () => {
		it('returns correct team object based on full name', () => {
			const team = getOpponentTeam('Man City', mockTeams)
			expect(team?.name).toBe('Man City')
		})

		it('returns "Unknown" for invalid name', () => {
			const team = getOpponentTeam('ZZZ', mockTeams)
			expect(team?.name ?? 'Unknown').toBe('Unknown')
		})
	})
})
