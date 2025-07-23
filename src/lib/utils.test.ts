import { describe, it, expect } from 'vitest'

import { cn, getTeamBadgeUrl } from './utils'

describe('utils', () => {
	describe('cn', () => {
		it('merges class names correctly', () => {
			expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
			expect(cn('px-2', 'px-4')).toBe('px-4') // Tailwind merge should handle conflicts
		})

		it('handles conditional classes', () => {
			const shouldInclude = true
			const shouldNotInclude = false
			expect(cn('base', shouldInclude && 'conditional')).toBe('base conditional')
			expect(cn('base', shouldNotInclude && 'conditional')).toBe('base')
		})
	})

	describe('getTeamBadgeUrl', () => {
		it('generates correct badge URL', () => {
			expect(getTeamBadgeUrl(3)).toBe(
				'https://resources.premierleague.com/premierleague/badges/25/t3.png',
			)
			expect(getTeamBadgeUrl(11)).toBe(
				'https://resources.premierleague.com/premierleague/badges/25/t11.png',
			)
		})
	})
})
