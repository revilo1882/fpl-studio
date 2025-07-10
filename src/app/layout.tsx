import { ThemeProvider } from 'next-themes'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { ThemeToggle } from '@/components/ThemeToggle'
import '../styles/globals.css'

export const metadata = {
	title: 'FPL Studio',
	description: 'Fixture planner and difficulty visualizer for FPL',
	icons: {
		icon: '/favicon.ico',
	},
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<ThemeToggle />
					{children}
					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	)
}
