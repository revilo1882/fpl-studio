'use client'

import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FixtureChip } from '@/components/FixtureChip'
import { getDifficultyUI } from '@/lib/fixtureGridUtils'
import type { SingleFixture } from '@/lib/generateFixtureMatrix'
import type { Fixtures, Team } from '@/types/fpl'
import { getTeamBadgeUrl } from '@/lib/fpl/badges'
import { cn } from '@/lib/utils'

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
			<CardHeader className='border-b'>
				<CardTitle>Fixtures</CardTitle>
			</CardHeader>
			<CardContent className='min-h-0 flex-1 overflow-y-auto p-4'>
				<Tabs defaultValue='upcoming' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='upcoming'>Upcoming Fixtures</TabsTrigger>
						<TabsTrigger value='results'>Results</TabsTrigger>
					</TabsList>
					<TabsContent value='upcoming' className='mt-4'>
						{upcomingFixtures.length === 0 ? (
							<p className='text-muted-foreground'>
								No upcoming fixtures found for {team.name}.
							</p>
						) : (
							<div className='grid grid-cols-1 gap-4'>
								{upcomingFixtures.map((fixture, index) => {
									const opponentCode = fixture.opponentCode
									const gameweekNumber = fixture.gameweekId

									return (
										<div
											key={index}
											className='flex flex-col gap-2 rounded-lg border p-3'
										>
											<div className='flex items-center justify-between'>
												<span className='font-semibold text-foreground'>
													GW {gameweekNumber ?? 'N/A'}
												</span>
												<span className='text-sm text-muted-foreground'>
													{fixture.kickoffTime
														? new Date(
																fixture.kickoffTime,
															).toLocaleDateString('en-GB', {
																day: 'numeric',
																month: 'short',
															})
														: 'TBD'}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												{opponentCode !== 0 && (
													<Image
														src={
															getTeamBadgeUrl(opponentCode) ||
															'/placeholder.svg'
														}
														alt={`${fixture.opponentName} badge`}
														width={24}
														height={24}
														className='rounded-full'
														unoptimized
													/>
												)}
												<span className='font-medium'>
													{fixture.opponentName}
												</span>
												<span className='text-sm text-muted-foreground'>
													{fixture.isHome ? '(H)' : '(A)'}
												</span>
											</div>
											<FixtureChip
												fixture={fixture}
												teams={allTeams}
												difficultyType='Overall'
												fixtures={allFixtures}
											/>
										</div>
									)
								})}
							</div>
						)}
					</TabsContent>
					<TabsContent value='results' className='mt-4'>
						{pastFixtures.length === 0 ? (
							<p className='text-muted-foreground'>
								No past results found for {team.name}.
							</p>
						) : (
							<div className='grid grid-cols-1 gap-4'>
								{pastFixtures.map((fixture, index) => {
									const isHome = fixture.team_h === team.id
									const opponent = allTeams.find(
										(t) => t.id === (isHome ? fixture.team_a : fixture.team_h),
									)
									const teamScore = fixture.team_h_score
									const opponentScore = fixture.team_a_score
									const resultClass =
										teamScore !== null && opponentScore !== null
											? teamScore > opponentScore
												? 'text-green-600 font-bold'
												: teamScore < opponentScore
													? 'text-red-600 font-bold'
													: 'text-yellow-600 font-bold'
											: 'text-muted-foreground'

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
														? new Date(
																fixture.kickoff_time,
															).toLocaleDateString('en-GB', {
																day: 'numeric',
																month: 'short',
															})
														: 'N/A'}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												{opponent && opponent.code !== 0 && (
													<Image
														src={
															getTeamBadgeUrl(opponent.code) ||
															'/placeholder.svg'
														}
														alt={`${opponent?.name || 'Unknown'} badge`}
														width={24}
														height={24}
														className='rounded-full'
														unoptimized
													/>
												)}
												<span className='font-medium'>
													{opponent?.name || 'Unknown'}
												</span>
												<span className='text-sm text-muted-foreground'>
													{isHome ? '(H)' : '(A)'}
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-sm text-muted-foreground'>
													Score:
												</span>
												<span
													className={cn(
														'text-lg tabular-nums',
														resultClass,
													)}
												>
													{teamScore !== null && opponentScore !== null
														? `${teamScore} - ${opponentScore}`
														: 'N/A'}
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-sm text-muted-foreground'>
													FPL Difficulty:
												</span>
												<span
													className={cn(
														'text-sm font-medium',
														getDifficultyUI(
															isHome
																? fixture.team_h_difficulty
																: fixture.team_a_difficulty,
															'FPL',
														).text,
													)}
												>
													{isHome
														? fixture.team_h_difficulty
														: fixture.team_a_difficulty}
												</span>
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
