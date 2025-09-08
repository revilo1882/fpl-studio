type FetchOpts = { revalidate?: number; forceFresh?: boolean }

export async function fetchFPLData<T>(
	endpoint: string,
	opts: FetchOpts = { revalidate: 900 },
): Promise<T> {
	const url = `https://fantasy.premierleague.com/api/${endpoint}/`
	const forceFresh =
		opts.forceFresh ||
		(typeof window !== 'undefined' && new URLSearchParams(location.search).has('fresh'))
	const fetchOpts: RequestInit = forceFresh
		? { cache: 'no-store' }
		: { next: { revalidate: opts.revalidate ?? 900 } }

	const res = await fetch(url, fetchOpts)
	if (!res.ok) throw new Error(`Failed to fetch FPL data from ${endpoint}`)
	return res.json()
}
