import js from '@eslint/js';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['dist', 'storybook-static', 'public/mockServiceWorker.js']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		plugins: {
			'no-relative-import-paths': noRelativeImportPaths,
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-empty-object-type': 'off',
			'no-relative-import-paths/no-relative-import-paths': [
				'error',
				{ allowSameFolder: false, rootDir: '', prefix: '@' },
			],
			'react-hooks/exhaustive-deps': 'off',
			'react-refresh/only-export-components': 'off',
		},
	},
	{
		// Service 는 클래스 메서드로 훅을 반환한다 (호출은 컴포넌트에서 이뤄짐)
		files: ['src/services/**/*.ts'],
		rules: {
			'react-hooks/rules-of-hooks': 'off',
		},
	},
	{
		files: ['**/*.stories.tsx'],
		rules: {
			'react-hooks/rules-of-hooks': 'off',
		},
	},
]);
