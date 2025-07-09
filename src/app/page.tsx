import { FixtureGridPage } from '@/components/FixtureGridPage'
import { fetchFPLData } from '@/lib/fplApi'
import type { BootstrapData, Fixtures } from '@/types/fpl'

export default async function HomePage() {
	const bootstrapData = await fetchFPLData<BootstrapData>('bootstrap-static')
	const fixtures = await fetchFPLData<Fixtures>('fixtures')

	return <FixtureGridPage bootstrapData={bootstrapData} fixtures={fixtures} />
}
