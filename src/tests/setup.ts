/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom'

const createActFunction = () => {
	try {
		/* eslint-disable-next-line @typescript-eslint/no-require-imports */
		const { act } = require('@testing-library/react')
		return act
	} catch {
		return (callback: () => void | Promise<void>) => {
			const result = callback()
			if (result && typeof result.then === 'function') {
				return result
			}
			return Promise.resolve()
		}
	}
}

;(global as any).act = createActFunction()

export const act = (global as any).act
