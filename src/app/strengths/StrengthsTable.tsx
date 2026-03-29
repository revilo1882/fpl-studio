'use client'

import { useState } from 'react'

import Link from 'next/link'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { SortIndicator } from '@/components/fixtures/SortIndicator'
import type { Team } from '@/types/fpl'

type SortKey = keyof Pick<
	Team,
	| 'name'
	| 'strength'
	| 'strength_overall_home'
	| 'strength_overall_away'
	| 'strength_attack_home'
	| 'strength_attack_away'
	| 'strength_defence_home'
	| 'strength_defence_away'
>

type SortDir = 'ascending' | 'descending'

const columns: { key: SortKey; label: string; numeric?: boolean }[] = [
	{ key: 'name', label: 'Team' },
	{ key: 'strength', label: 'Strength', numeric: true },
	{ key: 'strength_overall_home', label: 'Overall (H)', numeric: true },
	{ key: 'strength_overall_away', label: 'Overall (A)', numeric: true },
	{ key: 'strength_attack_home', label: 'Attack (H)', numeric: true },
	{ key: 'strength_attack_away', label: 'Attack (A)', numeric: true },
	{ key: 'strength_defence_home', label: 'Defence (H)', numeric: true },
	{ key: 'strength_defence_away', label: 'Defence (A)', numeric: true },
]

export const StrengthsTable = ({ teams }: { teams: Team[] }) => {
	const [sortKey, setSortKey] = useState<SortKey>('name')
	const [sortDir, setSortDir] = useState<SortDir>('ascending')

	const handleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortDir((d) => (d === 'ascending' ? 'descending' : 'ascending'))
		} else {
			setSortKey(key)
			setSortDir(key === 'name' ? 'ascending' : 'descending')
		}
	}

	const sorted = [...teams].sort((a, b) => {
		const av = a[sortKey]
		const bv = b[sortKey]
		const cmp =
			typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
		return sortDir === 'ascending' ? cmp : -cmp
	})

	const sortConfig = { key: sortKey as string, direction: sortDir }

	return (
		<div className='min-w-0 rounded-lg border lg:max-h-full lg:min-h-0 lg:overflow-auto'>
			<Table className='min-w-max border-separate border-spacing-0 text-sm'>
				<TableHeader>
					<TableRow hoverHighlight={false} className='border-b'>
						{columns.map(({ key, label, numeric }) => (
							<TableHead
								key={key}
								className={
									key === 'name'
										? 'sticky left-0 top-0 z-40 h-auto min-h-12 whitespace-nowrap bg-card px-2 py-3 align-middle shadow-sm'
										: numeric
											? 'sticky top-0 z-30 h-auto min-h-12 whitespace-nowrap bg-card px-2 py-3 text-center align-middle shadow-sm'
											: 'sticky top-0 z-30 h-auto min-h-12 whitespace-nowrap bg-card px-2 py-3 align-middle shadow-sm'
								}
							>
								<button
									type='button'
									onClick={() => handleSort(key)}
									className={
										numeric
											? 'inline-flex min-h-10 w-full items-center justify-center gap-1.5 transition-colors hover:text-foreground'
											: 'inline-flex min-h-10 items-center gap-1.5 transition-colors hover:text-foreground'
									}
								>
									{label}
									<SortIndicator columnKey={key} sortConfig={sortConfig} />
								</button>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{sorted.map((team) => (
						<TableRow key={team.id} hoverHighlight={false}>
							<TableCell className='sticky left-0 z-10 bg-card font-medium'>
								<Link
									href={`/team/${team.short_name.toLowerCase()}`}
									className='hover:underline'
								>
									{team.name}
								</Link>{' '}
								<span className='text-xs text-muted-foreground'>({team.short_name})</span>
							</TableCell>
							<TableCell className='text-center tabular-nums'>{team.strength}</TableCell>
							<TableCell className='text-center tabular-nums'>
								{team.strength_overall_home}
							</TableCell>
							<TableCell className='text-center tabular-nums'>
								{team.strength_overall_away}
							</TableCell>
							<TableCell className='text-center tabular-nums'>
								{team.strength_attack_home}
							</TableCell>
							<TableCell className='text-center tabular-nums'>
								{team.strength_attack_away}
							</TableCell>
							<TableCell className='text-center tabular-nums'>
								{team.strength_defence_home}
							</TableCell>
							<TableCell className='text-center tabular-nums'>
								{team.strength_defence_away}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
