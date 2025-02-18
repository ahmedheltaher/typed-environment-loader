import { EnvironmentMissingError } from '../errors';
import { Parser, ParserContext, ParserResult } from './types';

export abstract class BaseParser implements Parser {
	protected validateRequired(context: ParserContext): void {
		if (context.schema.required && !context.value) {
			throw new EnvironmentMissingError(context.envKey, context.path);
		}
	}

	protected removeQuotes(value: string): string {
		return value.trim().replace(/^['"]|['"]$/g, '');
	}

	abstract parse(context: ParserContext): ParserResult;
}
