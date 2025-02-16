import { EnvironmentParseError } from '../errors';
import { ArrayParser, BooleanParser, EnumParser, NumberParser, StringParser } from './';
import { Parser, ParserContext, ParserResult } from './types';

export class ParserRegistry {
	private readonly parsers = new Map<string, new (registry: ParserRegistry) => Parser>();

	constructor() {
		this.registerDefaultParsers();
	}

	register(type: string, parserClass: new (registry: ParserRegistry) => Parser): this {
		this.parsers.set(type, parserClass);
		return this;
	}

	parse(context: ParserContext): ParserResult {
		const ParserClass = this.parsers.get(context.schema.type);
		if (!ParserClass) {
			throw new EnvironmentParseError(
				context.envKey,
				`No parser registered for type: ${context.schema.type}`,
				context.path
			);
		}
		const parser = new ParserClass(this);
		return parser.parse(context);
	}

	private registerDefaultParsers(): void {
		this.register('string', StringParser)
			.register('number', NumberParser)
			.register('boolean', BooleanParser)
			.register('enum', EnumParser)
			.register('array', ArrayParser);
	}
}
