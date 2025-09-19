'use client'

import FixtureDifficultyPage from '@/components/FixtureDifficultyPage'
import { withFPLData } from '@/components/withFPLData'
import { type BootstrapData } from '@/types/bootstrap'
import { type Fixtures } from '@/types/fixtures'

interface HomePageProps {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

function HomePage({ bootstrapData, fixtures }: HomePageProps) {
	return <FixtureDifficultyPage bootstrapData={bootstrapData} fixtures={fixtures} />
}
export default withFPLData(HomePage)
