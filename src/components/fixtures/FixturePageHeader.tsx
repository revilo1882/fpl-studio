'use client'

export type FixturePageHeaderProps = {
	title: string
	subtitle?: string
	className?: string
}

export const FixturePageHeader = ({ title, subtitle, className }: FixturePageHeaderProps) => (
	<div className={className}>
		<h1 className='mb-1 text-2xl font-bold tracking-tight text-foreground sm:mb-2 sm:text-3xl'>
			{title}
		</h1>
		{subtitle ? (
			<p className='text-sm leading-snug text-muted-foreground sm:text-base sm:text-lg'>
				{subtitle}
			</p>
		) : null}
	</div>
)
