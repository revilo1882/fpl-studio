'use client'

import { useEffect, useMemo } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { DifficultyType } from '@/lib/generateFixtureMatrix'

type View = 'grid' | 'chart'
type SortKey = 'team' | 'score'
type SortDirection = 'ascending' | 'descending'

const toCsv = (list: string[]) => list.join(',')
const fromCsv = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const setParam = (params: URLSearchParams, key: string, value?: string | null) => {
	if (value && value.length > 0) params.set(key, value)
	else params.delete(key)
}

export const useQuerySync = ({
	view,
	selectedTeams,
	difficultyType,
	firstGameweek,
	numberOfGameweeks,
	sortKey,
	sortDirection,
	setView,
	setSelectedTeams,
	setDifficultyType,
	setFirstGameweek,
	setNumberOfGameweeks,
	setSortKey,
}: {
	view: View
	selectedTeams: string[]
	difficultyType: DifficultyType
	firstGameweek: number
	numberOfGameweeks: number
	sortKey: SortKey
	sortDirection: SortDirection
	setView: (v: View) => void
	setSelectedTeams: (teams: string[]) => void
	setDifficultyType: (v: DifficultyType) => void
	setFirstGameweek: (n: number) => void
	setNumberOfGameweeks: (n: number) => void
	setSortKey: (k: SortKey) => void
}) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		const qp = new URLSearchParams(searchParams.toString())
		const qsView = qp.get('view') as View | null
		const qsTeams = fromCsv(qp.get('teams'))
		const qsType = qp.get('type') as DifficultyType | null
		const qsFg = qp.get('fg')
		const qsNgw = qp.get('ngw')
		const qsSort = qp.get('sort') as SortKey | null
		if (qsView === 'grid' || qsView === 'chart') setView(qsView)
		if (qsTeams.length > 0) setSelectedTeams(qsTeams)
		if (qsType) setDifficultyType(qsType)
		if (qsFg && !Number.isNaN(Number(qsFg))) setFirstGameweek(Number(qsFg))
		if (qsNgw && !Number.isNaN(Number(qsNgw))) setNumberOfGameweeks(Number(qsNgw))
		if (qsSort) setSortKey(qsSort)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const serialized = useMemo(() => {
		const params = new URLSearchParams()
		setParam(params, 'view', view)
		setParam(params, 'teams', toCsv(selectedTeams))
		setParam(params, 'type', difficultyType)
		setParam(params, 'fg', String(firstGameweek))
		setParam(params, 'ngw', String(numberOfGameweeks))
		if (view === 'grid') {
			setParam(params, 'sort', sortKey)
			setParam(params, 'dir', sortDirection)
		}
		return params.toString()
	}, [
		view,
		selectedTeams,
		difficultyType,
		firstGameweek,
		numberOfGameweeks,
		sortKey,
		sortDirection,
	])

	useEffect(() => {
		const url = serialized ? `${pathname}?${serialized}` : pathname
		router.replace(url, { scroll: false })
	}, [serialized, pathname, router])
}
