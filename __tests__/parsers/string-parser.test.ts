import { ParserContext, StringParser } from '../../src/parsers';


describe('StringParser', () => {
	let parser: StringParser;

	beforeEach(() => {
		parser = new StringParser();
	});



	it('should return trimmed value if context value is provided', () => {
		const context: ParserContext = {
			value: '"testValue"',
			schema: { type: 'string', required: false },
			envKey: 'TEST_KEY',
			path: []
		};

		const result = parser.parse(context);
		expect(result.value).toBe('testValue');
	});

	it('should return empty string if context value is empty string', () => {
		const context: ParserContext = {
			value: "",
			schema: { type: 'string', required: false },
			envKey: 'TEST_KEY',
			path: []
		};

		const result = parser.parse(context);
		expect(result.value).toBe("");
	});

	it('should return value without quotes if context value is quoted', () => {
		const context: ParserContext = {
			value: '"quotedValue"',
			schema: { type: 'string', required: false },
			envKey: 'TEST_KEY',
			path: []
		};

		const result = parser.parse(context);
		expect(result.value).toBe('quotedValue');
	});

});