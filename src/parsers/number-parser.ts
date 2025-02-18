import { EnvironmentValidationError } from '../errors';
import { ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class NumberParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing value for key: ${context.envKey}, raw value: ${context.value}`);
		const value = this.removeQuotes(context.value);
		this._debug.info(`Value after removing quotes: ${value}`);

		if (value === 'NaN') {
			this._debug.error(`Invalid number for key: ${context.envKey}, value is NaN`);
			throw new EnvironmentValidationError(context.envKey, 'Invalid number', context.path);
		}

		const num = Number(value);
		if (isNaN(num)) {
			this._debug.error(`Invalid number for key: ${context.envKey}, value: ${value}`);
			throw new EnvironmentValidationError(context.envKey, 'Invalid number', context.path);
		}

		this._debug.info(`Parsed number for key: ${context.envKey}, value: ${num}`);
		return { value: num };
	}
}
