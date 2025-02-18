import { EnvironmentValidationError } from '../errors';
import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class NumberParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

		const value = this.removeQuotes(context.value);

		if (value === 'NaN') {
			throw new EnvironmentValidationError(context.envKey, 'Invalid number', context.path);
		}

		const num = Number(value);
		if (isNaN(num)) {
			throw new EnvironmentValidationError(context.envKey, 'Invalid number', context.path);
		}

		return { value: num };
	}
}
