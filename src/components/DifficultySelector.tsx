'use client'

import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { DifficultyType } from '@/lib/generateFixtureMatrix'

interface DifficultySelectorProps {
	difficultyType: DifficultyType
	setDifficultyType: (type: DifficultyType) => void
}

export function DifficultySelector({ difficultyType, setDifficultyType }: DifficultySelectorProps) {
	return (
		<div className='flex flex-col gap-2'>
			<Label htmlFor='difficulty-select'>Difficulty View</Label>
			<Select
				value={difficultyType}
				onValueChange={(value: DifficultyType) => setDifficultyType(value)}
			>
				<SelectTrigger id='difficulty-select' className='w-[180px]'>
					<SelectValue placeholder='Select difficulty' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='overall'>Studio Overall</SelectItem>
					<SelectItem value='attack'>Studio Attack</SelectItem>
					<SelectItem value='defence'>Studio Defence</SelectItem>
					<SelectItem value='fpl'>FPL Default</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
