import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: './src/tests/setup.ts',
		pool: 'forks',
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
	define: {
		'process.env.NODE_ENV': '"test"',
	},
})
