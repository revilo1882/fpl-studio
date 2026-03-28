import type { Metadata } from 'next'

import { FixturePageHeader } from '@/components/fixtures/FixturePageHeader'

export const metadata: Metadata = {
	title: 'About & methodology',
	description:
		'How FPL Studio builds Studio FDR from official FPL data: strength metrics, form, season performance, and weighting over the season.',
}

const AboutPage = () => {
	return (
		<div className='container mx-auto max-w-3xl flex flex-col gap-8 px-4 py-8 sm:py-10'>
			<FixturePageHeader
				title='About FPL Studio'
				subtitle='What this site does and where the numbers come from'
			/>

			<div className='space-y-6 text-sm leading-relaxed text-muted-foreground'>
				<section className='space-y-2'>
					<h2 className='text-base font-semibold text-foreground'>Data source</h2>
					<p>
						Numbers come from the public Fantasy Premier League API (
						<code className='rounded bg-muted px-1 py-0.5 text-xs text-foreground'>
							bootstrap-static
						</code>
						, fixtures, and related endpoints). This site is not affiliated with the Premier League
						or FPL.
					</p>
				</section>

				<section className='space-y-2'>
					<h2 className='text-base font-semibold text-foreground'>Studio FDR in plain terms</h2>
					<p>
						The official FPL fixture difficulty rating (FDR) is a coarse 1–5 label per match.{' '}
						<span className='font-medium text-foreground'>Studio FDR</span> recomputes
						difficulty using the same kind of inputs FPL exposes—team strength (attack/defence,
						home/away), recent form, and how the team has performed so far this season.
					</p>
					<p>
						Early in the season, ratings lean more on underlying strength; later on, actual results
						play a larger role so the model reflects what has happened on the pitch.
					</p>
				</section>

				<section className='space-y-2'>
					<h2 className='text-base font-semibold text-foreground'>Strengths page</h2>
					<p>
						The strengths table shows the raw FPL strength fields (typically on a 1000–1400 scale).
						Those values are normalised and combined inside the FDR model—you can use the table to
						see the inputs behind the headline ratings.
					</p>
				</section>

				<section className='space-y-2'>
					<h2 className='text-base font-semibold text-foreground'>Limits</h2>
					<p>
						Ratings are models, not predictions of scorelines or clean sheets. Injuries, lineups,
						and tactics are not included. Use alongside your own judgement.
					</p>
				</section>
			</div>
		</div>
	)
}

export default AboutPage
