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
}

export const TeamFilter = ({ teams, selectedTeams, onSelectionChange }: TeamFilterProps) => {
	const handleSelect = (teamName: string) => {
		const isSelected = selectedTeams.includes(teamName)
		const newSelection = isSelected
			? selectedTeams.filter((name) => name !== teamName)
			: [...selectedTeams, teamName]
		onSelectionChange(newSelection)
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

	return (
		<div className='grid gap-2'>
			<Label>Filter Teams</Label>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' className='w-[200px] justify-between'>
						{getButtonText()}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='max-h-80 w-[200px] overflow-y-auto'>
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
					{teams.map((team) => (
						<DropdownMenuCheckboxItem
							key={team.id}
							checked={selectedTeams.includes(team.name)}
							onSelect={(e) => {
								e.preventDefault()
								handleSelect(team.name)
							}}
						>
							{team.name}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
