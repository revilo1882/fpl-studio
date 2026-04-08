'use client'

import { useMemo } from 'react'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { BootstrapData, Fixtures } from '@/types/fpl'
import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'
import { getDifficultyUI } from '@/lib/fixtures/fixtureGridUtils'
import { getHomeAwayFdrForFixture } from '@/lib/fixtures/scheduleFdr'
import {
	clampGameweekId,
	groupFixturesForSchedule,
	type ScheduleDayGroup,
} from '@/lib/fixtures/scheduleFixtures'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TeamBadge } from '@/components/team/TeamBadge'

type FixtureSchedulePanelProps = {
	bootstrapData: BootstrapData
	fixtures: Fixtures
	gameweekId: number
	onGameweekChange: (id: number) => void
	difficultyType: DifficultyType
}

const formatTimeLocal = (iso: string | null) => {
	if (!iso) return 'TBC'
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return 'TBC'
	return new Intl.DateTimeFormat(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	}).format(d)
}

const formatDeadline = (iso: string) => {
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return null
	return new Intl.DateTimeFormat(undefined, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	}).format(d)
}

function gameweekRangeLabel(groups: ScheduleDayGroup[]): string | null {
	const kickoffs = groups.flatMap((g) =>
		g.rows.map((r) => r.fixture.kickoff_time).filter((t): t is string => Boolean(t)),
	)
	if (kickoffs.length === 0) return null
	const dates = kickoffs.map((k) => new Date(k).getTime()).filter((t) => !Number.isNaN(t))
	if (dates.length === 0) return null
	const min = Math.min(...dates)
	const max = Math.max(...dates)
	const fmt = (ms: number) =>
		new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(
			new Date(ms),
		)
	if (min === max) return fmt(min)
	return `${fmt(min)} – ${fmt(max)}`
}

/**
 * time | home | score/v | away | spacer
 * The spacer matches the time column width so the score column sits at the
 * geometric centre of the row.
 */
const SCHEDULE_ROW_GRID =
	'grid grid-cols-[2.5rem_1fr_minmax(3.25rem,4rem)_1fr_2.5rem] gap-x-2 sm:grid-cols-[3rem_1fr_4.5rem_1fr_3rem] sm:gap-x-3'

const fdrLabel = (value: number, difficultyType: DifficultyType) =>
	difficultyType === 'FPL' ? String(Math.round(value)) : value.toFixed(2)

