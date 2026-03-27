import Image from 'next/image'

import type { Team } from '@/types/fpl'
import { getTeamBadgeUrl } from '@/lib/fpl/badges'

interface TeamHeaderProps {
	team: Team
}

export function TeamHeader({ team }: TeamHeaderProps) {
	return (
		<div className='mb-4 flex items-center gap-4'>
			{team.code !== 0 && (
			<Image
				src={getTeamBadgeUrl(team.code, 100) || '/placeholder.svg'}
				alt={`${team.name} badge`}
				width={80}
				height={80}
				className='object-contain'
				unoptimized
			/>
			)}
			<div>
				<h1 className='text-4xl font-bold tracking-tight text-foreground'>{team.name}</h1>
				<p className='text-lg text-muted-foreground'>{team.short_name}</p>
			</div>
		</div>
	)
}
