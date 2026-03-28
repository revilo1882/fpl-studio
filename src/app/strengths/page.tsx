import type { Metadata } from 'next'

import { FixturePageHeader } from '@/components/fixtures/FixturePageHeader'
import { getBootstrapData } from '@/lib/bootstrapServer'
import type { Team } from '@/types/fpl'

import { StrengthsTable } from './StrengthsTable'

export const metadata: Metadata = {
	title: 'Team strength snapshot',
	description:
		'Raw FPL attack and defence strength metrics (1000–1400 scale) used as inputs to the Studio FDR model.',
}

const StrengthsPage = async () => {
	const bootstrap = await getBootstrapData()
	const teams: Team[] = bootstrap?.teams ?? []

	return (
		<div className='container mx-auto flex flex-col gap-4 px-4 py-4 sm:gap-6 sm:py-6 lg:h-full lg:overflow-hidden'>
			<div className='shrink-0'>
				<FixturePageHeader
					title='Team Strength Snapshot'
					subtitle='The raw FPL strength metrics used as base inputs to the FDR algorithm'
					className='mb-2 sm:mb-0'
				/>
			</div>

			<div className='lg:min-h-0 lg:flex-1'>
				<StrengthsTable teams={teams} />
			</div>

			<p className='shrink-0 text-xs text-muted-foreground'>
				Source: Official FPL API (
				<code className='text-xs'>bootstrap-static</code>). Strength values are on a
				1000–1400 scale; FPL Studio normalises these to a 1–5 rating for the FDR model.
			</p>
		</div>
	)
}

export default StrengthsPage
