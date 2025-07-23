import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getTeamBadgeUrl(teamCode: number): string {
	return `https://resources.premierleague.com/premierleague/badges/25/t${teamCode}.png`
}
