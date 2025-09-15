import FixtureDifficultyPage from '@/components/FixtureDifficultyPage'
import { fetchFPLData } from '@/lib/fplApi'
import type { BootstrapData, Fixtures } from '@/types/fpl'

export default async function HomePage() {
	const [bootstrapData, fixtures] = await Promise.all([
		fetchFPLData<BootstrapData>('bootstrap-static', { revalidate: 900 }),
		fetchFPLData<Fixtures>('fixtures', { revalidate: 900 }),
	])

	return <FixtureDifficultyPage bootstrapData={bootstrapData} fixtures={fixtures} />
}
