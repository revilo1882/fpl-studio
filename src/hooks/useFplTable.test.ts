import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { mockBootstrapData, mockFixtures } from '@/lib/test-mocks'

import { useFplTable } from './useFplTable'

describe('useFplTable', () => {
	const defaultParams = {
		bootstrapData: mockBootstrapData,
		fixtures: mockFixtures,
		initialFirstGameweek: 1,
		initialNumberOfGameweeks: 5,
		initialDifficultyType: 'Overall' as const,
	}

	it('initializes with correct default state', () => {
		const { result } = renderHook(() => useFplTable(defaultParams))

		expect(result.current.state.difficultyType).toBe('Overall')
		expect(result.current.state.selectedTeams).toEqual([])
		expect(result.current.data.isLoading).toBe(true)
		expect(typeof result.current.state.numberOfGameweeks).toBe('number')
	})

	it('updates difficulty type', () => {
		const { result } = renderHook(() => useFplTable(defaultParams))

		act(() => {
			result.current.actions.setDifficultyType('Attack')
		})

		expect(result.current.state.difficultyType).toBe('Attack')
	})

	it('updates number of gameweeks', () => {
		const { result } = renderHook(() => useFplTable(defaultParams))

		act(() => {
			result.current.actions.setNumberOfGameweeks(3)
		})

		expect(result.current.state.numberOfGameweeks).toBe(3)
	})

	it('updates selected teams', () => {
		const { result } = renderHook(() => useFplTable(defaultParams))

		act(() => {
			result.current.actions.setSelectedTeams(['MCI', 'CHE'])
		})

		expect(result.current.state.selectedTeams).toEqual(['MCI', 'CHE'])
	})

	it('sets isLoading to false eventually (after fixture generation)', async () => {
		const { result } = renderHook(() => useFplTable(defaultParams))

		await new Promise((resolve) => setTimeout(resolve, 50))
		expect(result.current.data.isLoading).toBe(false)
	})
})
