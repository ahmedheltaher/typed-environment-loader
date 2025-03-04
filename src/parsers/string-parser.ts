import { EnvironmentValidationError } from '../errors';
import { ParserContext, ParserResult, StringSchema } from '../types';
import { BaseParser } from './base-parser';

export class StringParser extends BaseParser<string> {
	parse(context: ParserContext): ParserResult {
		const value = this.removeQuotes(context.value);
		const stringSchema = context.schema as StringSchema;

		this._debug.info(`Parsing string for key: ${context.envKey}, value: ${value}`);

		this.validate(value, stringSchema, context);
		const transformedValue = this.transform(value, context);

		return { value: transformedValue };
	}

	private validate(value: string, schema: StringSchema, context: ParserContext): void {
		if (schema.minLength !== undefined && value.length < schema.minLength) {
			throw new EnvironmentValidationError(
				context.envKey,
				`String too short. Length (${value.length}) must be at least ${schema.minLength}`,
				context.path
			);
		}

		if (schema.maxLength !== undefined && value.length > schema.maxLength) {
			throw new EnvironmentValidationError(
				context.envKey,
				`String too long. Length (${value.length}) must not exceed ${schema.maxLength}`,
				context.path
			);
		}

		if (schema.pattern) {
			const pattern = schema.pattern instanceof RegExp ? schema.pattern : new RegExp(schema.pattern);

			if (!pattern.test(value)) {
				throw new EnvironmentValidationError(
					context.envKey,
					`Value does not match required pattern: ${pattern}`,
					context.path
				);
			}
		}

		this.runCustomValidator(schema.validator, value, context);
		this._debug.trace(`String validation passed for key: ${context.envKey}`);
	}
}
