'use client'

import FixturesPage from '@/components/fixtures/FixturesPage'
import { withFPLData } from '@/components/providers/withFPLData'
import { type BootstrapData } from '@/types/bootstrap'
import { type Fixtures } from '@/types/fixtures'

interface FixturesRouteProps {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

const FixturesRoute = ({ bootstrapData, fixtures }: FixturesRouteProps) => (
	<FixturesPage bootstrapData={bootstrapData} fixtures={fixtures} />
)

export default withFPLData(FixturesRoute)
