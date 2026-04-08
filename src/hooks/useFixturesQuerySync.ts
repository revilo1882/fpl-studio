'use client'

import { useEffect, useMemo } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'
import type { FixturesMainTab } from '@/lib/fixtures/scheduleFixtures'
import type { View } from '@/components/fixtures/ViewToggle'

import type { FixtureGridSortConfig, FixtureGridSortKey, SortDirection } from './useDifficultyFilters'

const toCsv = (list: string[]) => list.join(',')
const fromCsv = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const setParam = (params: URLSearchParams, key: string, value?: string | null) => {
	if (value && value.length > 0) params.set(key, value)
	else params.delete(key)
}

const difficultyHints = (qp: URLSearchParams) =>
	qp.has('view') ||
	qp.has('fg') ||
	qp.has('ngw') ||
	qp.has('teams') ||
	qp.has('type') ||
	qp.has('sort')

type TabParams = {
	value: FixturesMainTab
	onChange: (t: FixturesMainTab) => void
}

type ScheduleParams = {
	gameweek: number
	onChange: (n: number) => void
}

type ViewParams = {
	value: View
	onChange: (v: View) => void
}

type FilterParams = {
	selectedTeams: string[]
	difficultyType: DifficultyType
	firstGameweek: number
	numberOfGameweeks: number
	sortConfig: FixtureGridSortConfig
	setSelectedTeams: (teams: string[]) => void
	setDifficultyType: (v: DifficultyType) => void
	setFirstGameweek: (n: number) => void
	setNumberOfGameweeks: (n: number) => void
	setSortConfig: (config: FixtureGridSortConfig) => void
	handleSort: (k: FixtureGridSortKey) => void
}

type UseFixturesQuerySyncParams = {
	tab: TabParams
	schedule: ScheduleParams
	view: ViewParams
	filters: FilterParams
}

export const useFixturesQuerySync = ({ tab, schedule, view, filters }: UseFixturesQuerySyncParams) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		const qp = new URLSearchParams(searchParams.toString())

		const qsTab = qp.get('tab')
		if (qsTab === 'schedule' || qsTab === 'difficulty') tab.onChange(qsTab as FixturesMainTab)
		else if (qsTab === 'matches') tab.onChange('schedule')
		else if (difficultyHints(qp)) tab.onChange('difficulty')

		const qsGw = qp.get('gw')
		if (qsGw && !Number.isNaN(Number(qsGw))) schedule.onChange(Number(qsGw))

		const qsView = qp.get('view') as View | null
		const qsTeams = fromCsv(qp.get('teams'))
		const qsType = qp.get('type') as DifficultyType | null
		const qsFg = qp.get('fg')
		const qsNgw = qp.get('ngw')
		const qsSort = qp.get('sort') as FixtureGridSortKey | null
		const qsDir = qp.get('dir') as SortDirection | null

		if (qsView === 'grid' || qsView === 'chart') view.onChange(qsView)
		if (qsTeams.length > 0) filters.setSelectedTeams(qsTeams)
		if (qsType) filters.setDifficultyType(qsType)
		if (qsFg && !Number.isNaN(Number(qsFg))) filters.setFirstGameweek(Number(qsFg))
		if (qsNgw && !Number.isNaN(Number(qsNgw))) filters.setNumberOfGameweeks(Number(qsNgw))
		if (qsSort && (qsDir === 'ascending' || qsDir === 'descending')) {
			filters.setSortConfig({ key: qsSort, direction: qsDir })
		} else if (qsSort) {
			filters.handleSort(qsSort)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const serialized = useMemo(() => {
		const params = new URLSearchParams()
		setParam(params, 'tab', tab.value)
		setParam(params, 'gw', String(schedule.gameweek))
		setParam(params, 'view', view.value)
		setParam(params, 'teams', toCsv(filters.selectedTeams))
		setParam(params, 'type', filters.difficultyType)
		setParam(params, 'fg', String(filters.firstGameweek))
		setParam(params, 'ngw', String(filters.numberOfGameweeks))
		if (view.value === 'grid') {
			setParam(params, 'sort', filters.sortConfig.key)
			setParam(params, 'dir', filters.sortConfig.direction)
		}
		return params.toString()
	}, [
		tab.value,
		schedule.gameweek,
		view.value,
		filters.selectedTeams,
		filters.difficultyType,
		filters.firstGameweek,
		filters.numberOfGameweeks,
		filters.sortConfig.key,
		filters.sortConfig.direction,
	])

	useEffect(() => {
		const url = serialized ? `${pathname}?${serialized}` : pathname
		router.replace(url, { scroll: false })
	}, [serialized, pathname, router])
}
