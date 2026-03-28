'use client'

import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { DifficultyType } from '@/lib/fixtures/generateFixtureMatrix'

interface DifficultySelectorProps {
	difficultyType: DifficultyType
	setDifficultyType: (type: DifficultyType) => void
	compact?: boolean
}

export const DifficultySelector = ({
	difficultyType,
	setDifficultyType,
	compact = false,
}: DifficultySelectorProps) => {
	const difficultyTypes: DifficultyType[] = ['Overall', 'Attack', 'Defence', 'FPL']

	return (
		<div
			className={
				compact ? 'flex shrink-0 items-center gap-2' : 'flex flex-col gap-2'
			}
		>
			<Label htmlFor='difficulty-select' className={compact ? 'sr-only' : undefined}>
				Difficulty View
			</Label>
			<Select
				value={difficultyType}
				onValueChange={(value: DifficultyType) => {
					setDifficultyType(value)
				}}
			>
				<SelectTrigger
					id='difficulty-select'
					className={compact ? 'h-9 w-[min(7.5rem,32vw)] sm:w-32' : 'w-[180px]'}
				>
					<SelectValue placeholder='Select difficulty' />
				</SelectTrigger>
				<SelectContent>
					{difficultyTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
