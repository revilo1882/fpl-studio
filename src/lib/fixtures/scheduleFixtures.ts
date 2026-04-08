import type { Fixture, Gameweek, Team } from '@/types/fpl'

export type FixturesMainTab = 'schedule' | 'difficulty'

export type ScheduleFixtureRow = {
	fixture: Fixture
	homeName: string
	awayName: string
}

export type ScheduleDayGroup = {
	/** Local calendar key (YYYY-MM-DD) or `__tbc__` */
	dateKey: string
	/** e.g. "Fri 4 Apr" */
	label: string
	rows: ScheduleFixtureRow[]
}

export function getDefaultScheduleGameweek(
	events: Pick<Gameweek, 'id' | 'is_current' | 'is_next' | 'is_finished'>[],
): number {
	if (events.length === 0) return 1
	const current = events.find((e) => e.is_current)
	if (current && !current.is_finished) return current.id
	const next = events.find((e) => e.is_next)
	if (next) return next.id
	return current?.id ?? events[events.length - 1]!.id
}

function teamNameById(teams: Team[], id: number): string {
	return teams.find((t) => t.id === id)?.name ?? `Team ${id}`
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Local calendar key for grouping (ISO date in local TZ). */
export function localDateKeyFromKickoff(iso: string | null): string {
	if (!iso) return '__tbc__'
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return '__tbc__'
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function formatScheduleDayLabel(dateKey: string): string {
	if (dateKey === '__tbc__') return 'To be confirmed'
	const [y, m, day] = dateKey.split('-').map(Number)
	if (!y || !m || !day) return dateKey
	const d = new Date(y, m - 1, day)
	return new Intl.DateTimeFormat('en-GB', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	}).format(d)
}

function kickoffMs(iso: string | null): number {
	if (!iso) return Number.POSITIVE_INFINITY
	const t = new Date(iso).getTime()
	return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t
}

/**
 * Fixtures in this gameweek, grouped by local calendar date.
 * Order: date ascending; within a day — kickoff then home team name (A–Z).
 */
export function groupFixturesForSchedule(
	fixtures: Fixture[],
	teams: Team[],
	eventId: number,
): ScheduleDayGroup[] {
	const inGw = fixtures.filter((f) => f.event === eventId)

	const sorted = [...inGw].sort((a, b) => {
		const ta = kickoffMs(a.kickoff_time)
		const tb = kickoffMs(b.kickoff_time)
		if (ta !== tb) return ta - tb
		const homeA = teamNameById(teams, a.team_h)
		const homeB = teamNameById(teams, b.team_h)
		return homeA.localeCompare(homeB, 'en', { sensitivity: 'base' })
	})

	const map = new Map<string, ScheduleFixtureRow[]>()
	for (const fixture of sorted) {
		const key = localDateKeyFromKickoff(fixture.kickoff_time)
		const row: ScheduleFixtureRow = {
			fixture,
			homeName: teamNameById(teams, fixture.team_h),
			awayName: teamNameById(teams, fixture.team_a),
		}
		const list = map.get(key)
		if (list) list.push(row)
		else map.set(key, [row])
	}

	const keys = [...map.keys()].sort((a, b) => {
		if (a === '__tbc__') return 1
		if (b === '__tbc__') return -1
		return a.localeCompare(b)
	})

	return keys.map((dateKey) => ({
		dateKey,
		label: formatScheduleDayLabel(dateKey),
		rows: map.get(dateKey)!,
	}))
}

export function clampGameweekId(gw: number, eventCount: number): number {
	if (eventCount <= 0) return 1
	return Math.max(1, Math.min(eventCount, Math.floor(gw)))
}
