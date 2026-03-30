const TEAM_COUNT = 20

type Props = { numberOfGameweeks: number }

export const FixtureGridSkeleton = ({ numberOfGameweeks }: Props) => (
	<div className='w-full shrink-0 border-y border-border bg-card sm:border sm:shadow-sm'>
		{/* Header row */}
		<div className='flex items-center border-b border-border bg-card px-2 py-3 shadow-sm'>
			<div className='w-28 shrink-0'>
				<div className='h-4 w-12 animate-pulse rounded bg-muted' />
			</div>
			<div className='flex min-w-0 flex-1 gap-1.5'>
				{Array.from({ length: numberOfGameweeks }).map((_, i) => (
					<div key={i} className='flex flex-1 justify-center'>
						<div className='h-4 w-10 animate-pulse rounded bg-muted' />
					</div>
				))}
			</div>
			<div className='w-20 shrink-0 text-right'>
				<div className='ml-auto h-4 w-10 animate-pulse rounded bg-muted' />
			</div>
		</div>

		{/* Data rows */}
		{Array.from({ length: TEAM_COUNT }).map((_, rowIdx) => (
			<div
				key={rowIdx}
				className='flex items-center border-b border-border/40 px-2 py-1 last:border-0'
			>
				<div className='w-28 shrink-0'>
					<div className='h-3.5 w-24 animate-pulse rounded bg-muted' />
				</div>
				<div className='flex min-w-0 flex-1 gap-1.5'>
					{Array.from({ length: numberOfGameweeks }).map((_, colIdx) => (
						<div
							key={colIdx}
							className='h-10 flex-1 animate-pulse rounded bg-muted'
						/>
					))}
				</div>
				<div className='w-20 shrink-0 text-right'>
					<div className='ml-auto h-3.5 w-8 animate-pulse rounded bg-muted' />
				</div>
			</div>
		))}
	</div>
)
