'use client'

import { cn } from '@/lib/utils'

export type FixturePageHeaderProps = {
	title: string
	subtitle?: string
	className?: string
	/** `end` — subtitle on the top right (saves vertical space). Default stacks subtitle below title. */
	subtitleAlign?: 'below' | 'end'
}

export const FixturePageHeader = ({
	title,
	subtitle,
	className,
	subtitleAlign = 'below',
}: FixturePageHeaderProps) => (
	<div
		className={cn(
			subtitleAlign === 'end' && subtitle ? 'flex items-start justify-between gap-3' : undefined,
			className,
		)}
	>
		<h1
			className={cn(
				'text-2xl font-bold tracking-tight text-foreground sm:text-3xl',
				subtitleAlign === 'below' ? 'mb-1 sm:mb-2' : 'mb-0 leading-tight',
			)}
		>
			{title}
		</h1>
		{subtitle ? (
			<p
				className={cn(
					'text-muted-foreground',
					subtitleAlign === 'end'
						? 'max-w-[58%] shrink-0 text-right text-xs leading-snug sm:max-w-[50%] sm:text-sm'
						: 'text-sm leading-snug sm:text-base sm:text-lg',
				)}
			>
				{subtitle}
			</p>
		) : null}
	</div>
)
