'use client'

import { createContext, useContext } from 'react'

import type { BootstrapData } from '@/types/bootstrap'
import type { Fixtures } from '@/types/fixtures'

export interface FPLDataValue {
	bootstrapData: BootstrapData
	fixtures: Fixtures
}

export const FPLServerContext = createContext<FPLDataValue | null>(null)

export const useFPLServerContext = (): FPLDataValue => {
	const contextValue = useContext(FPLServerContext)
	if (!contextValue) {
		throw new Error('useFPLServerContext must be used inside <FPLProvider>')
	}
	return contextValue
}

export const FPLProvider = ({
	value,
	children,
}: {
	value: FPLDataValue
	children: React.ReactNode
}) => <FPLServerContext.Provider value={value}>{children}</FPLServerContext.Provider>
