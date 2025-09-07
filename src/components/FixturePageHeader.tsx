'use client'

export type FixturePageHeaderProps = {
	title: string
	subtitle?: string
	className?: string
}

export const FixturePageHeader = ({ title, subtitle, className }: FixturePageHeaderProps) => (
	<div className={`mb-6 ${className ?? ''}`}>
		<h1 className='mb-2 text-3xl font-bold tracking-tight text-foreground'>{title}</h1>
		{subtitle ? <p className='text-lg text-muted-foreground'>{subtitle}</p> : null}
	</div>
)
