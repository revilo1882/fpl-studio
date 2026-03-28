import { cache } from 'react'

import { fetchFPLData } from '@/lib/fplApi'
import type { BootstrapData } from '@/types/bootstrap'

const REVALIDATE_SECONDS = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS) || 900

/**
 * Single bootstrap fetch per server request (layout + generateMetadata + RSC pages).
 * Important for performance and for avoiding redundant FPL API calls.
 */
export const getBootstrapData = cache(async () =>
	fetchFPLData<BootstrapData>('bootstrap-static', { revalidate: REVALIDATE_SECONDS }),
)
