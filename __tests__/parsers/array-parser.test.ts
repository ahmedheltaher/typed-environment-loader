import { EnvironmentParseError } from '../../src/errors';
import { ArrayParser } from '../../src/parsers/array-parser';
import { ParserRegistry } from '../../src/parsers/parser-registry';
import { ParserContext } from '../../src/parsers/types';

describe('ArrayParser', () => {
	let registry: ParserRegistry;
	let parser: ArrayParser;

	beforeEach(() => {
		registry = new ParserRegistry();
		parser = new ArrayParser(registry);
	});


	it('should throw EnvironmentParseError if context value is not a valid JSON array', () => {
		const context: ParserContext = {
			envKey: 'TEST_KEY',
			path: [],
			schema: { type: 'array', items: { type: 'string' } },
			value: 'not-an-array'
		};

		expect(() => parser.parse(context)).toThrow(EnvironmentParseError);
	});

	it('should parse valid JSON array', () => {
		const context: ParserContext = {
			envKey: 'TEST_KEY',
			path: [],
			schema: { type: 'array', items: { type: 'string' } },
			value: '["item1", "item2"]'
		};

		jest.spyOn(registry, 'parse').mockImplementation((context) => ({ value: context.value ? context.value.replace(/"/g, '') : '' }));

		const result = parser.parse(context);
		expect(result.value).toEqual(['item1', 'item2']);
	});

	it('should throw EnvironmentValidationError if an item in the array is invalid', () => {
		const context: ParserContext = {
			envKey: 'TEST_KEY',
			path: [],
			schema: { type: 'array', items: { type: 'string' } },
			value: '["item1", 123]'
		};

		jest.spyOn(registry, 'parse').mockImplementation((context) => {
			if (context.value === '123') {
				throw new Error('Invalid item');
			}
			return { value: context.value ? context.value.replace(/"/g, '') : '' };
		});

		expect(() => parser.parse(context)).toThrow(EnvironmentParseError);
	});
});