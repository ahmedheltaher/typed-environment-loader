import { EnvironmentValidationError } from '../errors';
import { EnumSchema } from '../types';
import { BaseParser } from './base-parser';
import { ParserContext, ParserResult } from './types';

export class EnumParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

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
