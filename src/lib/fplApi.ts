export async function fetchFPLData<T>(endpoint: string): Promise<T> {
	const res = await fetch(`https://fantasy.premierleague.com/api/${endpoint}/`, {
		cache: 'no-store',
	})
	if (!res.ok) throw new Error(`Failed to fetch FPL data from ${endpoint}`)
	return res.json()
}
