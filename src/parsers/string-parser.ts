import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class StringParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);
		const value = this.removeQuotes(context.value);
		return { value };
	}
}
