import { EnvironmentParseError, EnvironmentValidationError } from '../errors';
import { ArraySchema, ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';
import { ParserRegistry } from './parser-registry';

export class ArrayParser extends BaseParser {
	constructor(private readonly registry: ParserRegistry) {
		super();
	}

	parse(context: ParserContext): ParserResult {
		this._debug.info('Parsing array', context);

		let parsed: unknown;
		try {
			parsed = JSON.parse(context.value);
			this._debug.info('Parsed JSON successfully', parsed);
		} catch (error) {
			this._debug.error('Error parsing JSON', error);
			throw new EnvironmentParseError(context.envKey, 'Invalid JSON format', context.path, error as Error);
		}

		if (!Array.isArray(parsed)) {
			this._debug.error('Not a valid JSON array', parsed);
			throw new EnvironmentParseError(context.envKey, 'Not a valid JSON array', context.path);
		}

		const arraySchema = context.schema as ArraySchema;
		const value = parsed.map((item, index) => {
			const itemCtx: ParserContext = {
				envKey: `${context.envKey}[${index}]`,
				path: [...context.path, index.toString()],
				schema: arraySchema.items,
				value: JSON.stringify(item)
			};

			this._debug.info(`Parsing array item at index ${index}`, itemCtx);

			try {
				const parsedItem = this.registry.parse(itemCtx).value;
				this._debug.info(`Parsed array item at index ${index} successfully`, parsedItem);
				return parsedItem;
			} catch (error) {
				this._debug.error(`Error parsing array item at index ${index}`, error);
				throw new EnvironmentValidationError(
					context.envKey,
					`Item ${index}: ${(error as Error).message}`,
					context.path
				);
			}
		});

		this.validate(value, arraySchema, context);
		const transformedValue = this.transform(value, context);
		this._debug.info('Transformed array successfully', transformedValue);
		this._debug.info('Parsed array successfully', value);
		return { value: transformedValue };
	}

	private validate(value: unknown[], schema: ArraySchema, context: ParserContext): void {
		if (schema.minItems !== undefined && value.length < schema.minItems) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Array length (${value.length}) is less than minimum length (${schema.minItems})`,
				context.path
			);
		}

		if (schema.maxItems !== undefined && value.length > schema.maxItems) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Array length (${value.length}) exceeds maximum length (${schema.maxItems})`,
				context.path
			);
		}

		this.runCustomValidator(schema.validator, value, context);
		this._debug.trace(`Validated array for key: ${context.envKey}, value: ${value}`);
	}
}
