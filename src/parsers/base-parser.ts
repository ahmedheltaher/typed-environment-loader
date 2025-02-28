import { createDebugLogger } from '../debug';
import { EnvironmentValidationError } from '../errors';
import { Parser, ParserContext, ParserResult, Validator } from '../types';

export abstract class BaseParser implements Parser {
	protected readonly _debug = createDebugLogger(this.constructor.name);

	protected removeQuotes(value: string): string {
		this._debug.trace(`Removing quotes from value: ${value}`);
		return value.trim().replace(/^['"]|['"]$/g, '');
	}

	abstract parse(context: ParserContext): ParserResult;

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
