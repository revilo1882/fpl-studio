import { cn } from '@/lib/utils'

const RESULT_STYLES: Record<string, string> = {
	W: 'bg-green-500 text-white',
	D: 'bg-yellow-400 text-black',
	L: 'bg-red-500 text-white',
}

interface FormBadgesProps {
	formSummary: string
	className?: string
}

export function FormBadges({ formSummary, className }: FormBadgesProps) {
	const match = formSummary.match(/^([WDL]+)\s+\((.+)\)$/)
	if (!match) {
		return (
			<span className={cn('text-sm text-muted-foreground', className)}>{formSummary}</span>
		)
	}

	const letters = match[1].split('')
	const stats = match[2]

	return (
		<div className={cn('flex flex-col items-end gap-1', className)}>
			<div className='flex gap-1'>
				{letters.map((letter, i) => (
					<span
						key={i}
						className={cn(
							'flex h-5 w-5 items-center justify-center rounded text-xs font-bold',
							RESULT_STYLES[letter] ?? 'bg-muted text-muted-foreground',
						)}
					>
						{letter}
					</span>
				))}
			</div>
			<span className='text-xs text-muted-foreground'>({stats})</span>
		</div>
	)
}
