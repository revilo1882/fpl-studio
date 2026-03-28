import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '../styles/globals.css'

import { getBootstrapData } from '@/lib/bootstrapServer'
import { fetchFPLData } from '@/lib/fplApi'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import type { BootstrapData } from '@/types/bootstrap'
import type { Fixtures } from '@/types/fixtures'
import DataUnavailable from '@/components/DataUnavailable'
import { FPLProvider } from '@/contexts/FPLServerContext'
import { AppHeader } from '@/components/AppHeader'

const REVALIDATE_SECONDS = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS) || 900

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
	? new URL(process.env.NEXT_PUBLIC_SITE_URL)
	: undefined

export const metadata: Metadata = {
	...(siteUrl ? { metadataBase: siteUrl } : {}),
	title: {
		default: `${SITE_NAME} — Dynamic fixture difficulty for Fantasy Premier League`,
		template: `%s · ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	openGraph: {
		type: 'website',
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
	},
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const [bootstrapData, fixtures] = (await Promise.all([
		getBootstrapData(),
		fetchFPLData<Fixtures>('fixtures', { revalidate: REVALIDATE_SECONDS }),
	])) as [BootstrapData | null, Fixtures | null]

	const dataIsAvailable = Boolean(bootstrapData && fixtures)

	return (
		<html lang='en' suppressHydrationWarning>
			<body className='flex flex-col'>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<AppHeader />

					<div className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
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
					</div>

					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
