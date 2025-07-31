import Image from 'next/image'

import { getTeamBadgeUrl } from '@/lib/utils'
import type { Team } from '@/types/fpl'

interface TeamHeaderProps {
	team: Team
}

export function TeamHeader({ team }: TeamHeaderProps) {
	return (
		<div className='mb-8 flex items-center gap-4'>
			{team.code !== 0 && (
				<Image
					src={getTeamBadgeUrl(team.code) || '/placeholder.svg'}
					alt={`${team.name} badge`}
					width={64}
					height={64}
					className='rounded-full'
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
