import { EnvironmentValidationError } from '../errors';
import { EnumSchema, ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class EnumParser extends BaseParser<string> {
	parse(context: ParserContext): ParserResult {
		const enumSchema = context.schema as EnumSchema<readonly string[]>;
		this._debug.info(`Parsing enum value: ${context.value}`);

		const normalizedValue = this.validateEnumValue(context.value, enumSchema);

		const transformedValue = this.transform(normalizedValue, context);

		this._debug.info(`Parsed enum value: ${transformedValue}`);
		return { value: transformedValue };
	}

	private validateEnumValue(value: string, schema: EnumSchema<readonly string[]>): string {
		const normalizedValue = value.trim();

		if (!schema.values.includes(normalizedValue)) {
			this._debug.error(`Invalid enum value: ${normalizedValue}`);
			throw new EnvironmentValidationError(
				'',
				`Invalid value. Allowed values are: ${schema.values.join(', ')}`,
				[]
			);
		}

		return normalizedValue;
	}
}
