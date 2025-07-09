'use client'

import * as React from 'react'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme()

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<Button
			variant='outline'
			size='icon'
			onClick={toggleTheme}
			suppressHydrationWarning
			className='absolute left-4 top-4'
		>
			<Sun className='theme-icon-light h-[1.2rem] w-[1.2rem] transition-all' />
			<Moon className='theme-icon-dark absolute h-[1.2rem] w-[1.2rem] transition-all' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	)
}
