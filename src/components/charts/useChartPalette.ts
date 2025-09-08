'use client'

import { useMemo } from 'react'

import { useTheme } from 'next-themes'

export const useChartPalette = (teamNames: string[]) => {
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	return useMemo(() => {
		const lightPalette = ['#0066FF', '#D72638', '#00B341', '#FFB400', '#7B2CBF']

		const darkPalette = ['#00CFFF', '#FF2E92', '#A3FF00', '#FF7F11', '#9D4DFF']

		const grid = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'
		const ticks = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)'

		const palette: Record<string, string> = {}
		const colours = isDark ? darkPalette : lightPalette

		teamNames.forEach((team, i) => {
			palette[team] = colours[i % colours.length]
		})

		return { palette, grid, ticks }
	}, [teamNames, isDark])
}
