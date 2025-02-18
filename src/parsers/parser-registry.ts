import { createDebugLogger } from '../debug';
import { EnvironmentParseError } from '../errors';
import { Parser, ParserContext, ParserResult } from '../types';
import { ArrayParser, BooleanParser, EnumParser, NumberParser, StringParser } from './';

type TParserConstructor = new (registry: ParserRegistry) => Parser;
export class ParserRegistry {
	private readonly _parsers = new Map<string, TParserConstructor>();
	private readonly _debug = createDebugLogger(this.constructor.name);

	constructor() {
		this._debug.info('Initializing ParserRegistry');
		this._registerDefaultParsers();
		this._debug.info('ParserRegistry initialized with default parsers');
	}

	public get parsers(): Map<string, TParserConstructor> {
		this._debug.info('Retrieving all registered parsers');
		return this._parsers;
	}

	register(type: string, parserClass: TParserConstructor): this {
		this._debug.info(`Attempting to register parser for type: ${type}`);
		this._parsers.set(type, parserClass);
		this._debug.info(`Registered parser for type: ${type} (${parserClass.name})`);
		return this;
	}

	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing ${context.envKey} with type: ${context.schema.type}`);
		const ParserClass = this._parsers.get(context.schema.type);
		if (!ParserClass) {
			this._debug.error(`No parser registered for type: ${context.schema.type}`);
			throw new EnvironmentParseError(
				context.envKey,
				`No parser registered for type: ${context.schema.type}`,
				context.path
			);
		}
		this._debug.info(`Found parser for type: ${context.schema.type} (${ParserClass.name})`);
		const parser = new ParserClass(this);
		const result = parser.parse(context);
		this._debug.info(`Successfully parsed ${context.envKey} with type: ${context.schema.type}`);
		return result;
	}

	private _registerDefaultParsers(): void {
		this._debug.info('Registering default parsers');
		this.register('string', StringParser)
			.register('number', NumberParser)
			.register('boolean', BooleanParser)
			.register('enum', EnumParser)
			.register('array', ArrayParser);
		this._debug.info('Default parsers registered');
	}
}
