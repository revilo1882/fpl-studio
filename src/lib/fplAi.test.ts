import { describe, it, expect, vi, beforeEach } from 'vitest'

import { fetchFPLData } from './fplApi'

global.fetch = vi.fn()

describe('fplApi', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('fetches data successfully with default revalidate', async () => {
		const mockData = { teams: [], events: [] }

		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		} as Response)

		const result = await fetchFPLData('bootstrap-static')

		expect(fetch).toHaveBeenCalledWith(
			'https://fantasy.premierleague.com/api/bootstrap-static/',
			{ next: { revalidate: 900 } },
		)
		expect(result).toEqual(mockData)
	})

	it('forces no-store when forceFresh is true', async () => {
		const mockData = { teams: [] }

		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		} as Response)

		const result = await fetchFPLData('bootstrap-static', { forceFresh: true })

		expect(fetch).toHaveBeenCalledWith(
			'https://fantasy.premierleague.com/api/bootstrap-static/',
			{ cache: 'no-store' },
		)
		expect(result).toEqual(mockData)
	})

	it('throws error when fetch fails', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: false,
		} as Response)

		await expect(fetchFPLData('bootstrap-static')).rejects.toThrow(
			'Failed to fetch FPL data from bootstrap-static',
		)
	})

	it('constructs correct URL for different endpoints', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		} as Response)

		await fetchFPLData('fixtures')

		expect(fetch).toHaveBeenCalledWith('https://fantasy.premierleague.com/api/fixtures/', {
			next: { revalidate: 900 },
		})
	})
})
