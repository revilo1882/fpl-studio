import Link from 'next/link'

import { BarChart2 } from 'lucide-react'

import { ThemeToggle } from './ThemeToggle'

export const AppHeader = () => (
	<header className='sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
		<div className='container mx-auto flex h-full items-center justify-between px-4'>
			<div className='flex items-center gap-6'>
				<Link
					href='/'
					className='flex items-center gap-2 text-foreground transition-opacity hover:opacity-80'
				>
					<BarChart2 className='h-5 w-5 text-primary' />
					<span className='text-base font-semibold tracking-tight'>FPL Studio</span>
				</Link>

				<nav className='hidden sm:flex sm:items-center sm:gap-1'>
					<Link
						href='/fixtures'
						className='rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
					>
						Fixtures
					</Link>
					<Link
						href='/strengths'
						className='rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
					>
						Strengths
					</Link>
				</nav>
			</div>

			<ThemeToggle />
		</div>
	</header>
)
