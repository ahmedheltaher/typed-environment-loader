import { EnvironmentValidationError } from '../errors';
import { NumberSchema, ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class NumberParser extends BaseParser<number> {
	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing number for key: ${context.envKey}, raw value: ${context.value}`);

		const value = this.removeQuotes(context.value);
		this._debug.info(`Value after removing quotes: ${value}`);

		const num = this.parseNumber(value, context);

		const numberSchema = context.schema as NumberSchema;
		this.validate(num, numberSchema, context);

		const transformedValue = this.transform(num, context);
		this._debug.info(`Parsed number for key: ${context.envKey}, value: ${transformedValue}`);

		return { value: transformedValue };
	}

	private parseNumber(value: string, context: ParserContext): number {
		if (value === 'NaN') {
			throw new EnvironmentValidationError(context.envKey, 'Invalid number (NaN)', context.path);
		}

		const num = Number(value);

		if (isNaN(num)) {
			this._debug.error(`Failed to parse number for key: ${context.envKey}, value: ${value}`);
			throw new EnvironmentValidationError(
				context.envKey,
				`Cannot convert "${value}" to a valid number`,
				context.path
			);
		}

		return num;
	}

	private validate(value: number, schema: NumberSchema, context: ParserContext): void {
		if (schema.min !== undefined && value < schema.min) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Number too small. Value (${value}) must be at least ${schema.min}`,
				context.path
			);
		}

		if (schema.max !== undefined && value > schema.max) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Number too large. Value (${value}) must not exceed ${schema.max}`,
				context.path
			);
		}

		if (schema.integer === true && !Number.isInteger(value)) {
			throw new EnvironmentValidationError(context.envKey, `Value (${value}) must be an integer`, context.path);
		}

		this.runCustomValidator(schema.validator, value, context);
		this._debug.trace(`Number validation passed for key: ${context.envKey}`);
	}
}
