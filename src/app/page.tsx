import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2, TrendingUp, LayoutGrid, ChevronRight, Shield, Activity, Gauge } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
	title: {
		absolute: `${SITE_NAME} — Dynamic fixture difficulty for Fantasy Premier League`,
	},
	description: SITE_DESCRIPTION,
}

type AccentColor = 'emerald' | 'blue' | 'orange' | 'amber' | 'slate'

const ICON_STYLES: Record<AccentColor, string> = {
	emerald: 'bg-emerald-500/10 text-emerald-500',
	blue: 'bg-blue-500/10 text-blue-500',
	orange: 'bg-orange-500/10 text-orange-500',
	amber: 'bg-amber-500/10 text-amber-500',
	slate: 'bg-slate-500/10 text-slate-500',
}

const ICON_TEXT: Record<AccentColor, string> = {
	emerald: 'text-emerald-500',
	blue: 'text-blue-500',
	orange: 'text-orange-500',
	amber: 'text-amber-500',
	slate: 'text-slate-500',
}

const BADGE_STYLES: Record<AccentColor, string> = {
	emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
	blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
	orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
	amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
	slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

const BORDER_STYLES: Record<AccentColor, string> = {
	emerald: 'border-l-emerald-500',
	blue: 'border-l-blue-500',
	orange: 'border-l-orange-500',
	amber: 'border-l-amber-500',
	slate: 'border-l-slate-400',
}

export default function LandingPage() {
	return (
		<div className='flex flex-col'>
			{/* ── Hero ── */}
			<section className='relative overflow-hidden'>
				<div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.07),transparent)]' />

				<div className='container mx-auto flex flex-col items-center px-4 pb-16 pt-10 text-center sm:pt-14'>
					<div className='mb-8 flex items-center justify-center gap-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl'>
						<BarChart2 aria-hidden className='h-[1em] w-[1em] shrink-0' strokeWidth={2} />
						<span>FPL Studio</span>
					</div>

					<h1 className='mb-4 max-w-3xl text-xl font-semibold tracking-tight text-muted-foreground sm:text-2xl lg:text-3xl'>
						Fixture difficulty,{' '}
						<span className='text-primary'>recalculated.</span>
					</h1>

					<p className='mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl'>
						The official FPL ratings are static. FPL Studio builds a dynamic model from
						team strength, live form, and season performance — then weights them based on
						how far into the season you are.
					</p>

					<div className='flex flex-wrap justify-center gap-3'>
						<Button asChild size='lg'>
							<Link href='/fixtures'>
								Explore Fixture Grid
								<ChevronRight className='ml-1 h-4 w-4' />
							</Link>
						</Button>
						<Button asChild variant='outline' size='lg'>
							<Link href='/strengths'>View Team Strengths</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ── Feature cards ── */}
			<section className='border-t border-border bg-muted/30'>
				<div className='container mx-auto px-4 py-16'>
					<h2 className='mb-10 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
						Everything the official site doesn&apos;t show you
					</h2>

					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						<FeatureCard
							icon={<TrendingUp className='h-5 w-5' />}
							accent='emerald'
							title='Fixture Difficulty Rating (FDR)'
							description='Ratings that evolve as the season progresses. Early on, team strength dominates. Later, actual season data and recent form take over.'
						/>
						<FeatureCard
							icon={<LayoutGrid className='h-5 w-5' />}
							accent='blue'
							title='Fixture Grid'
							description='All 20 teams, any gameweek window. Sort by attractiveness score, filter by team, switch between Overall / Attack / Defence views.'
						/>
						<FeatureCard
							icon={<Shield className='h-5 w-5' />}
							accent='orange'
							title='Team Pages'
							description="Per-team performance metrics, confidence-rated FDR, and your team's full fixture schedule — upcoming and past results."
						/>
					</div>
				</div>
			</section>

			{/* ── How the model works ── */}
			<section className='container mx-auto px-4 py-16'>
				<div className='mx-auto max-w-7xl'>
					<h2 className='mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
						How the model works
					</h2>
					<p className='mb-10 text-muted-foreground'>
						Four factors, dynamically weighted by season stage.
					</p>

					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						<ModelFactorCard
							icon={<Gauge className='size-[1em]' />}
							accent='amber'
							title='Base Strength'
							description="FPL's six strength metrics (overall, attack, defence × home/away) normalised to a 1–5 scale."
							weight='50–80%'
						/>
						<ModelFactorCard
							icon={<BarChart2 className='size-[1em]' />}
							accent='blue'
							title='Season Performance'
							description='Actual points per game and goal difference versus rank-adjusted expectations. Grows in influence as more data arrives.'
							weight='5–35%'
						/>
						<ModelFactorCard
							icon={<Activity className='size-[1em]' />}
							accent='emerald'
							title='Recent Form'
							description='Last 5 results, recency-weighted (1.0 → 0.2) and adjusted for opponent strength so context is preserved.'
							weight='10–15%'
						/>
						<ModelFactorCard
							icon={<Shield className='size-[1em]' />}
							accent='slate'
							title='Home Advantage'
							description='A ±0.15 correction applied to every fixture, scaled by the current model weights.'
							weight='5%'
						/>
					</div>

					<p className='mt-6 text-sm text-muted-foreground'>
						Every score carries a{' '}
						<span className='font-medium text-foreground'>confidence interval</span>{' '}
						— wider early in the season when sample sizes are small, narrowing as more
						data accumulates.
					</p>
				</div>
			</section>

			{/* ── Footer CTA ── */}
			<section className='border-t border-border bg-muted/30'>
				<div className='container mx-auto flex flex-col items-center px-4 py-14 text-center'>
					<h2 className='mb-4 text-2xl font-semibold tracking-tight text-foreground'>
						Ready to plan your transfers?
					</h2>
					<p className='mb-8 text-muted-foreground'>
						Open the fixture grid and see how your targets&apos; upcoming runs compare.
					</p>
					<Button asChild size='lg'>
						<Link href='/fixtures'>
							Open Fixture Grid
							<ChevronRight className='ml-1 h-4 w-4' />
						</Link>
					</Button>
				</div>
			</section>
		</div>
	)
}

function FeatureCard({
	icon,
	accent,
	title,
	description,
}: {
	icon: React.ReactNode
	accent: AccentColor
	title: string
	description: string
}) {
	return (
		<div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
			<div
				className={cn(
					'mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg',
					ICON_STYLES[accent],
				)}
			>
				{icon}
			</div>
			<h3 className='mb-2 font-semibold text-foreground'>{title}</h3>
			<p className='text-sm leading-relaxed text-muted-foreground'>{description}</p>
		</div>
	)
}

function ModelFactorCard({
	icon,
	accent,
	title,
	description,
	weight,
}: {
	icon: React.ReactNode
	accent: AccentColor
	title: string
	description: string
	weight: string
}) {
	return (
		<div
			className={cn(
				'rounded-lg border border-border border-l-4 bg-card p-5',
				BORDER_STYLES[accent],
			)}
		>
			<div className='mb-2 flex items-center justify-between gap-2 text-sm font-medium text-foreground'>
				<div className='flex min-w-0 items-center gap-1.5'>
					<span className={cn('inline-flex shrink-0 items-center', ICON_TEXT[accent])}>
						{icon}
					</span>
					<span className='truncate'>{title}</span>
				</div>
				<span
					className={cn(
						'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
						BADGE_STYLES[accent],
					)}
				>
					{weight}
				</span>
			</div>
			<p className='text-sm leading-relaxed text-muted-foreground'>{description}</p>
		</div>
	)
}
