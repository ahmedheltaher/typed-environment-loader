import { PrimitiveSchema } from '../types';
import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class StringParser extends BaseParser<PrimitiveSchema> {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

		if (!context.value) {
			return { value: this.getDefaultValue(context.schema) };
		}
		const value = context.value.replace(/^['"]|['"]$/g, '');
		return { value };
	}
}
