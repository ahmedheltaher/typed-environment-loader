import { EnvironmentValidationError } from '../errors';
import { ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class BooleanParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing boolean for key: ${context.envKey}, value: ${context.value}`);
		const normalized = context.value.toLowerCase();
		if (normalized === 'true') {
			this._debug.info(`Parsed value is true for key: ${context.envKey}`);
			return { value: true };
		}
		if (normalized === 'false') {
			this._debug.info(`Parsed value is false for key: ${context.envKey}`);
			return { value: false };
		}

		this._debug.error(`Failed to parse boolean for key: ${context.envKey}, value: ${context.value}`);
		throw new EnvironmentValidationError(context.envKey, 'Must be "true" or "false"', context.path);
	}
}
