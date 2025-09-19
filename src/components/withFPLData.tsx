import { useFPLServerContext } from '@/contexts/FPLServerContext'
import DataUnavailable from '@/components/DataUnavailable'
import { type BootstrapData } from '@/types/bootstrap'
import { type Fixtures } from '@/types/fixtures'

export function withFPLData<P extends object>(
	Component: React.ComponentType<P & { bootstrapData: BootstrapData; fixtures: Fixtures }>,
) {
	return function WrappedComponent(props: P) {
		const { bootstrapData, fixtures } = useFPLServerContext()

		if (!bootstrapData || !fixtures) {
			return <DataUnavailable />
		}

		return <Component {...props} bootstrapData={bootstrapData} fixtures={fixtures} />
	}
}
