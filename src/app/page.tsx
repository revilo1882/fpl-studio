import FixtureGridPage from '@/components/FixtureGridPage'
import { fetchFPLData } from '@/lib/fplApi'
import type { BootstrapData, Fixtures } from '@/types/fpl'

export default async function HomePage() {
	const [bootstrapData, fixtures] = await Promise.all([
		fetchFPLData<BootstrapData>('bootstrap-static'),
		fetchFPLData<Fixtures>('fixtures'),
	])

	return <FixtureGridPage bootstrapData={bootstrapData} fixtures={fixtures} />
}
