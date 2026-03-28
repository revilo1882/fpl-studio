'use client'

import { use, useState, useEffect } from 'react'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ChevronLeft } from 'lucide-react'

import {
	buildLeagueAverageOpponent,
	calculateSeasonPerformance,
	type EnhancedFDRResult,
	type SeasonPerformance,
} from '@/lib/fdr'
import { calculateDynamicFDR } from '@/lib/fdr/dynamicFDR'
import { generateTeamFixtureRow, type SingleFixture } from '@/lib/fixtures/generateFixtureMatrix'
import type { Fixture, Team as FPLTeam } from '@/types/fpl'
import { TeamHeader } from '@/app/team/[slug]/components/TeamHeader'
import { TeamPerformanceCard } from '@/app/team/[slug]/components/TeamPerformanceCard'
import { TeamStrengthCard } from '@/app/team/[slug]/components/TeamStrengthCard'
import { TeamFixturesTabs } from '@/app/team/[slug]/components/TeamFixturesTabs'
import { useFPLServerContext } from '@/contexts/FPLServerContext'
import DataUnavailable from '@/components/layout/DataUnavailable'

interface ITeamData {
	teamPerformance: SeasonPerformance
	teamOverallFDR: EnhancedFDRResult
	upcomingFixtures: SingleFixture[]
	pastFixtures: Fixture[]
}

const TeamPage = ({
	params: paramsPromise,
}: {
	params: Promise<{ slug: string }>
}) => {
	const params = use(paramsPromise)
	const { bootstrapData, fixtures } = useFPLServerContext()
	const [loading, setLoading] = useState(true)
	const [teamData, setTeamData] = useState<ITeamData | undefined>()

	const team = bootstrapData?.teams.find(
		(t) => t.short_name.toLowerCase() === params.slug,
	)

	const currentGameweek =
		bootstrapData?.events.find((e) => e.is_current)?.id ??
		bootstrapData?.events.find((e) => e.is_next)?.id ??
		1

	useEffect(() => {
		if (!team || !bootstrapData || !fixtures) return

		const loadTeamData = async () => {
			setLoading(true)
			try {
				const leagueAverage = buildLeagueAverageOpponent(bootstrapData!.teams)
				// Opponent must be the viewed team so base FDR uses their strength_* fields (not the same for every club).
				const [teamPerformance, teamOverallFDR, teamFixtureRow] = await Promise.all([
					calculateSeasonPerformance(team!.id, fixtures!, currentGameweek),
					calculateDynamicFDR(
						leagueAverage,
						team!,
						fixtures!,
						bootstrapData!.teams,
						true,
						currentGameweek,
					),
					generateTeamFixtureRow({
						teamId: team!.id,
						teams: bootstrapData!.teams,
						fixtures: fixtures!,
						bootstrapData: bootstrapData!,
						firstGameweek: 1,
						numberOfGameweeks: 38,
						difficultyType: 'Overall',
					}),
				])

				const currentTeamProcessedFixtures: SingleFixture[] = teamFixtureRow.flat()

				const now = new Date()
				const upcomingFixtures = currentTeamProcessedFixtures.filter(
					(f) =>
						f.gameweekId >= currentGameweek &&
						f.label !== '-' &&
						(!f.kickoffTime || new Date(f.kickoffTime) > now),
				)

			const pastFixtures = fixtures!
				.filter(
					(f) =>
						(f.team_h === team!.id || f.team_a === team!.id) &&
						f.finished,
				)
				.sort((a, b) => (b.event ?? 0) - (a.event ?? 0))

				setTeamData({ teamPerformance, teamOverallFDR, upcomingFixtures, pastFixtures })
			} finally {
				setLoading(false)
			}
		}

		loadTeamData()
	}, [team?.id, fixtures, bootstrapData, currentGameweek, team])

	if (!bootstrapData || !fixtures) return <DataUnavailable />
	if (!team) notFound()

	if (loading) {
		return (
		<main className='container mx-auto flex h-full max-w-7xl items-center justify-center px-4'>
			<div className='text-muted-foreground'>Loading team data...</div>
		</main>
	)
}

	return (
		<main className='container mx-auto flex max-w-7xl flex-col px-4 py-6 md:h-full md:min-h-0 md:overflow-hidden'>
			<Link
				href='/fixtures'
				className='mb-4 inline-flex shrink-0 items-center text-sm text-muted-foreground hover:underline'
			>
				<ChevronLeft className='mr-1 h-4 w-4' />
				Back to Fixture Grid
			</Link>

			<div className='shrink-0'>
				<TeamHeader team={team} />
			</div>

			{/* Two-column grid that fills all remaining height */}
			<div className='grid grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-2 md:overflow-hidden'>
				{/* Stats column — content-height cards, scrolls within column if needed */}
				<div className='flex flex-col gap-6 overflow-y-auto pb-4'>
					{teamData?.teamPerformance && (
						<TeamPerformanceCard
							teamPerformance={teamData.teamPerformance}
							teamId={team.id}
							allFixtures={fixtures}
						/>
					)}
					{teamData?.teamOverallFDR && (
						<TeamStrengthCard
							teamName={team.name}
							teamOverallFDR={teamData.teamOverallFDR}
						/>
					)}
				</div>

				{/* Fixtures column — fills remaining height, scrolls internally */}
				<div className='flex min-h-0 flex-col overflow-hidden'>
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

export default TeamPage
