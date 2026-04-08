import { describe, expect, it, beforeEach } from 'vitest'

import { mockBootstrapData } from '@/lib/test-mocks'

import {
	readDifficultyFiltersFromStorage,
	writeDifficultyFiltersToStorage,
} from './difficultyFiltersStorage'

describe('difficultyFiltersStorage', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('round-trips filters and clamps to season length', () => {
		writeDifficultyFiltersToStorage({
			eventsLength: mockBootstrapData.events?.length ?? 0,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'Attack',
			selectedTeams: ['Arsenal'],
			sortKey: 'score',
			sortDirection: 'descending',
		})

		const read = readDifficultyFiltersFromStorage(mockBootstrapData, {
			firstGameweek: 1,
			numberOfGameweeks: 5,
			difficultyType: 'Overall',
		})

		expect(read.difficultyType).toBe('Attack')
		expect(read.selectedTeams).toEqual(['Arsenal'])
		expect(read.sortKey).toBe('score')
		expect(read.sortDirection).toBe('descending')
	})

	it('drops team names that are not in current bootstrap', () => {
		writeDifficultyFiltersToStorage({
			eventsLength: mockBootstrapData.events?.length ?? 0,
			firstGameweek: 1,
			numberOfGameweeks: 2,
			difficultyType: 'Overall',
			selectedTeams: ['Tottenham'],
			sortKey: 'team',
			sortDirection: 'ascending',
		})

		const read = readDifficultyFiltersFromStorage(mockBootstrapData, {
			firstGameweek: 1,
			numberOfGameweeks: 5,
			difficultyType: 'Overall',
		})

		expect(read.selectedTeams).toEqual([])
	})
})
