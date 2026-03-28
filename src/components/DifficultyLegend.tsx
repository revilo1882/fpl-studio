import { getDifficultyUI } from '@/lib/fixtureGridUtils'
import type { DifficultyType } from '@/lib/generateFixtureMatrix'
import { cn } from '@/lib/utils'

// Midpoints of each colour band in getDifficultyUI
const CUSTOM_SWATCHES = [1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75]
const FPL_SWATCHES = [1, 2, 3, 4, 5]

interface DifficultyLegendProps {
	difficultyType: DifficultyType
}

export const DifficultyLegend = ({ difficultyType }: DifficultyLegendProps) => {
	const swatches = difficultyType === 'FPL' ? FPL_SWATCHES : CUSTOM_SWATCHES

	return (
		<div className='flex items-center gap-2 text-xs text-muted-foreground'>
			<span className='shrink-0 font-medium'>Difficulty</span>
			<span className='shrink-0'>1 · Easy</span>
			<div data-testid='difficulty-swatch-strip' className='flex overflow-hidden rounded-sm'>
				{swatches.map((score) => (
					<span
						key={score}
						className={cn('block h-3 w-5', getDifficultyUI(score, difficultyType).bg)}
					/>
				))}
			</div>
			<span className='shrink-0'>Hard · 5</span>
		</div>
	)
}
