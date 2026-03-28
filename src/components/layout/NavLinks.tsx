'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const links = [
	{ href: '/fixtures', label: 'Fixtures' },
	{ href: '/strengths', label: 'Strengths' },
	{ href: '/about', label: 'About' },
]

export const NavLinks = () => {
	const pathname = usePathname()

	return (
		<nav className='hidden sm:flex sm:items-center sm:gap-1'>
			{links.map(({ href, label }) => {
				const isActive = pathname === href || pathname.startsWith(`${href}/`)
				return (
					<Link
						key={href}
						href={href}
						className={cn(
							'rounded-md px-3 py-1.5 text-sm transition-colors',
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
	)
}
