import { EnvironmentParseError, EnvironmentValidationError } from '../errors';
import { ArraySchema } from '../types';
import { BaseParser } from './base-parser';
import { ParserRegistry } from './parser-registry';
import { ParserContext, ParserResult } from './types';

export class ArrayParser extends BaseParser<ArraySchema> {
	constructor(private readonly registry: ParserRegistry) {
		super();
	}

	parse(context: ParserContext): ParserResult {
		this.validateRequired(context);

		if (!context.value) {
			return { value: this.getDefaultValue(context.schema) };
		}

		try {
			const parsed = JSON.parse(context.value);
			if (!Array.isArray(parsed)) {
				throw new EnvironmentParseError(context.envKey, 'Not a valid JSON array', context.path);
			}

			const arraySchema = context.schema as ArraySchema;
			return {
				value: parsed.map((item, index) => {
					const itemCtx: ParserContext = {
						envKey: `${context.envKey}[${index}]`,
						path: [...context.path, index.toString()],
						schema: arraySchema.items,
						value: JSON.stringify(item)
					};

					try {
						return this.registry.parse(itemCtx).value;
					} catch (error) {
						throw new EnvironmentValidationError(
							context.envKey,
							`Item ${index}: ${(error as Error).message}`,
							context.path
						);
					}
				})
			};
		} catch (error) {
			throw new EnvironmentParseError(context.envKey, 'Invalid JSON format', context.path, error as Error);
		}
	}
}
