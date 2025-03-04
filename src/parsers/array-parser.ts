import { EnvironmentParseError, EnvironmentValidationError } from '../errors';
import { ArraySchema, ParserContext, ParserResult } from '../types';
import { BaseParser } from './base-parser';
import { ParserRegistry } from './parser-registry';

export class ArrayParser extends BaseParser<unknown[]> {
	constructor(private readonly registry: ParserRegistry) {
		super();
	}

	parse(context: ParserContext): ParserResult {
		this._debug.info(`Parsing array for key: ${context.envKey}`);

		const parsed = this.parseJsonArray(context);
		const validatedArray = this.validateAndParseItems(parsed, context);
		const transformedValue = this.transform(validatedArray, context);

		this._debug.info(`Parsed array successfully: ${transformedValue}`);
		return { value: transformedValue };
	}

	private parseJsonArray(context: ParserContext): unknown[] {
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

		return parsed;
	}

	private validateAndParseItems(items: unknown[], context: ParserContext): unknown[] {
		const arraySchema = context.schema as ArraySchema;

		this.validateArrayLength(items, arraySchema, context);

		const parsedItems = items.map((item, index) => {
			const itemCtx: ParserContext = {
				envKey: `${context.envKey}[${index}]`,
				path: [...context.path, index.toString()],
				schema: arraySchema.items,
				value: JSON.stringify(item)
			};

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

		this.runCustomValidator(arraySchema.validator, parsedItems, context);
		return parsedItems;
	}

	private validateArrayLength(items: unknown[], schema: ArraySchema, context: ParserContext): void {
		if (schema.minItems !== undefined && items.length < schema.minItems) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Array must have at least ${schema.minItems} items (current: ${items.length})`,
				context.path
			);
		}

		if (schema.maxItems !== undefined && items.length > schema.maxItems) {
			throw new EnvironmentValidationError(
				context.envKey,
				`Array must not exceed ${schema.maxItems} items (current: ${items.length})`,
				context.path
			);
		}
	}
}
