'use client'

import FixtureDifficultyPage from '@/components/FixtureDifficultyPage'
import { withFPLData } from '@/components/withFPLData'
import { type BootstrapData } from '@/types/bootstrap'
import { type Fixtures } from '@/types/fixtures'

interface FixturesPageProps {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

function FixturesPage({ bootstrapData, fixtures }: FixturesPageProps) {
	return <FixtureDifficultyPage bootstrapData={bootstrapData} fixtures={fixtures} />
}

export default withFPLData(FixturesPage)
