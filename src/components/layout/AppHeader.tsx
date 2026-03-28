'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BarChart2, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { NavLinks } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
	{ href: '/fixtures', label: 'Fixtures' },
	{ href: '/strengths', label: 'Strengths' },
	{ href: '/about', label: 'About' },
]

export const AppHeader = () => {
	const [mobileOpen, setMobileOpen] = useState(false)
	const pathname = usePathname()

	return (
		<header className='sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container mx-auto flex h-14 items-center justify-between px-4'>
				<div className='flex items-center gap-6'>
					<Link
						href='/'
						className='flex items-center gap-2 text-foreground transition-opacity hover:opacity-80'
						onClick={() => setMobileOpen(false)}
					>
						<BarChart2 className='h-5 w-5 text-primary' />
						<span className='text-base font-semibold tracking-tight'>FPL Studio</span>
					</Link>

					{/* Desktop nav */}
					<NavLinks />
				</div>

				<div className='flex items-center gap-2'>
					<ThemeToggle />
					{/* Mobile hamburger */}
					<button
						className='flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden'
						aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
						onClick={() => setMobileOpen((v) => !v)}
					>
						{mobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
					</button>
				</div>
			</div>

			{/* Mobile dropdown */}
			{mobileOpen && (
				<div className='border-t border-border bg-background px-4 pb-3 pt-2 sm:hidden'>
					<nav className='flex flex-col gap-1'>
						{NAV_LINKS.map(({ href, label }) => {
							const isActive = pathname === href || pathname.startsWith(`${href}/`)
							return (
								<Link
									key={href}
									href={href}
									onClick={() => setMobileOpen(false)}
									className={cn(
										'rounded-md px-3 py-2 text-sm transition-colors',
										isActive
											? 'bg-accent font-medium text-foreground'
											: 'text-muted-foreground hover:bg-accent hover:text-foreground',
									)}
								>
									{label}
								</Link>
							)
						})}
					</nav>
				</div>
			)}
		</header>
	)
}
