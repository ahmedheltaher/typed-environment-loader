import type { Config } from 'jest';

const config: Config = {
	// Specify that we're using ts-jest for TypeScript files
	preset: 'ts-jest',

	// Use Node.js as our testing environment
	testEnvironment: 'node',

	// Look for test files in these directories
	roots: ['<rootDir>'],

	// Pattern matching for test files
	testMatch: [
		'**/__tests__/**/*.ts',
		'**/?(*.)+(spec|test).ts'
	],

	// Transform TypeScript files with ts-jest
	transform: {
		'^.+\\.ts$': ['ts-jest', {
			tsconfig: 'tsconfig.jest.json'
		}]
	},

	// Module file extensions to handle
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],

	// Coverage configuration
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'clover', 'html'],
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts',
		'!src/index.ts',
		'!src/**/*.types.ts',
		'!src/types/**/*.ts',
		'!src/infer/**/*.ts',
		'!src/**/__tests__/**/*.ts',
		'!src/parsers/types.ts',
		'!src/errors.ts'
	],

	// Coverage thresholds
	coverageThreshold: {
		global: {
			branches: 65,
			functions: 80,
			lines: 80,
			statements: 80
		}
	},

	// Test timeout in milliseconds
	testTimeout: 10_000,

	// Verbose output
	verbose: true,

	// Clear mock calls and instances between tests
	clearMocks: true,

	// The paths to modules that run some code to configure or set up the testing environment
	// setupFiles: ['<rootDir>/jest.setup.ts']
};

export default config;