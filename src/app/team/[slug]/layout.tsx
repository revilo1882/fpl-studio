import type { Metadata } from 'next'

import { getBootstrapData } from '@/lib/bootstrapServer'
import { SITE_NAME } from '@/lib/site'

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> }

export const generateMetadata = async ({
	params,
}: Pick<Props, 'params'>): Promise<Metadata> => {
	const { slug } = await params
	const normalized = slug.toLowerCase()
	const bootstrap = await getBootstrapData()
	const team = bootstrap?.teams?.find((t) => t.short_name.toLowerCase() === normalized)

	return {
		title: team ? `${team.name} — fixtures & FDR` : `Team (${slug.toUpperCase()})`,
		description: team
			? `Studio FDR, season form, and fixture list for ${team.name} (${team.short_name}) in ${SITE_NAME}.`
			: `Team hub in ${SITE_NAME}.`,
	}
}

const TeamSlugLayout = ({ children }: { children: React.ReactNode }) => children

export default TeamSlugLayout
