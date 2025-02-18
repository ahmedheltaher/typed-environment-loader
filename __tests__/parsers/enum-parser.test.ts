import { EnvironmentValidationError } from '../../src/errors';
import { EnumParser } from '../../src/parsers/enum-parser';
import { EnumSchema } from '../../src/types';
import { ParserContext } from '../../src/types/parsers';

describe('EnumParser', () => {
	let parser: EnumParser;
	let context: ParserContext;

	beforeEach(() => {
		parser = new EnumParser();
		context = {
			envKey: 'TEST_KEY',
			value: '',
			schema: {
				type: 'enum',
				values: ['value1', 'value2', 'value3']
			} as EnumSchema<readonly string[]>,
			path: ['TEST_PATH']
		};
	});


	it('should throw EnvironmentValidationError if value is not in enum values', () => {
		context.value = 'invalid_value';

		expect(() => parser.parse(context)).toThrow(EnvironmentValidationError);
		expect(() => parser.parse(context)).toThrow('Allowed values: value1, value2, value3');
	});

	it('should return context value if it is in enum values', () => {
		context.value = 'value2';

		const result = parser.parse(context);

		expect(result.value).toBe('value2');
	});
});