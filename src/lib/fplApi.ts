// lib/fplApi.ts
type FetchOpts = { revalidate?: number; forceFresh?: boolean }

const LARGE_ENDPOINTS = new Set(['bootstrap-static'])

export async function fetchFPLData<T>(
	endpoint: string,
	opts: FetchOpts = { revalidate: 900 },
): Promise<T> {
	const url = `https://fantasy.premierleague.com/api/${endpoint}/`

	// Force no-store for large responses to avoid Next data cache 2MB limit
	const isLarge = LARGE_ENDPOINTS.has(endpoint)
	const forceFreshQS =
		typeof window !== 'undefined' && new URLSearchParams(location.search).has('fresh')

	const useNoStore = opts.forceFresh || forceFreshQS || isLarge

	const fetchOpts: RequestInit = useNoStore
		? { cache: 'no-store' }
		: { next: { revalidate: opts.revalidate ?? 900 } }

	const res = await fetch(url, fetchOpts)
	if (!res.ok) throw new Error(`Failed to fetch FPL data from ${endpoint}`)
	return res.json()
}
