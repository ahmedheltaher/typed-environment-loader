import { EnvironmentValidationError } from '../errors';
import { ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class BooleanParser extends BaseParser<boolean> {
	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing boolean for key: ${context.envKey}, value: ${context.value}`);

		const normalized = this.normalizeBoolean(context);

		const transformedValue = this.transform(normalized, context);

		this._debug.info(`Parsed boolean value: ${transformedValue}`);
		return { value: transformedValue };
	}

	private normalizeBoolean(context: ParserContext): boolean {
		const normalized = context.value.trim().toLowerCase();

		const trueValues = ['true', '1', 'yes', 'y', 'on'];
		const falseValues = ['false', '0', 'no', 'n', 'off'];

		if (trueValues.includes(normalized)) {
			return true;
		}

		if (falseValues.includes(normalized)) {
			return false;
		}

		throw new EnvironmentValidationError(
			context.envKey,
			`Invalid boolean value. Must be one of: [${[...trueValues, ...falseValues].join(', ')}]`,
			context.path
		);
	}
}
