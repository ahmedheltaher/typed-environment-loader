import { EnvironmentValidationError } from '../errors';
import { NumberSchema, ParserContext, ParserResult } from '../types';
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

		const numberSchema = context.schema as NumberSchema;
		this.validate(num, numberSchema, context);

		const transformedValue = this.transform(num, context);
		this._debug.info(`Transformed number for key: ${context.envKey}, value: ${transformedValue}`);

		this._debug.info(`Parsed number for key: ${context.envKey}, value: ${num}`);
		return { value: transformedValue };
	}

	private validate(value: number, schema: NumberSchema, context: ParserContext): void {
		if (schema.min !== undefined && value < schema.min) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Value (${value}) is less than minimum (${schema.min})`,
				context.path
			);
		}

		if (schema.max !== undefined && value > schema.max) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Value (${value}) exceeds maximum (${schema.max})`,
				context.path
			);
		}

		if (schema.integer === true && !Number.isInteger(value)) {
			throw new EnvironmentValidationError(context.envKey, `Value (${value}) must be an integer`, context.path);
		}

		this.runCustomValidator(schema.validator, value, context);
		this._debug.trace(`Validated number for key: ${context.envKey}, value: ${value}`);
	}
}
