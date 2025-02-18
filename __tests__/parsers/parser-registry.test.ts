import { EnvironmentParseError } from '../../src/errors';
import { ParserRegistry } from '../../src/parsers/parser-registry';
import { ParserContext, ParserResult } from '../../src/parsers/types';

describe('ParserRegistry', () => {
	let registry: ParserRegistry;

	beforeEach(() => {
		registry = new ParserRegistry();
	});

	it('should register default parsers on initialization', () => {
		expect(registry.parsers.has('string')).toBe(true);
		expect(registry.parsers.has('number')).toBe(true);
		expect(registry.parsers.has('boolean')).toBe(true);
		expect(registry.parsers.has('enum')).toBe(true);
		expect(registry.parsers.has('array')).toBe(true);
	});

	it('should allow registering a new parser', () => {
		class CustomParser {
			constructor(private registry: ParserRegistry) { }
			parse(context: ParserContext): ParserResult {
				return { value: 'custom' };
			}
		}

		registry.register('custom', CustomParser as any);
		expect(registry.parsers.has('custom')).toBe(true);
	});

	it('should parse using the correct parser', () => {
		const context: ParserContext = {
			envKey: 'TEST_KEY',
			schema: { type: 'string' },
			value: 'test',
			path: []
		};

		const result = registry.parse(context);
		expect(result.value).toBe('test');
	});

	it('should throw an error if no parser is registered for the type', () => {
		const context: ParserContext = {
			envKey: 'TEST_KEY',
			schema: { type: 'unknown' as any },
			value: 'test',
			path: []
		};

		expect(() => registry.parse(context)).toThrow(EnvironmentParseError);
		expect(() => registry.parse(context)).toThrow('No parser registered for type: unknown');
	});
});