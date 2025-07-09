'use client'

import { useState } from 'react'

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { generateFixtureMatrix } from '@/lib/generateFixtureMatrix'
import { FixtureGrid } from '@/components/FixtureGrid'
import type { BootstrapData, Fixtures } from '@/types/fpl'

import { Label } from './ui/label'

type FixtureGridPageProps = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

export const FixtureGridPage = ({ bootstrapData, fixtures }: FixtureGridPageProps) => {
	const { teams, events } = bootstrapData
	const currentGameweek = events.find((event) => event.is_current)?.id
	const nextGameweek = events.find((event) => event.is_next)?.id
	const firstGameweek = currentGameweek || nextGameweek || 1
	const remainingGameweeks = events.length - (firstGameweek - 1)
	const gameweekOptions = Array.from({ length: remainingGameweeks }, (_, index) => index + 1)

	const [numberOfGameweeks, setNumberOfGameweeks] = useState(
		6 > remainingGameweeks ? remainingGameweeks : 6,
	)

	const { teamNames, fixtureMatrix, averages } = generateFixtureMatrix({
		teams,
		fixtures,
		firstGameweek,
		numberOfGameweeks,
	})

	return (
		<main className='p-4'>
			<div className='mb-4 mt-8 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Fixture Difficulty</h1>
				<div className='grid gap-2'>
					<Label htmlFor='gameweek-select'>Gameweeks</Label>
					<Select
						defaultValue={String(numberOfGameweeks)}
						onValueChange={(v) => setNumberOfGameweeks(Number(v))}
					>
						<SelectTrigger id='gameweek-select' className=''>
							<SelectValue placeholder='Select...' />
						</SelectTrigger>
						<SelectContent className='min-w-fit'>
							{gameweekOptions.map((gw) => (
								<SelectItem key={gw} value={String(gw)}>
									{gw}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<FixtureGrid
				teams={teamNames}
				fixtureMatrix={fixtureMatrix}
				averages={averages}
				events={events}
				firstGameweek={firstGameweek}
				numberOfGameweeks={numberOfGameweeks}
			/>
		</main>
	)
}
