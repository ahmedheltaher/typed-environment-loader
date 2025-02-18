import { EnvironmentValidationError } from '../errors';
import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class BooleanParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

		const normalized = context.value.toLowerCase();
		if (normalized === 'true') return { value: true };
		if (normalized === 'false') return { value: false };

		throw new EnvironmentValidationError(context.envKey, 'Must be "true" or "false"', context.path);
	}
}
