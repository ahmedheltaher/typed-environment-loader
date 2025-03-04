import { createDebugLogger } from '../debug';
import { EnvironmentTransformError, EnvironmentValidationError } from '../errors';
import { Parser, ParserContext, ParserResult, TransformFunction, Validator } from '../types';

export abstract class BaseParser<T = unknown> implements Parser {
	protected readonly _debug = createDebugLogger(this.constructor.name);

	protected removeQuotes(value: string): string {
		this._debug.trace(`Removing quotes from value: ${value}`);
		return value.trim().replace(/^['"`]|['"`]$/g, '');
	}

	abstract parse(context: ParserContext): ParserResult;

	protected transform(value: T, context: ParserContext): T {
		this._debug.trace(`Transforming value: ${value}`);
		const schema = context.schema;

		if (!('transform' in schema) || !schema.transform) {
			return value;
		}

		const transformFunction =
			typeof schema.transform === 'function' ?
				(schema.transform as TransformFunction<T>)
			:	(schema.transform.function as TransformFunction<T>);

		try {
			const transformedValue = transformFunction(value);
			this._debug.info(`Successfully transformed value: ${transformedValue}`);
			return transformedValue;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			this._debug.error(`Transform error: ${errorMessage}`);
			throw new EnvironmentTransformError(context.envKey, errorMessage, context.path);
		}
	}

	protected runCustomValidator(validator: Validator<T> | undefined, value: T, context: ParserContext): void {
		if (!validator) return;

		const validatorFunction = typeof validator === 'function' ? validator : validator.function;

		const message = typeof validator === 'function' ? 'Value failed custom validation' : validator.message;

		try {
			const isValid = validatorFunction(value);

			if (!isValid) {
				this._debug.error(`Custom validation failed: ${message}`);
				throw new EnvironmentValidationError(context.envKey, message, context.path);
			}
		} catch (error) {
			this._debug.error(`Validation error: ${error}`);
			throw new EnvironmentValidationError(context.envKey, message, context.path);
		}
	}
}
