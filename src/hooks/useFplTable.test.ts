import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { mockBootstrapData, mockFixtures } from '@/lib/test-mocks'

import { useFplTable } from './useFplTable'

describe('useFplTable', () => {
	it('initializes with correct default state', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		expect(result.current.difficultyType).toBe('overall')
		expect(result.current.selectedTeams).toEqual([])
		expect(result.current.isLoading).toBe(true) // loading starts true
		expect(typeof result.current.numberOfGameweeks).toBe('number')
	})

	it('updates difficulty type', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		act(() => {
			result.current.setDifficultyType('attack')
		})

		expect(result.current.difficultyType).toBe('attack')
	})

	it('updates number of gameweeks', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		act(() => {
			result.current.setNumberOfGameweeks(8)
		})

		expect(result.current.numberOfGameweeks).toBe(8)
	})

	it('updates selected teams', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		act(() => {
			result.current.setSelectedTeams(['MCI', 'CHE'])
		})

		expect(result.current.selectedTeams).toEqual(['MCI', 'CHE'])
	})

	it('sets isLoading to false eventually (after fixture generation)', async () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		await new Promise((resolve) => setTimeout(resolve, 50)) // simulate async wait
		expect(result.current.isLoading).toBe(false)
	})
})
