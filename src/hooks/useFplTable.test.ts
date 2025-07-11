import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { mockBootstrapData, mockFixtures } from '@/lib/test-mocks'

import { useFplTable } from './useFplTable'

describe('useFplTable', () => {
	it('should return data sorted by team name by default', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		expect(result.current.sortConfig.key).toBe('team')
		expect(result.current.sortConfig.direction).toBe('ascending')
		expect(result.current.sortedData[0].team).toBe('Arsenal')
	})

	it('should toggle sort direction when the same key is clicked again', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		act(() => {
			result.current.handleSort('team')
		})

		expect(result.current.sortConfig.direction).toBe('descending')
		expect(result.current.sortedData[0].team).toBe('Man City')
	})

	it('should sort by average when handleSort is called with "average"', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		act(() => {
			result.current.handleSort('average')
		})

		expect(result.current.sortConfig.key).toBe('average')
		expect(result.current.sortedData[0].average).toBeLessThanOrEqual(
			result.current.sortedData[1].average,
		)
	})

	it('should update the number of gameweeks correctly', () => {
		const { result } = renderHook(() => useFplTable(mockBootstrapData, mockFixtures))

		act(() => {
			result.current.setNumberOfGameweeks(3)
		})

		expect(result.current.numberOfGameweeks).toBe(3)
	})
})
