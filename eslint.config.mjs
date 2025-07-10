import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({
	// import.meta.dirname is available after Node.js v20.11.0
	baseDirectory: import.meta.dirname,
	recommendedConfig: js.configs.recommended,
})

export default [
	...compat.config({
		extends: ['next/core-web-vitals'],
	}),
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		rules: {
			// TypeScript Rules
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],

			// React Rules
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react/jsx-uses-react': 'off',
			'react/jsx-uses-vars': 'error',
			'react/self-closing-comp': 'error',
			'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

			// General Code Quality
			'no-console': 'warn',
			'prefer-const': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'prefer-template': 'error',
			'no-duplicate-imports': 'error',
			eqeqeq: ['error', 'always'],
		},
	},
	{
		ignores: [
			'node_modules/',
			'.next/',
			'out/',
			'dist/',
			'*.config.js',
			'*.config.ts',
			'*.config.mjs',
			'eslint.config.mjs',
		],
	},
]
