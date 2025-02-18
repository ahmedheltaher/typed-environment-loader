import { createDebugLogger } from '../debug';
import { Parser, ParserContext, ParserResult } from '../types';

export abstract class BaseParser implements Parser {
	protected readonly _debug = createDebugLogger(this.constructor.name);

	protected removeQuotes(value: string): string {
		this._debug.trace(`Removing quotes from value: ${value}`);
		return value.trim().replace(/^['"]|['"]$/g, '');
	}

	abstract parse(context: ParserContext): ParserResult;
}
