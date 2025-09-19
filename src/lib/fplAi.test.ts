// fplApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { fetchFPLData } from './fplApi'

global.fetch = vi.fn()

describe('fetchFPLData', () => {
	beforeEach(() => vi.resetAllMocks())

	it('uses no-store for large endpoints (bootstrap-static)', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		} as Response)

		await fetchFPLData('bootstrap-static')

		expect(fetch).toHaveBeenCalledWith(
			'https://fantasy.premierleague.com/api/bootstrap-static/',
			{ cache: 'no-store' },
		)
	})

	it('uses revalidate for smaller endpoints (fixtures)', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		} as Response)

		await fetchFPLData('fixtures')

		expect(fetch).toHaveBeenCalledWith('https://fantasy.premierleague.com/api/fixtures/', {
			next: { revalidate: 900 },
		})
	})

	it('honours forceFresh flag', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ ok: 1 }),
		} as Response)

		await fetchFPLData('fixtures', { forceFresh: true })

		expect(fetch).toHaveBeenCalledWith('https://fantasy.premierleague.com/api/fixtures/', {
			cache: 'no-store',
		})
	})

	it('throws on non-ok response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response)

		await expect(fetchFPLData('fixtures')).rejects.toThrow('HTTP 500')
	})
})
