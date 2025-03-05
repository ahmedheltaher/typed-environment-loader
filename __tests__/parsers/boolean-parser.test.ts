import { EnvironmentValidationError } from '../../src/errors';
import { BooleanParser } from '../../src/parsers/boolean-parser';
import { ParserContext } from '../../src/types/parsers';

describe('BooleanParser', () => {
	let parser: BooleanParser;

	beforeEach(() => {
		parser = new BooleanParser();
	});

	it('should return true for "true"', () => {
		const context: ParserContext = {
			value: 'true',
			envKey: 'TEST_KEY',
			schema: { type: 'boolean' },
			path: []
		};
		const result = parser.parse(context);
		expect(result.value).toBe(true);
	});

	it('should return false for "false"', () => {
		const context: ParserContext = {
			value: 'false',
			envKey: 'TEST_KEY',
			schema: { type: 'boolean' },
			path: []
		};
		const result = parser.parse(context);
		expect(result.value).toBe(false);
	});

	it('should throw an error for invalid boolean string', () => {
		const context: ParserContext = {
			value: 'invalid',
			envKey: 'TEST_KEY',
			schema: { type: 'boolean' },
			path: []
		};
		expect(() => parser.parse(context)).toThrow(EnvironmentValidationError);
		expect(() => parser.parse(context)).toThrow(
			'Invalid value for TEST_KEY: Invalid boolean value. Must be one of: [true, 1, yes, y, on, false, 0, no, n, off]'
		);
	});
});
