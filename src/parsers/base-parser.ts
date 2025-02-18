import { createDebugLogger } from '../debug';
import { Parser, ParserContext, ParserResult } from '../types';

export abstract class BaseParser implements Parser {
	protected readonly _debug = createDebugLogger(this.constructor.name);

	protected removeQuotes(value: string): string {
		this._debug.trace(`Removing quotes from value: ${value}`);
		return value.trim().replace(/^['"]|['"]$/g, '');
	}

	abstract parse(context: ParserContext): ParserResult;

	// TODO: Add a method to validate the value
	// TODO: Add a method to normalize the value
	// TODO: Add a method to transform the value
	// TODO: Add a method to handle default values
}
