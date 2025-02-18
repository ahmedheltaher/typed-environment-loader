import { EnvironmentParseError } from '../errors';
import { ArrayParser, BooleanParser, EnumParser, NumberParser, StringParser } from './';
import { Parser, ParserContext, ParserResult } from './types';

type TParserConstructor = new (registry: ParserRegistry) => Parser;

export class ParserRegistry {
	private readonly _parsers = new Map<string, TParserConstructor>();

	constructor() {
		this.registerDefaultParsers();
	}

	register(type: string, parserClass: TParserConstructor): this {
		this._parsers.set(type, parserClass);
		return this;
	}

	parse(context: ParserContext): ParserResult {
		const ParserClass = this._parsers.get(context.schema.type);
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

	public get parsers(): Map<string, TParserConstructor> {
		return this._parsers;
	}
}
