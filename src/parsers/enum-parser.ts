import { EnvironmentValidationError } from '../errors';
import { EnumSchema } from '../types';
import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class EnumParser extends BaseParser<EnumSchema<readonly string[]>> {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

		if (!context.value) {
			return { value: this.getDefaultValue(context.schema) };
		}

		const enumSchema = context.schema as EnumSchema<readonly string[]>;
		if (!enumSchema.values.includes(context.value)) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Allowed values: ${enumSchema.values.join(', ')}`,
				context.path
			);
		}

		return { value: context.value };
	}
}
