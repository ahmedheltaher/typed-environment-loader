import { EnvironmentValidationError } from '../errors';
import { ParserContext, ParserResult, StringSchema } from '../types';
import { BaseParser } from './base-parser';

export class StringParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		const value = this.removeQuotes(context.value);
		const stringSchema = context.schema as StringSchema;
		this.validate(value, stringSchema, context);
		return { value };
	}

	private validate(value: string, schema: StringSchema, context: ParserContext): void {
		if (schema.minLength !== undefined && value.length < schema.minLength) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Value length (${value.length}) is less than minimum length (${schema.minLength})`,
				context.path
			);
		}

		if (schema.maxLength !== undefined && value.length > schema.maxLength) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Value length (${value.length}) exceeds maximum length (${schema.maxLength})`,
				context.path
			);
		}

		if (schema.pattern) {
			const pattern = schema.pattern instanceof RegExp ? schema.pattern : new RegExp(schema.pattern);

			if (!pattern.test(value)) {
				throw new EnvironmentValidationError(
					context.envKey,
					`Value does not match pattern: ${pattern}`,
					context.path
				);
			}
		}
		this.runCustomValidator(schema.validator, value, context);
		this._debug.trace(`Validated string for key: ${context.envKey}, value: ${value}`);
	}
}
