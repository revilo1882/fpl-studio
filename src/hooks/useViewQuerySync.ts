'use client'

import { useEffect } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type View = 'grid' | 'chart'

export const useViewQuerySync = ({ view, setView }: { view: View; setView: (v: View) => void }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		const qp = new URLSearchParams(searchParams.toString())
		const qsView = qp.get('view') as View | null
		if (qsView === 'grid' || qsView === 'chart') setView(qsView)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const url = `${pathname}?view=${view}`
		router.replace(url, { scroll: false })
	}, [view, pathname, router])
}
