import Image from 'next/image'

import { getTeamBadgeUrl } from '@/lib/fpl/badges'
import { cn } from '@/lib/utils'

interface TeamBadgeProps {
	code: number
	name: string
	/** Display size in px (default 20). Automatically picks 100px badge URL for sizes ≥ 50. */
	size?: number
	className?: string
}

export function TeamBadge({ code, name, size = 20, className }: TeamBadgeProps) {
	if (code === 0) return null
	const urlSize: 25 | 100 = size >= 50 ? 100 : 25
	return (
		<Image
			src={getTeamBadgeUrl(code, urlSize)}
			alt={`${name} badge`}
			width={size}
			height={size}
			// Explicit style ensures both axes are set, preventing Next.js image dimension warning
			style={{ width: size, height: size }}
			className={cn('shrink-0', className)}
			unoptimized
		/>
	)
}
