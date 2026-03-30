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
import { TeamBadge } from '@/components/team/TeamBadge'
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
	searchParams: searchParamsPromise,
}: {
	params: Promise<{ slug: string }>
	searchParams: Promise<{ from?: string }>
}) => {
	const params = use(paramsPromise)
	const { from } = use(searchParamsPromise)
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

		const loadTeamData = () => {
			setLoading(true)
			try {
				const leagueAverage = buildLeagueAverageOpponent(bootstrapData!.teams)
				// Opponent must be the viewed team so base FDR uses their strength_* fields (not the same for every club).
				const teamPerformance = calculateSeasonPerformance(team!.id, fixtures!, currentGameweek)
				const teamOverallFDR = calculateDynamicFDR(
					leagueAverage,
					team!,
					fixtures!,
					bootstrapData!.teams,
					true,
					currentGameweek,
				)
				const teamFixtureRow = generateTeamFixtureRow({
					teamId: team!.id,
					teams: bootstrapData!.teams,
					fixtures: fixtures!,
					bootstrapData: bootstrapData!,
					firstGameweek: 1,
					numberOfGameweeks: 38,
					difficultyType: 'Overall',
				})

				const currentTeamProcessedFixtures: SingleFixture[] = teamFixtureRow.flat()

			const now = new Date()
			const upcomingFixtures = currentTeamProcessedFixtures.filter(
				(fixture) =>
					fixture.gameweekId >= currentGameweek &&
					fixture.label !== '-' &&
					(!fixture.kickoffTime || new Date(fixture.kickoffTime) > now),
			)

			const pastFixtures = fixtures!
				.filter(
					(fixture) =>
						(fixture.team_h === team!.id || fixture.team_a === team!.id) &&
						fixture.finished,
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
	<main className='container mx-auto flex max-w-7xl items-center justify-center px-4'>
		<div className='text-muted-foreground'>Loading team data...</div>
	</main>
	)
}

	const backHref = from === 'strengths' ? '/strengths' : '/fixtures'
	const backLabel = from === 'strengths' ? 'Back to Strengths Table' : 'Back to Fixture Grid'

	return (
		<main className='container mx-auto flex max-w-7xl flex-col px-4 lg:h-full lg:min-h-0'>
			{/* Page header */}
			<div className='shrink-0 pb-3 pt-4'>
				<Link
					href={backHref}
					className='mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
				>
					<ChevronLeft className='h-3.5 w-3.5' />
					{backLabel}
				</Link>
				<div className='flex min-w-0 items-center gap-3'>
					<TeamBadge code={team.code} name={team.name} size={36} className='shrink-0 object-contain' />
					<div className='min-w-0'>
						<h1 className='truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
							{team.name}
						</h1>
						<p className='text-sm text-muted-foreground'>{team.short_name}</p>
					</div>
				</div>
			</div>

			{/* Two-column layout: stacked on mobile, bounded side-by-side on desktop */}
			<div className='flex min-h-0 flex-1 flex-col gap-6 overflow-hidden py-4 lg:flex-row'>
				{/* Stats column — outer div is the bounded scroll container;
				    inner div is unconstrained so cards are never flex-shrunk */}
				<div className='lg:min-h-0 lg:flex-1 lg:overflow-y-auto'>
					<div className='flex flex-col gap-6 lg:pb-4'>
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
				</div>

				{/* Matches column — fills height on desktop, internal scroll */}
				<div className='lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden'>
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
