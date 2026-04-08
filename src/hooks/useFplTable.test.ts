import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import { mockBootstrapData, mockFixtures } from '@/lib/test-mocks'

import { useFplTable } from './useFplTable'

describe('useFplTable', () => {
	beforeEach(() => {
		localStorage.clear()
	})

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
		// generateFixtureMatrix is synchronous so isLoading resolves to false immediately
		expect(result.current.data.isLoading).toBe(false)
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
			result.current.actions.setSelectedTeams(['Man City', 'Chelsea'])
		})

		expect(result.current.state.selectedTeams).toEqual(['Man City', 'Chelsea'])
	})

	it('sets isLoading to false eventually (after fixture generation)', async () => {
		const { result } = renderHook(() => useFplTable(defaultParams))

		await waitFor(() => expect(result.current.data.isLoading).toBe(false), { timeout: 2000 })
	})
})
