import { ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class StringParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		const value = this.removeQuotes(context.value);
		return { value };
	}
}
