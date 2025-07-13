/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/jest-dom'

// React 19 compatibility polyfill
if (typeof (global as any).act === 'undefined') {
	try {
		// Try to use React Testing Library's act first
		const { act } = require('@testing-library/react')
		;(global as any).act = act
	} catch {
		try {
			// Fall back to React's act
			const React = require('react')
			;(global as any).act = React.act
		} catch {
			// Final fallback - create a simple wrapper
			;(global as any).act = (callback: () => void) => {
				callback()
				return Promise.resolve()
			}
		}
	}
}
