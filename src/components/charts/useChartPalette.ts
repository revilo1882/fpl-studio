'use client'

import { useMemo } from 'react'

import { useTheme } from 'next-themes'

// Golden angle (≈137.5°) distributes hues maximally apart for any number of teams
const teamColor = (index: number, isDark: boolean): string => {
	const hue = Math.round((index * 137.508) % 360)
	const s = isDark ? 75 : 68
	const l = isDark ? 62 : 42
	return `hsl(${hue}, ${s}%, ${l}%)`
}

export const useChartPalette = (teamNames: string[]) => {
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	return useMemo(() => {
		const grid = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'
		const ticks = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)'

		const palette: Record<string, string> = {}
		teamNames.forEach((team, i) => {
			palette[team] = teamColor(i, isDark)
		})

		return { palette, grid, ticks }
	}, [teamNames, isDark])
}
