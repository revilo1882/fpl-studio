import type { Team } from '@/types/fpl'
import { TeamBadge } from '@/components/team/TeamBadge'

interface TeamHeaderProps {
	team: Team
}

export const TeamHeader = ({ team }: TeamHeaderProps) => {
	return (
		<div className='mb-4 flex items-center gap-3'>
			<TeamBadge code={team.code} name={team.name} size={40} className='object-contain' />
			<div>
				<h1 className='text-2xl font-bold tracking-tight text-foreground'>{team.name}</h1>
				<p className='text-sm text-muted-foreground'>{team.short_name}</p>
			</div>
		</div>
	)
}
