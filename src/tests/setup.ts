/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

// React 19 compatible act function
const createActFunction = () => {
	// In React 19, act is available from @testing-library/react
	try {
		/* eslint-disable-next-line @typescript-eslint/no-require-imports */
		const { act } = require('@testing-library/react')
		return act
	} catch {
		// Fallback for edge cases - create a simple wrapper
		return (callback: () => void | Promise<void>) => {
			const result = callback()
			if (result && typeof result.then === 'function') {
				return result
			}
			return Promise.resolve()
		}
	}
}

// Make act available globally

;(global as any).act = createActFunction()

// Also export it for direct import if needed

export const act = (global as any).act
