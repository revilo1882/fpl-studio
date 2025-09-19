// page.tsx
'use client'

import { use, useState, useEffect } from 'react'

import Link from 'next/link'

import { ChevronLeft } from 'lucide-react'

import {
	calculateSeasonPerformance,
	type EnhancedFDRResult,
	type SeasonPerformance,
} from '@/lib/fdr'
import { calculateDynamicFDR } from '@/lib/fdr/dynamicFDR'
import { generateFixtureMatrix, type SingleFixture } from '@/lib/generateFixtureMatrix'
import type { BootstrapData, Fixture, Fixtures, Team as FPLTeam } from '@/types/fpl'
import { TeamHeader } from '@/app/team/[slug]/components/TeamHeader'
import { TeamPerformanceCard } from '@/app/team/[slug]/components/TeamPerformanceCard'
import { TeamStrengthCard } from '@/app/team/[slug]/components/TeamStrengthCard'
import { TeamFixturesTabs } from '@/app/team/[slug]/components/TeamFixturesTabs'
import { withFPLData } from '@/components/withFPLData'

interface TeamPageProps {
	params: Promise<{ slug: string }>
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

interface ITeamData {
	teamPerformance: SeasonPerformance
	teamOverallFDR: EnhancedFDRResult
	upcomingFixtures: SingleFixture[]
	pastFixtures: Fixture[]
}

function TeamPage({ params: paramsPromise, bootstrapData, fixtures }: TeamPageProps) {
	const params = use(paramsPromise)
	const [loading, setLoading] = useState(true)
	const [teamData, setTeamData] = useState<ITeamData>()

	const team = bootstrapData.teams.find((t) => t.short_name.toLowerCase() === params.slug)!

	const currentGameweek =
		bootstrapData.events.find((event) => event.is_current)?.id ||
		bootstrapData.events.find((event) => event.is_next)?.id ||
		1

	useEffect(() => {
		async function loadTeamData() {
			try {
				const [teamPerformance, teamOverallFDR, { fixtureMatrix }] = await Promise.all([
					calculateSeasonPerformance(team.id, fixtures, currentGameweek),
					calculateDynamicFDR(
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
						fixtures,
						bootstrapData.teams,
						true,
						currentGameweek,
					),
					generateFixtureMatrix({
						teams: bootstrapData.teams,
						fixtures,
						bootstrapData,
						firstGameweek: 1,
						numberOfGameweeks: 38,
						difficultyType: 'Overall',
					}),
				])

				const teamIndex = bootstrapData.teams.findIndex((t) => t.id === team.id)
				const currentTeamProcessedFixtures: SingleFixture[] =
					teamIndex !== -1 ? fixtureMatrix[teamIndex].flat() : []

				const upcomingFixtures = currentTeamProcessedFixtures.filter(
					(fixture) => fixture.gameweekId >= currentGameweek && fixture.label !== '-',
				)

				const pastFixtures = fixtures
					.filter(
						(fixture) =>
							(fixture.team_h === team.id || fixture.team_a === team.id) &&
							fixture.finished &&
							(fixture.event ?? 0) < currentGameweek,
					)
					.sort((a, b) => (b.event ?? 0) - (a.event ?? 0))

				setTeamData({
					teamPerformance,
					teamOverallFDR,
					upcomingFixtures,
					pastFixtures,
				})
			} finally {
				setLoading(false)
			}
		}

		loadTeamData()
	}, [team.id, fixtures, bootstrapData, currentGameweek, team])

	if (loading) {
		return (
			<main className='container mx-auto max-w-7xl px-4 py-6'>
				<div className='flex h-64 items-center justify-center'>
					<div>Loading team data...</div>
				</div>
			</main>
		)
	}

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
					{teamData?.teamPerformance && (
						<TeamPerformanceCard
							teamPerformance={teamData?.teamPerformance}
							teamId={team.id}
							allFixtures={fixtures}
						/>
					)}
				</div>
				<div className='flex h-full min-h-0 flex-col md:col-span-2 lg:col-span-2 xl:col-span-2'>
					{teamData?.teamOverallFDR && (
						<TeamStrengthCard
							teamName={team.name}
							teamOverallFDR={teamData?.teamOverallFDR}
						/>
					)}
				</div>
				<div className='flex h-full min-h-0 flex-col md:col-span-2 lg:col-span-4 xl:col-span-2'>
					<TeamFixturesTabs
						team={team as FPLTeam}
						upcomingFixtures={teamData?.upcomingFixtures || []}
						pastFixtures={teamData?.pastFixtures || []}
						allTeams={bootstrapData.teams as FPLTeam[]}
						allFixtures={fixtures}
					/>
				</div>
			</div>
		</main>
	)
}

export default withFPLData(TeamPage)
