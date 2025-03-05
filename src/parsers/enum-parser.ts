import { EnvironmentValidationError } from '../errors';
import { EnumSchema, ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class EnumParser extends BaseParser<string> {
	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing enum value: ${context.value}`);

		const normalizedValue = this.validateEnumValue(context);
		const transformedValue = this.transform(normalizedValue, context);

		this._debug.info(`Parsed enum value: ${transformedValue}`);
		return { value: transformedValue };
	}

	private validateEnumValue(context: ParserContext): string {
		const schema = context.schema as EnumSchema<readonly string[]>;
		const normalizedValue = context.value.trim();

		if (!schema.values.includes(normalizedValue)) {
			this._debug.error(`Invalid enum value: ${normalizedValue}`);
			throw new EnvironmentValidationError(
				context.envKey,
				`Invalid value. Allowed values are: ${schema.values.join(', ')}`,
				context.path
			);
		}

		return normalizedValue;
	}
}
