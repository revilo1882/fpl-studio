'use client'

const DataUnavailable = () => (
	<main className='flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center'>
		<h1 className='text-xl font-semibold'>FPL data temporarily unavailable</h1>
		<p className='max-w-sm text-sm text-muted-foreground'>
			Could not reach the FPL API. This is usually a brief outage — try refreshing the page.
		</p>
		<button
			type='button'
			onClick={() => window.location.reload()}
			className='mt-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-accent'
		>
			Refresh
		</button>
	</main>
)

export default DataUnavailable
