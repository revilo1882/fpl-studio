'use client'

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type GameweekSelectorProps = {
	numberOfGameweeks: number
	setNumberOfGameweeks: (value: number) => void
	gameweekOptions: number[]
}

export const GameweekSelector = ({
	numberOfGameweeks,
	setNumberOfGameweeks,
	gameweekOptions,
}: GameweekSelectorProps) => {
	return (
		<div className='grid gap-2'>
			<Label htmlFor='gameweek-select'>Gameweeks</Label>
			<Select
				defaultValue={String(numberOfGameweeks)}
				onValueChange={(v) => setNumberOfGameweeks(Number(v))}
			>
				<SelectTrigger id='gameweek-select' className=''>
					<SelectValue placeholder='Select...' />
				</SelectTrigger>
				<SelectContent className='min-w-fit'>
					{gameweekOptions.map((gw) => (
						<SelectItem key={gw} value={String(gw)}>
							{gw}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
