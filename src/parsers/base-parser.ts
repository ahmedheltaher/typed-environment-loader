import { createDebugLogger } from '../debug';
import { EnvironmentTransformError, EnvironmentValidationError } from '../errors';
import { Parser, ParserContext, ParserResult, TransformFunction, Validator } from '../types';

export abstract class BaseParser implements Parser {
	protected readonly _debug = createDebugLogger(this.constructor.name);

	protected removeQuotes(value: string): string {
		this._debug.trace(`Removing quotes from value: ${value}`);
		return value.trim().replace(/^['"]|['"]$/g, '');
	}

	abstract parse(context: ParserContext): ParserResult;
	// abstract validate<Type>(value: Type, context: ParserContext): Promise<void>;

	protected transform<Type>(value: Type, context: ParserContext): Type {
		this._debug.trace(`Transforming value: ${value}`);
		const schema = context.schema;
		if (!('transform' in schema) || !schema.transform) {
			return value;
		}
		const transform = schema.transform;
		const transformFunction =
			typeof transform === 'function' ?
				(transform as TransformFunction<Type>)
			:	(transform.function as TransformFunction<Type>);

		try {
			return transformFunction(value);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new EnvironmentTransformError(context.envKey, errorMessage, context.path);
		}
	}

	protected runCustomValidator<Type>(
		validator: Validator<Type> | undefined,
		value: Type,
		context: ParserContext
	): void {
		if (!validator) return;
		const validatorFunction = typeof validator === 'function' ? validator : validator.function;
		const message = typeof validator === 'function' ? 'Value failed custom validation' : validator.message;

		if (!validatorFunction(value)) {
			throw new EnvironmentValidationError(context.envKey, message, context.path);
		}
	}
}
