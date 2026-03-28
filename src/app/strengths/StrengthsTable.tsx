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

const columns: { key: SortKey; label: string; align?: 'right' }[] = [
	{ key: 'name', label: 'Team' },
	{ key: 'strength', label: 'Strength', align: 'right' },
	{ key: 'strength_overall_home', label: 'Overall (H)', align: 'right' },
	{ key: 'strength_overall_away', label: 'Overall (A)', align: 'right' },
	{ key: 'strength_attack_home', label: 'Attack (H)', align: 'right' },
	{ key: 'strength_attack_away', label: 'Attack (A)', align: 'right' },
	{ key: 'strength_defence_home', label: 'Defence (H)', align: 'right' },
	{ key: 'strength_defence_away', label: 'Defence (A)', align: 'right' },
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
		<div className='overflow-x-auto overflow-y-visible rounded-lg border lg:max-h-full lg:overflow-auto'>
			<Table className='min-w-max text-sm'>
				<TableHeader>
					<TableRow>
						{columns.map(({ key, label, align }) => (
							<TableHead
								key={key}
								className={
									key === 'name'
										? 'sticky left-0 top-0 z-20 whitespace-nowrap bg-card shadow-sm'
										: align === 'right'
											? 'sticky top-0 z-10 whitespace-nowrap bg-card text-right shadow-sm'
											: 'sticky top-0 z-10 whitespace-nowrap bg-card shadow-sm'
								}
							>
								<button
									type='button'
									onClick={() => handleSort(key)}
									className='inline-flex items-center gap-1.5 transition-colors hover:text-foreground'
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
						<TableRow key={team.id} className='hover:bg-muted/30'>
							<TableCell className='sticky left-0 z-10 bg-card font-medium'>
								<Link
									href={`/team/${team.short_name.toLowerCase()}`}
									className='hover:underline'
								>
									{team.name}
								</Link>{' '}
								<span className='text-xs text-muted-foreground'>({team.short_name})</span>
							</TableCell>
							<TableCell className='text-right tabular-nums'>{team.strength}</TableCell>
							<TableCell className='text-right tabular-nums'>
								{team.strength_overall_home}
							</TableCell>
							<TableCell className='text-right tabular-nums'>
								{team.strength_overall_away}
							</TableCell>
							<TableCell className='text-right tabular-nums'>
								{team.strength_attack_home}
							</TableCell>
							<TableCell className='text-right tabular-nums'>
								{team.strength_attack_away}
							</TableCell>
							<TableCell className='text-right tabular-nums'>
								{team.strength_defence_home}
							</TableCell>
							<TableCell className='text-right tabular-nums'>
								{team.strength_defence_away}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
