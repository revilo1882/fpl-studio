import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'
import type { BootstrapData } from '@/types/fpl'

/** Mirrors `useFplTable` — keep in sync to avoid importing the hook from storage. */
type FixtureGridSortKey = 'team' | 'score'
type SortDirection = 'ascending' | 'descending'

const STORAGE_KEY = 'fpl-studio:difficulty-filters:v1'

export type StoredDifficultyFilters = {
	/** Invalidate when total gameweeks in the season changes. */
	eventsLength: number
	firstGameweek: number
	numberOfGameweeks: number
	difficultyType: DifficultyType
	selectedTeams: string[]
	sortKey: FixtureGridSortKey
	sortDirection: SortDirection
}

const DIFFICULTY_TYPES: DifficultyType[] = ['FPL', 'Overall', 'Attack', 'Defence']

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

function parseStored(raw: string | null): Partial<StoredDifficultyFilters> | null {
	if (!raw) return null
	try {
		const p = JSON.parse(raw) as Partial<StoredDifficultyFilters>
		return p && typeof p === 'object' ? p : null
	} catch {
		return null
	}
}

/**
 * Read persisted difficulty grid filters. Clamps to current season length and drops unknown team names.
 */
export function readDifficultyFiltersFromStorage(
	bootstrapData: BootstrapData,
	defaults: {
		firstGameweek: number
		numberOfGameweeks: number
		difficultyType: DifficultyType
	},
): Omit<StoredDifficultyFilters, 'eventsLength'> & { eventsLength: number } {
	const events = bootstrapData.events ?? []
	const teams = bootstrapData.teams ?? []
	const maxGameweekId = events.length > 0 ? Math.max(...events.map((e) => e.id)) : 0
	const eventsLength = events.length
	const validNames = new Set(teams.map((t) => t.name))

	let stored: Partial<StoredDifficultyFilters> | null = null
	if (typeof window !== 'undefined') {
		stored = parseStored(localStorage.getItem(STORAGE_KEY))
	}

	const firstRaw = stored?.firstGameweek ?? defaults.firstGameweek
	const first = clamp(firstRaw, 1, Math.max(1, maxGameweekId))
	const remaining = Math.max(0, maxGameweekId - first + 1)
	const ngwRaw = stored?.numberOfGameweeks ?? defaults.numberOfGameweeks
	const numberOfGameweeks = clamp(ngwRaw, 1, Math.max(1, remaining))

	let difficultyType: DifficultyType = defaults.difficultyType
	if (stored?.difficultyType && DIFFICULTY_TYPES.includes(stored.difficultyType)) {
		difficultyType = stored.difficultyType
	}

	const selectedTeams = (stored?.selectedTeams ?? []).filter((n) => validNames.has(n))

	let sortKey: FixtureGridSortKey = 'team'
	let sortDirection: SortDirection = 'ascending'
	if (stored?.sortKey === 'team' || stored?.sortKey === 'score') {
		sortKey = stored.sortKey
	}
	if (stored?.sortDirection === 'ascending' || stored?.sortDirection === 'descending') {
		sortDirection = stored.sortDirection
	}

	return {
		eventsLength,
		firstGameweek: first,
		numberOfGameweeks,
		difficultyType,
		selectedTeams,
		sortKey,
		sortDirection,
	}
}

export function writeDifficultyFiltersToStorage(payload: StoredDifficultyFilters): void {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
	} catch {
		// quota / private mode
	}
}
