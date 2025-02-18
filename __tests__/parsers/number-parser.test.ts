import { EnvironmentValidationError } from '../../src/errors';
import { NumberParser } from '../../src/parsers/number-parser';
import { ParserContext } from '../../src/types/parsers';

describe('NumberParser', () => {
	let parser: NumberParser;

	beforeEach(() => {
		parser = new NumberParser();
	});


	it('should parse a valid integer string', () => {
		const context: ParserContext = {
			value: '123',
			schema: { type: 'number' },
			envKey: 'TEST_KEY',
			path: ['test.path']
		};

		const result = parser.parse(context);
		expect(result.value).toBe(123);
	});

	it('should parse a valid float string', () => {
		const context: ParserContext = {
			value: '123.45',
			schema: { type: 'number' },
			envKey: 'TEST_KEY',
			path: ['test.path']
		};

		const result = parser.parse(context);
		expect(result.value).toBe(123.45);
	});

	it('should parse a valid scientific notation string', () => {
		const context: ParserContext = {
			value: '1.23e4',
			schema: { type: 'number' },
			envKey: 'TEST_KEY',
			path: ['test.path']
		};

		const result = parser.parse(context);
		expect(result.value).toBe(12_300);
	});

	it('should throw an error for invalid numeric format', () => {
		const context: ParserContext = {
			value: 'abc',
			schema: { type: 'number' },
			envKey: 'TEST_KEY',
			path: ['test.path']
		};

		expect(() => parser.parse(context)).toThrow(EnvironmentValidationError);
	});

	it('should throw an error for NaN value', () => {
		const context: ParserContext = {
			value: 'NaN',
			schema: { type: 'number' },
			envKey: 'TEST_KEY',
			path: ['test.path']
		};

		expect(() => parser.parse(context)).toThrow(EnvironmentValidationError);
	});

	it('should parse a valid integer string with default value in schema', () => {
		const context: ParserContext = {
			value: '4000',
			schema: { type: 'number', default: 3000 },
			envKey: 'PORT',
			path: ['PORT']
		};

		const result = parser.parse(context);
		expect(result.value).toBe(4000);
	});
});