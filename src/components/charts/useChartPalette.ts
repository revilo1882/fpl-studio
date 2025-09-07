'use client'

import { useMemo } from 'react'

import { useTheme } from 'next-themes'

export const useChartPalette = (teamNames: string[]) => {
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	return useMemo(() => {
		const grid = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'
		const ticks = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)'
		const sat = isDark ? 70 : 68
		const light = isDark ? 62 : 46
		const alpha = 1
		const GOLDEN_ANGLE = 137.508

		const palette: Record<string, string> = {}
		for (let i = 0; i < teamNames.length; i += 1) {
			const hue = (i * GOLDEN_ANGLE) % 360
			palette[teamNames[i]] = `hsl(${hue} ${sat}% ${light}% / ${alpha})`
		}

		const stroke = isDark ? '#cdd6f4' : '#0f172a'

		return { stroke, grid, ticks, palette, isDark }
	}, [isDark, teamNames])
}
