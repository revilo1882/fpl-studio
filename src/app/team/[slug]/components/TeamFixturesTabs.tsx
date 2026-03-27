'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FixtureChip } from '@/components/FixtureChip'
import type { SingleFixture } from '@/lib/generateFixtureMatrix'
import type { Fixtures, Team } from '@/types/fpl'
import { getTeamBadgeUrl } from '@/lib/fpl/badges'
import { cn } from '@/lib/utils'

type MatchResult = 'W' | 'D' | 'L'

const RESULT_STYLES: Record<MatchResult, string> = {
	W: 'bg-green-500 text-white',
	D: 'bg-yellow-400 text-black',
	L: 'bg-red-500 text-white',
}

function getResult(myScore: number, theirScore: number): MatchResult {
	if (myScore > theirScore) return 'W'
	if (myScore < theirScore) return 'L'
	return 'D'
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

interface TeamFixturesTabsProps {
	team: Team
	upcomingFixtures: SingleFixture[]
	pastFixtures: Fixtures
	allTeams: Team[]
	allFixtures: Fixtures
}

export function TeamFixturesTabs({
	team,
	upcomingFixtures,
	pastFixtures,
	allTeams,
	allFixtures,
}: TeamFixturesTabsProps) {
	return (
		<Card className='flex h-full flex-col overflow-hidden border'>
			<CardHeader className='border-b pb-3 pt-4'>
				<CardTitle>Matches</CardTitle>
			</CardHeader>
			<CardContent className='min-h-0 flex-1 overflow-y-auto p-4'>
				<Tabs defaultValue='upcoming' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='upcoming'>Fixtures</TabsTrigger>
						<TabsTrigger value='results'>Results</TabsTrigger>
					</TabsList>

					{/* ── Upcoming fixtures ── */}
					<TabsContent value='upcoming' className='mt-4'>
						{upcomingFixtures.length === 0 ? (
							<p className='text-muted-foreground'>No upcoming fixtures.</p>
						) : (
							<div className='flex flex-col gap-3'>
								{upcomingFixtures.map((fixture, index) => {
									const opponentCode = fixture.opponentCode
									const opponentTeam = allTeams.find(
										(t) => t.code === opponentCode,
									)
									return (
										<div
											key={index}
											className='flex flex-col gap-2 rounded-lg border p-3'
										>
											<div className='flex items-center justify-between'>
												<span className='font-semibold text-foreground'>
													GW {fixture.gameweekId}
												</span>
												<span className='text-sm text-muted-foreground'>
													{fixture.kickoffTime
														? formatDate(fixture.kickoffTime)
														: 'TBD'}
												</span>
											</div>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												{opponentCode !== 0 && (
													<Image
														src={getTeamBadgeUrl(opponentCode)}
														alt={`${fixture.opponentName} badge`}
														width={20}
														height={20}
														className='rounded-full'
														unoptimized
													/>
												)}
												{opponentTeam ? (
													<Link
														href={`/team/${opponentTeam.short_name.toLowerCase()}`}
														className='font-medium hover:underline'
													>
														{fixture.opponentName}
													</Link>
												) : (
													<span className='font-medium'>
														{fixture.opponentName}
													</span>
												)}
												<span className='text-sm text-muted-foreground'>
													{fixture.isHome ? '(H)' : '(A)'}
												</span>
											</div>
											<FixtureChip
												fixture={fixture}
												teams={allTeams}
												difficultyType='Overall'
												fixtures={allFixtures}
												compact
											/>
										</div>
										</div>
									)
								})}
							</div>
						)}
					</TabsContent>

					{/* ── Past results ── */}
					<TabsContent value='results' className='mt-4'>
						{pastFixtures.length === 0 ? (
							<p className='text-muted-foreground'>No results yet.</p>
						) : (
							<div className='flex flex-col gap-3'>
								{pastFixtures.map((fixture, index) => {
									const isHome = fixture.team_h === team.id
									const opponent = allTeams.find(
										(t) =>
											t.id === (isHome ? fixture.team_a : fixture.team_h),
									)
									const myScore = isHome
										? fixture.team_h_score
										: fixture.team_a_score
									const theirScore = isHome
										? fixture.team_a_score
										: fixture.team_h_score
									const hasScore =
										myScore !== null && theirScore !== null
									const result = hasScore
										? getResult(myScore!, theirScore!)
										: null

									return (
									<div
										key={index}
										className='flex flex-col gap-2 rounded-lg border p-3'
									>
										<div className='flex items-center justify-between'>
											<span className='font-semibold text-foreground'>
												GW {fixture.event ?? 'N/A'}
											</span>
											<span className='text-sm text-muted-foreground'>
												{fixture.kickoff_time
													? formatDate(fixture.kickoff_time)
													: 'N/A'}
											</span>
										</div>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2'>
													{opponent && opponent.code !== 0 && (
														<Image
															src={getTeamBadgeUrl(opponent.code)}
															alt={`${opponent.name} badge`}
															width={20}
															height={20}
															className='rounded-full'
															unoptimized
														/>
													)}
													{opponent ? (
														<Link
															href={`/team/${opponent.short_name.toLowerCase()}`}
															className='font-medium hover:underline'
														>
															{opponent.name}
														</Link>
													) : (
														<span className='font-medium'>Unknown</span>
													)}
													<span className='text-sm text-muted-foreground'>
														{isHome ? '(H)' : '(A)'}
													</span>
												</div>
												<div className='flex items-center gap-2'>
													{result && (
														<span
															className={cn(
																'flex h-5 w-5 items-center justify-center rounded text-xs font-bold',
																RESULT_STYLES[result],
															)}
														>
															{result}
														</span>
													)}
													<span
														className={cn(
															'tabular-nums font-semibold',
															!hasScore && 'text-muted-foreground',
														)}
													>
														{hasScore
															? `${myScore} – ${theirScore}`
															: 'N/A'}
													</span>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
