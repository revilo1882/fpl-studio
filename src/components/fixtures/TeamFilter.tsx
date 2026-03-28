'use client'

import * as React from 'react'

import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import type { Team } from '@/types/fpl'

type TeamFilterProps = {
	teams: Team[]
	selectedTeams: string[]
	onSelectionChange: (selected: string[]) => void
	maxTeams?: number
	inline?: boolean
}

export const TeamFilter = ({
	teams,
	selectedTeams,
	onSelectionChange,
	maxTeams,
	inline,
}: TeamFilterProps) => {
	const handleSelect = (teamName: string) => {
		const isSelected = selectedTeams.includes(teamName)

		if (isSelected) {
			const newSelection = selectedTeams.filter((name) => name !== teamName)
			onSelectionChange(newSelection)
		} else if (!maxTeams || selectedTeams.length < maxTeams) {
			const newSelection = [...selectedTeams, teamName]
			onSelectionChange(newSelection)
		}
	}

	const getButtonText = () => {
		if (selectedTeams.length === 0) {
			return 'All Teams'
		}
		if (selectedTeams.length === 1) {
			return '1 team selected'
		}
		return `${selectedTeams.length} teams selected`
	}

	const isAtLimit = maxTeams && selectedTeams.length >= maxTeams

	return (
		<div className='grid gap-2'>
			<Label htmlFor='team-filter' className='mb-1 block'>
				<span className='inline-flex items-baseline gap-2'>
					<span>Filter Teams</span>
					<span className='inline-block w-[60px] text-xs text-muted-foreground'>
						{typeof maxTeams === 'number' ? `(Max ${maxTeams})` : '\u00A0'}
					</span>
				</span>
			</Label>
			<DropdownMenu modal={!inline}>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' className='w-[200px] justify-between'>
						{getButtonText()}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align='start'
					side='bottom'
					sideOffset={8}
					collisionPadding={8}
					className='z-[9999] max-h-[60vh] w-[min(92vw,22rem)] overflow-auto sm:w-64'
				>
					{selectedTeams.length > 0 && (
						<>
							<DropdownMenuItem
								onSelect={() => onSelectionChange([])}
								className='text-destructive focus:bg-destructive/10 focus:text-destructive'
							>
								Clear all selections
							</DropdownMenuItem>
							<DropdownMenuSeparator />
						</>
					)}
					{teams.map((team) => {
						const isSelected = selectedTeams.includes(team.name)
						const isDisabled = !!(!isSelected && isAtLimit)

						return (
							<DropdownMenuCheckboxItem
								key={team.id}
								checked={isSelected}
								disabled={isDisabled}
								onSelect={(e) => {
									e.preventDefault()
									if (!isDisabled) {
										handleSelect(team.name)
									}
								}}
								className={isDisabled ? 'cursor-not-allowed opacity-50' : ''}
							>
								{team.name}
							</DropdownMenuCheckboxItem>
						)
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
