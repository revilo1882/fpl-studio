import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: './src/tests/setup.ts',
		// Add this to handle React 19
		pool: 'forks',
		// Suppress React act warnings for React 19 compatibility
		onConsoleLog: (log) => {
			if (log.includes('act(')) return false
			return true
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	// Add this to handle React 19 compatibility
	define: {
		'process.env.NODE_ENV': '"test"',
	},
})
