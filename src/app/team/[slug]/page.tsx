import { notFound } from 'next/navigation'
import Link from 'next/link'

import { ChevronLeft } from 'lucide-react'

import { fetchFPLData } from '@/lib/fplApi'
import { calculateSeasonPerformance } from '@/lib/fdr'
import { calculateDynamicFDR } from '@/lib/fdr/dynamicFDR'
import { generateFixtureMatrix, type SingleFixture } from '@/lib/generateFixtureMatrix'
import type { BootstrapData, Fixtures, Team as FPLTeam } from '@/types/fpl'
import { TeamHeader } from '@/app/team/[slug]/components/TeamHeader'
import { TeamPerformanceCard } from '@/app/team/[slug]/components/TeamPerformanceCard'
import { TeamStrengthCard } from '@/app/team/[slug]/components/TeamStrengthCard'
import { TeamFixturesTabs } from '@/app/team/[slug]/components/TeamFixturesTabs'

export async function generateStaticParams() {
	const bootstrapData = await fetchFPLData<BootstrapData>('bootstrap-static')
	return bootstrapData.teams.map((team) => ({
		slug: team.short_name.toLowerCase(),
	}))
}

interface TeamPageProps {
	params: {
		slug: string
	}
}

export default async function TeamPage({ params }: TeamPageProps) {
	const [bootstrapData, allFixtures] = await Promise.all([
		fetchFPLData<BootstrapData>('bootstrap-static'),
		fetchFPLData<Fixtures>('fixtures'),
	])

	const team = bootstrapData.teams.find((t) => t.short_name.toLowerCase() === params.slug)

	if (!team) {
		notFound()
	}

	const currentGameweek =
		bootstrapData.events.find((event) => event.is_current)?.id ||
		bootstrapData.events.find((event) => event.is_next)?.id ||
		1

	const teamPerformance = await calculateSeasonPerformance(team.id, allFixtures, currentGameweek)

	const teamOverallFDR = await calculateDynamicFDR(
		team,
		{
			id: 999,
			name: 'Average Opponent',
			short_name: 'AVG',
			strength_overall_home: 1200,
			strength_overall_away: 1200,
			strength_attack_home: 1100,
			strength_attack_away: 1100,
			strength_defence_home: 1100,
			strength_defence_away: 1100,
			strength: 0,
			pulse_id: 0,
			code: 0,
			form: '',
		},
		allFixtures,
		bootstrapData.teams,
		true,
		currentGameweek,
	)

	const { fixtureMatrix } = await generateFixtureMatrix({
		teams: bootstrapData.teams,
		fixtures: allFixtures,
		bootstrapData,
		firstGameweek: 1,
		numberOfGameweeks: 38,
		difficultyType: 'overall',
	})

	const teamIndex = bootstrapData.teams.findIndex((t) => t.id === team.id)
	const currentTeamProcessedFixtures: SingleFixture[] =
		teamIndex !== -1 ? fixtureMatrix[teamIndex].flat() : []

	const upcomingFixtures = currentTeamProcessedFixtures.filter(
		(f) => f.gameweekId >= currentGameweek && f.label !== '-',
	)

	const pastFixtures = allFixtures
		.filter(
			(f) =>
				(f.team_h === team.id || f.team_a === team.id) &&
				f.finished &&
				(f.event ?? 0) < currentGameweek,
		)
		.sort((a, b) => (b.event ?? 0) - (a.event ?? 0))

	return (
		<main className='container mx-auto max-w-7xl px-4 py-6'>
			<Link
				href='/'
				className='mb-6 inline-flex items-center text-sm text-muted-foreground hover:underline'
			>
				<ChevronLeft className='mr-1 h-4 w-4' />
				Back to Fixture Grid
			</Link>

			<TeamHeader team={team} />

			<div className='grid h-[calc(100vh-200px)] grid-cols-1 gap-6 overflow-hidden md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'>
				<div className='flex h-full min-h-0 flex-col md:col-span-2 lg:col-span-2 xl:col-span-2'>
					<TeamPerformanceCard
						teamPerformance={teamPerformance}
						teamId={team.id}
						allFixtures={allFixtures}
					/>
				</div>
				<div className='flex h-full min-h-0 flex-col md:col-span-2 lg:col-span-2 xl:col-span-2'>
					<TeamStrengthCard teamName={team.name} teamOverallFDR={teamOverallFDR} />
				</div>
				<div className='flex h-full min-h-0 flex-col md:col-span-2 lg:col-span-4 xl:col-span-2'>
					<TeamFixturesTabs
						team={team as FPLTeam}
						upcomingFixtures={upcomingFixtures}
						pastFixtures={pastFixtures}
						allTeams={bootstrapData.teams as FPLTeam[]}
						allFixtures={allFixtures}
					/>
				</div>
			</div>
		</main>
	)
}
