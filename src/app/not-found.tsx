import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
	title: 'Page not found',
	description: 'The page you requested does not exist.',
}

const NotFound = () => (
	<div className='container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center'>
		<div>
			<h1 className='text-2xl font-semibold tracking-tight text-foreground'>Page not found</h1>
			<p className='mt-2 max-w-md text-muted-foreground'>
				That URL does not match any route in FPL Studio. Check the link or go back to the home page.
			</p>
		</div>
		<Button asChild>
			<Link href='/'>Back to home</Link>
		</Button>
	</div>
)

export default NotFound
