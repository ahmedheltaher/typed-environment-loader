import { EnvironmentValidationError } from '../errors';
import { EnumSchema, ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';

export class EnumParser extends BaseParser {
	parse(context: ParserContext): ParserResult {
		const enumSchema = context.schema as EnumSchema<readonly string[]>;
		this._debug.trace(`Parsing value: (${context.value}) as enum`);

		if (!enumSchema.values.includes(context.value)) {
			this._debug.error(`Invalid value: (${context.value}) not in allowed values: [${enumSchema.values}]`);
			throw new EnvironmentValidationError(
				context.envKey,
				`Allowed values: ${enumSchema.values.join(', ')}`,
				context.path
			);
		}

		this._debug.info(`Parsed value: ${context.value}`);
		return { value: context.value };
	}
}
