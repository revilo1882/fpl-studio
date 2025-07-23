import { describe, it, expect } from 'vitest'

import {
	getDifficultyUI,
	getDifficultyName,
	getOpponentTeam,
	getFormIndicator,
} from './fixtureGridUtils'
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
		})
	})

	describe('getDifficultyName', () => {
		it('returns correct names for each difficulty type', () => {
			expect(getDifficultyName('fpl')).toBe('FPL Difficulty')
			expect(getDifficultyName('attack')).toBe('Studio Attack')
			expect(getDifficultyName('defence')).toBe('Studio Defence')
			expect(getDifficultyName('overall')).toBe('Studio Overall')
		})
	})

	describe('getOpponentTeam', () => {
		it('finds team by name', () => {
			const team = getOpponentTeam('Arsenal', mockTeams)
			expect(team).toBeDefined()
			expect(team?.name).toBe('Arsenal')
		})

		it('returns undefined for non-existent team', () => {
			const team = getOpponentTeam('Non-existent Team', mockTeams)
			expect(team).toBeUndefined()
		})
	})

	describe('getFormIndicator', () => {
		it('returns correct indicators for different form values', () => {
			expect(getFormIndicator('4.2')).toEqual({
				color: 'text-green-600',
				label: 'Excellent',
			})
			expect(getFormIndicator('3.5')).toEqual({
				color: 'text-green-500',
				label: 'Good',
			})
			expect(getFormIndicator('2.5')).toEqual({
				color: 'text-yellow-500',
				label: 'Average',
			})
			expect(getFormIndicator('1.5')).toEqual({
				color: 'text-orange-500',
				label: 'Poor',
			})
			expect(getFormIndicator('0.5')).toEqual({
				color: 'text-red-500',
				label: 'Very Poor',
			})
		})

		it('handles invalid form data', () => {
			expect(getFormIndicator('N/A')).toEqual({
				color: 'text-muted-foreground',
				label: 'No data',
			})
			expect(getFormIndicator('0')).toEqual({
				color: 'text-muted-foreground',
				label: 'No data',
			})
			expect(getFormIndicator('invalid')).toEqual({
				color: 'text-muted-foreground',
				label: 'No data',
			})
		})
	})
})
