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
	compact?: boolean
}

export const GameweekSelector = ({
	numberOfGameweeks,
	setNumberOfGameweeks,
	gameweekOptions,
	compact = false,
}: GameweekSelectorProps) => {
	return (
		<div
			className={
				compact ? 'flex shrink-0 items-center gap-2' : 'flex flex-col gap-2'
			}
		>
			<Label htmlFor='gameweek-select' className={compact ? 'sr-only' : undefined}>
				Gameweeks
			</Label>
			<Select
				value={String(numberOfGameweeks)}
				onValueChange={(value) => setNumberOfGameweeks(Number(value))}
			>
				<SelectTrigger
					id='gameweek-select'
					className={compact ? 'h-9 w-[4.25rem]' : 'w-[100px]'}
				>
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
