'use client'

export default function DataUnavailable() {
	return (
		<main className='mx-auto max-w-3xl p-6 text-center'>
			<h1 className='mb-2 text-2xl font-semibold'>FPL Data Unavailable</h1>
			<p className='text-sm opacity-75'>
				The FPL data is currently updating for the new season.
				<br />
				Please check back soon.
			</p>
		</main>
	)
}
