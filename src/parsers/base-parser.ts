import { EnvironmentMissingError } from '../errors';
import { SchemaItem } from '../types';
import { Parser, ParserContext, ParserResult } from './types';

export abstract class BaseParser<T extends SchemaItem> implements Parser {
	protected validateRequired(context: ParserContext): void {
		if (context.schema.required && !context.value) {
			throw new EnvironmentMissingError(context.envKey, context.path);
		}
	}

	protected getDefaultValue(schema: SchemaItem): T['default'] {
		return Array.isArray(schema.default) ? [...schema.default] : schema.default;
	}

	abstract parse(ctx: ParserContext): ParserResult;
}
