'use client'

import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface GameweekSelectorProps {
	numberOfGameweeks: number
	setNumberOfGameweeks: (num: number) => void
	gameweekOptions: number[]
}

export function GameweekSelector({
	numberOfGameweeks,
	setNumberOfGameweeks,
	gameweekOptions,
}: GameweekSelectorProps) {
	return (
		<div className='flex flex-col gap-2'>
			<Label htmlFor='gameweek-select'>Gameweeks</Label>
			<Select
				value={String(numberOfGameweeks)}
				onValueChange={(value) => setNumberOfGameweeks(Number(value))}
			>
				<SelectTrigger id='gameweek-select' className='w-[100px]'>
					<SelectValue placeholder='Select GWs' />
				</SelectTrigger>
				<SelectContent>
					{gameweekOptions.map((option) => (
						<SelectItem key={option} value={String(option)}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
