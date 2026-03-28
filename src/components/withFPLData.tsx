import { useFPLServerContext } from '@/contexts/FPLServerContext'
import DataUnavailable from '@/components/DataUnavailable'
import { type BootstrapData } from '@/types/bootstrap'
import { type Fixtures } from '@/types/fixtures'

type InjectedProps = { bootstrapData: BootstrapData; fixtures: Fixtures }

/**
 * HOC that injects bootstrapData and fixtures from context, leaving only the
 * router-provided props (e.g. params) visible to Next.js's page type checker.
 */
export const withFPLData = <P extends InjectedProps,>(
	Component: React.ComponentType<P>,
) => {
	type ExternalProps = Omit<P, keyof InjectedProps>

	return (props: ExternalProps) => {
		const { bootstrapData, fixtures } = useFPLServerContext()

		if (!bootstrapData || !fixtures) {
			return <DataUnavailable />
		}

		return (
			<Component
				{...(props as unknown as P)}
				bootstrapData={bootstrapData}
				fixtures={fixtures}
			/>
		)
	}
}
