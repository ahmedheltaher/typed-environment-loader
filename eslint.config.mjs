import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			prettier
		},

		languageOptions: {
			parser: tsParser
		},

		rules: {
			semi: ['error', 'always'],
			'comma-dangle': ['error', 'never'],
			'prefer-template': ['error'],
			'no-console': ['error'],
			'eol-last': ['error', 'always'],

			'@typescript-eslint/no-explicit-any': [
				'off',
				{
					fixToUnknown: false
				}
			],

			'object-curly-spacing': ['error', 'always', { objectsInObjects: false }]
		}
	}
];
