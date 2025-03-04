import { EnvironmentLoader, EnvironmentMissingError, EnvironmentSchema, ParserRegistry } from '../src';

jest.mock('../src/parsers/parser-registry');

describe('EnvironmentLoader', () => {
	let mockParserRegistry: jest.Mocked<ParserRegistry>;

	beforeEach(() => {
		mockParserRegistry = {
			parse: jest.fn()
		} as any;
		(ParserRegistry as jest.Mock).mockImplementation(() => mockParserRegistry);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('load', () => {
		it('should load flat schema successfully', () => {
			const env = {
				TEST_STRING: 'value',
				TEST_NUMBER: '123'
			};

			const schema = {
				testString: { type: 'string', required: true, name: 'TEST_STRING' },
				testNumber: { type: 'number', required: true, name: 'TEST_NUMBER' }
			} satisfies EnvironmentSchema;

			// Since entries are processed in reverse order, we need to mock in reverse
			mockParserRegistry.parse
				.mockReturnValueOnce({ value: 123 }) // testNumber (processed first)
				.mockReturnValueOnce({ value: 'value' }); // testString (processed second)

			const loader = new EnvironmentLoader(schema, env);
			const result = loader.load();

			expect(result).toStrictEqual({
				testString: 'value',
				testNumber: 123
			});

			// Verify the order of calls
			expect(mockParserRegistry.parse).toHaveBeenCalledTimes(2);
			expect(mockParserRegistry.parse.mock.calls[0][0].schema).toBe(schema.testNumber);
			expect(mockParserRegistry.parse.mock.calls[1][0].schema).toBe(schema.testString);
		});

		it('should load nested schema successfully', () => {
			const env = {
				DATABASE_HOST: 'localhost',
				DATABASE_PORT: '5432',
				API_URL: 'http://api.example.com'
			};

			const schema = {
				database: {
					host: { type: 'string', required: true, name: 'DATABASE_HOST' },
					port: { type: 'number', required: true, name: 'DATABASE_PORT' }
				},
				api: {
					url: { type: 'string', required: true, name: 'API_URL' }
				}
			} satisfies EnvironmentSchema;

			// Mock in reverse order of processing
			mockParserRegistry.parse
				.mockReturnValueOnce({ value: 5432 }) // database.port
				.mockReturnValueOnce({ value: 'localhost' }) // database.host
				.mockReturnValueOnce({ value: 'http://api.example.com' }); // api.url

			const loader = new EnvironmentLoader(schema, env);
			const result = loader.load();

			expect(result).toStrictEqual({
				database: {
					host: 'localhost',
					port: 5432
				},
				api: {
					url: 'http://api.example.com'
				}
			});

			// Verify the order of calls
			expect(mockParserRegistry.parse).toHaveBeenCalledTimes(3);
		});

		// Rest of the tests remain the same...
		it('should handle custom environment key names', () => {
			const env = {
				CUSTOM_ENV_KEY: 'value'
			};

			const schema = {
				test: { type: 'string', required: true, name: 'CUSTOM_ENV_KEY' }
			} satisfies EnvironmentSchema;

			mockParserRegistry.parse.mockReturnValueOnce({ value: 'value' });

			const loader = new EnvironmentLoader(schema, env);
			const result = loader.load();

			expect(result).toEqual({
				test: 'value'
			});
		});

		it('should handle default values for optional fields', () => {
			const env = {};

			const schema = {
				test: { type: 'string', required: false, default: 'default value' },
				arrayTest: {
					type: 'array',
					required: false,
					default: ['default'],
					items: { type: 'string' }
				}
			} satisfies EnvironmentSchema;

			const loader = new EnvironmentLoader(schema, env);
			const result = loader.load();

			expect(result).toEqual({
				test: 'default value',
				arrayTest: ['default']
			});
		});

		it('should throw EnvironmentMissingError for missing required values', () => {
			const env = {};

			const schema = {
				test: { type: 'string', required: true }
			} satisfies EnvironmentSchema;

			const loader = new EnvironmentLoader(schema, env);

			expect(() => loader.load()).toThrow(EnvironmentMissingError);
		});

		it('should handle empty string values', () => {
			const env = {
				TEST_STRING: '  '
			};

			const schema = {
				testString: { type: 'string', required: true }
			} satisfies EnvironmentSchema;

			const loader = new EnvironmentLoader(schema, env);

			expect(() => loader.load()).toThrow(EnvironmentMissingError);
		});

		it('should preserve array default values', () => {
			const env = {};

			const schema = {
				array: {
					type: 'array',
					required: false,
					default: [1, 2, 3],
					items: { type: 'number' }
				}
			} satisfies EnvironmentSchema;

			const loader = new EnvironmentLoader(schema, env);
			const result = loader.load();

			expect(result.array).toEqual([1, 2, 3]);
			expect(result.array).not.toBe(schema.array.default); // Should be a new instance
		});
	});
});
