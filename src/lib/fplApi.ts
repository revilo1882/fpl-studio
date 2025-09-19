type FetchOpts = { revalidate?: number; forceFresh?: boolean }

const LARGE_ENDPOINTS = new Set(['bootstrap-static'])

export async function fetchFPLData<T>(
	endpoint: string,
	opts: FetchOpts = { revalidate: 900 },
): Promise<T | null> {
	const url = `https://fantasy.premierleague.com/api/${endpoint}/`

	// Force no-store for large responses to avoid Next data cache 2MB limit
	const isLarge = LARGE_ENDPOINTS.has(endpoint)
	const forceFreshQS =
		typeof window !== 'undefined' && new URLSearchParams(location.search).has('fresh')

	const useNoStore = opts.forceFresh || forceFreshQS || isLarge

	const fetchOpts: RequestInit = useNoStore
		? { cache: 'no-store' }
		: { next: { revalidate: opts.revalidate ?? 900 } }

	try {
		const res = await fetch(url, fetchOpts)
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		return (await res.json()) as T
	} catch (err) {
		// In production, don't take the whole build/app down on transient failures
		if (process.env.NODE_ENV === 'production') {
			console.warn(`[fetchFPLData] ${endpoint} failed:`, err)
			return null
		}
		// In dev, surface the error loudly
		throw err
	}
}
