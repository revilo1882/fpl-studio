import { ThemeProvider } from 'next-themes'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '../styles/globals.css'

import { fetchFPLData } from '@/lib/fplApi'
import type { BootstrapData } from '@/types/bootstrap'
import type { Fixtures } from '@/types/fixtures'
import DataUnavailable from '@/components/DataUnavailable'
import { FPLProvider } from '@/contexts/FPLServerContext'
import { ThemeToggle } from '@/components/ThemeToggle'

const REVALIDATE_SECONDS = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS) || 900

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const [bootstrapData, fixtures] = (await Promise.all([
		fetchFPLData<BootstrapData>('bootstrap-static', { revalidate: REVALIDATE_SECONDS }),
		fetchFPLData<Fixtures>('fixtures', { revalidate: REVALIDATE_SECONDS }),
	])) as [BootstrapData | null, Fixtures | null]

	const dataIsAvailable = Boolean(bootstrapData && fixtures)

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

					{!dataIsAvailable ? (
						<DataUnavailable />
					) : (
						<FPLProvider
							value={{
								bootstrapData: bootstrapData!,
								fixtures: fixtures!,
							}}
						>
							{children}
						</FPLProvider>
					)}

					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	)
}
