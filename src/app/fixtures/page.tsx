'use client'

import FixtureDifficultyPage from '@/components/fixtures/FixtureDifficultyPage'
import { withFPLData } from '@/components/providers/withFPLData'
import { type BootstrapData } from '@/types/bootstrap'
import { type Fixtures } from '@/types/fixtures'

interface FixturesPageProps {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

const FixturesPage = ({ bootstrapData, fixtures }: FixturesPageProps) => (
	<FixtureDifficultyPage bootstrapData={bootstrapData} fixtures={fixtures} />
)

export default withFPLData(FixturesPage)
