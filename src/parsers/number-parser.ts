import { EnvironmentValidationError } from '../errors';
import { PrimitiveSchema } from '../types';
import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class NumberParser extends BaseParser<PrimitiveSchema> {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

		if (!context.value) {
			return { value: this.getDefaultValue(context.schema) };
		}

		const value = context.value.replace(/^['"]|['"]$/g, '');

		if (!/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)) {
			throw new EnvironmentValidationError(context.envKey, 'Invalid numeric format', context.path);
		}

		const num = Number(value);
		if (isNaN(num)) {
			throw new EnvironmentValidationError(context.envKey, 'Invalid number', context.path);
		}

		return { value: num };
	}
}