export const FixtureSchedulePanel = ({
	bootstrapData,
	fixtures,
	gameweekId,
	onGameweekChange,
	difficultyType,
}: FixtureSchedulePanelProps) => {
	const events = bootstrapData.events ?? []
	const teams = bootstrapData.teams ?? []
	const maxGw = events.length
	const gw = clampGameweekId(gameweekId, maxGw)

	const teamById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams])

	const eventMeta = events.find((e) => e.id === gw)
	const isFinished = eventMeta?.is_finished ?? false

	const groups = useMemo(
		() => groupFixturesForSchedule(fixtures, teams, gw),
		[fixtures, teams, gw],
	)

	const fdrByFixtureId = useMemo(() => {
		const map = new Map<number, { home: number; away: number }>()
		for (const f of fixtures) {
			if (f.event !== gw) continue
			map.set(f.id, getHomeAwayFdrForFixture(f, teams, fixtures, gw, difficultyType))
		}
		return map
	}, [fixtures, teams, gw, difficultyType])

	const rangeLabel = useMemo(() => gameweekRangeLabel(groups), [groups])
	const deadlineFormatted = eventMeta?.deadline_time
		? formatDeadline(eventMeta.deadline_time)
		: null

	const canGoPrev = gw > 1
	const canGoNext = gw < maxGw

	return (
		<div className='flex w-full min-w-0 flex-col gap-4 pt-2'>

		{/* ── Header ─────────────────────────────────────────────── */}
		<div className='flex flex-col items-center gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-start'>

			{/* Spacer — keeps nav perfectly centred on desktop */}
			<div className='hidden sm:block' />

			{/* Navigation */}
			<div className='flex items-center gap-4 sm:gap-6'>
					<Button
						type='button'
						variant='outline'
						size='icon'
						className='h-10 w-10 shrink-0 rounded-full'
						disabled={!canGoPrev}
						aria-label='Previous gameweek'
						onClick={() => onGameweekChange(gw - 1)}
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>

					<div className='flex flex-col items-center gap-1'>
						<h2 className='whitespace-nowrap text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
							Gameweek {gw}
						</h2>
						{isFinished && (
							<span className='rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'>
								Completed
							</span>
						)}
					</div>

					<Button
						type='button'
						variant='outline'
						size='icon'
						className='h-10 w-10 shrink-0 rounded-full'
						disabled={!canGoNext}
						aria-label='Next gameweek'
						onClick={() => onGameweekChange(gw + 1)}
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>

			{/* Meta — centred on mobile, right-aligned on desktop */}
			<div className='flex flex-col items-center text-center text-xs leading-relaxed text-muted-foreground sm:items-end sm:text-right'>
					{rangeLabel ? <p>{rangeLabel}</p> : <p>Fixtures in this round</p>}
					{deadlineFormatted && <p>Deadline: {deadlineFormatted}</p>}
					<p className='mt-0.5 italic'>*All times shown in your local timezone</p>
				</div>
			</div>

			{/* ── Fixture list ────────────────────────────────────────── */}
			{groups.length === 0 ? (
				<p className='rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground'>
					No fixtures for this round in the FPL data.
				</p>
			) : (
				<div className='flex flex-col gap-8'>
					{groups.map((group) => (
						<section key={group.dateKey} aria-labelledby={`day-${group.dateKey}`}>
							<h3
								id={`day-${group.dateKey}`}
								className='mb-3 border-b border-border pb-1 text-sm font-medium text-muted-foreground'
							>
								{group.label}
							</h3>
							<ul className='flex flex-col gap-1'>
								{group.rows.map(({ fixture, homeName, awayName }) => {
									const { finished, started, kickoff_time, team_h_score, team_a_score } = fixture
									const isLive = started && !finished

									const statusLabel = finished
										? 'FT'
										: isLive
											? 'Live'
											: formatTimeLocal(kickoff_time)

									const scoreOrVs =
										finished || (started && team_h_score != null && team_a_score != null)
											? `${team_h_score ?? '—'} – ${team_a_score ?? '—'}`
											: 'v'

									const homeTeam = teamById.get(fixture.team_h)
									const awayTeam = teamById.get(fixture.team_a)

									const fdr = fdrByFixtureId.get(fixture.id)
									const homeF = fdr?.home ?? fixture.team_h_difficulty
									const awayF = fdr?.away ?? fixture.team_a_difficulty
									const homeUi = getDifficultyUI(homeF, difficultyType)
									const awayUi = getDifficultyUI(awayF, difficultyType)

									return (
										<li
											key={fixture.id}
											className={cn(
												SCHEDULE_ROW_GRID,
												'items-center gap-y-1 rounded-sm py-2 sm:py-1.5',
												isLive && 'border-l-2 border-primary bg-primary/5 pl-2',
											)}
										>
											{/* Time / status */}
											<div className='text-xs tabular-nums text-muted-foreground sm:text-sm'>
												{isLive ? (
													<span className='flex items-center gap-1 font-medium text-primary'>
														<span className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary' />
														{statusLabel}
													</span>
												) : (
													<span className={cn(finished && 'font-medium text-foreground/70')}>
														{statusLabel}
													</span>
												)}
											</div>

											{/* Home team */}
											<div className='flex min-w-0 items-center justify-end gap-2'>
												<div className='flex min-w-0 items-center justify-end gap-1.5'>
													<span className='min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-base'>
														{homeTeam ? (
															<Link
																href={`/team/${homeTeam.short_name.toLowerCase()}`}
																className='hover:underline'
															>
																{homeName}
															</Link>
														) : homeName}
													</span>
													{homeTeam ? (
														<Link href={`/team/${homeTeam.short_name.toLowerCase()}`}>
															<TeamBadge code={homeTeam.code} name={homeName} size={28} />
														</Link>
													) : null}
												</div>
											<span
												className={cn(
													'inline-flex shrink-0 justify-center rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums text-black dark:text-white sm:text-sm',
													homeUi.bg,
												)}
											>
												{fdrLabel(homeF, difficultyType)}
											</span>
											</div>

										{/* Score / vs */}
										<div
											className={cn(
												'text-center text-sm tabular-nums sm:text-base',
												finished
													? 'font-bold text-foreground'
													: 'text-muted-foreground',
											)}
										>
											{scoreOrVs}
										</div>

										{/* Away team */}
										<div className='flex min-w-0 items-center justify-start gap-2'>
											<span
												className={cn(
													'inline-flex shrink-0 justify-center rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums text-black dark:text-white sm:text-sm',
													awayUi.bg,
												)}
											>
												{fdrLabel(awayF, difficultyType)}
											</span>
											<div className='flex min-w-0 items-center justify-start gap-1.5'>
												{awayTeam ? (
													<Link href={`/team/${awayTeam.short_name.toLowerCase()}`}>
														<TeamBadge code={awayTeam.code} name={awayName} size={28} />
													</Link>
												) : null}
												<span className='min-w-0 truncate text-left text-sm font-medium text-foreground sm:text-base'>
													{awayTeam ? (
														<Link
															href={`/team/${awayTeam.short_name.toLowerCase()}`}
															className='hover:underline'
														>
															{awayName}
														</Link>
													) : awayName}
												</span>
											</div>
										</div>

										{/* Spacer — mirrors the time column to keep score centred */}
										<div aria-hidden />
									</li>
									)
								})}
							</ul>
						</section>
					))}
				</div>
			)}

			{/* Rating note for completed gameweeks */}
			{isFinished && (
				<p className='text-xs text-muted-foreground/60 italic'>
					* FDR ratings shown reflect current team form, not ratings at kickoff.
				</p>
			)}
		</div>
	)
}
