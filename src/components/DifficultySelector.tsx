'use client'

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { DifficultyType } from '@/lib/generateFixtureMatrix'

type DifficultySelectorProps = {
	difficultyType: DifficultyType
	setDifficultyType: (value: DifficultyType) => void
}

export const DifficultySelector = ({
	difficultyType,
	setDifficultyType,
}: DifficultySelectorProps) => {
	return (
		<div className='grid gap-2'>
			<Label htmlFor='difficulty-select'>Difficulty View</Label>
			<Select
				value={difficultyType}
				onValueChange={(v) => setDifficultyType(v as DifficultyType)}
			>
				<SelectTrigger id='difficulty-select' className=''>
					<SelectValue placeholder='Select...' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='fpl'>FPL Default</SelectItem>
					<SelectItem value='overall'>Studio Overall</SelectItem>
					<SelectItem value='attack'>Studio Attack</SelectItem>
					<SelectItem value='defence'>Studio Defence</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}
