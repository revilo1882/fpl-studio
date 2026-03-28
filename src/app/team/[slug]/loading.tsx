export default function TeamPageLoading() {
	return (
		<main className='container mx-auto max-w-7xl px-4 py-6'>
			<div className='mb-4 h-4 w-40 animate-pulse rounded bg-muted' />
			<div className='mb-6 h-12 w-64 max-w-full animate-pulse rounded bg-muted' />
			<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				<div className='flex flex-col gap-4'>
					<div className='h-48 animate-pulse rounded-lg border bg-muted/40' />
					<div className='h-64 animate-pulse rounded-lg border bg-muted/40' />
				</div>
				<div className='h-[min(28rem,70vh)] animate-pulse rounded-lg border bg-muted/40' />
			</div>
		</main>
	)
}
