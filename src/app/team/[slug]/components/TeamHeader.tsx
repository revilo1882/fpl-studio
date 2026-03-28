import type { Team } from '@/types/fpl'
import { TeamBadge } from '@/components/TeamBadge'

interface TeamHeaderProps {
	team: Team
}

export const TeamHeader = ({ team }: TeamHeaderProps) => {
	return (
		<div className='mb-4 flex items-center gap-4'>
			<TeamBadge code={team.code} name={team.name} size={80} className='object-contain' />
			<div>
				<h1 className='text-4xl font-bold tracking-tight text-foreground'>{team.name}</h1>
				<p className='text-lg text-muted-foreground'>{team.short_name}</p>
			</div>
		</div>
	)
}
