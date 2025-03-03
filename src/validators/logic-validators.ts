import { Validator } from '../types';
import { ValidationMessage } from './types';
import { createValidator } from './utils';

/**
 * Helper to extract validators and custom message from arguments
 */
function extractValidatorArgs<T>(args: (Validator<T> | ValidationMessage)[]) {
	const lastArg = args[args.length - 1];
	const hasCustomMessage = typeof lastArg === 'string' || typeof lastArg === 'function';

	return {
		validators: hasCustomMessage ? (args.slice(0, -1) as Validator<T>[]) : (args as Validator<T>[]),
		customMessage: hasCustomMessage ? (lastArg as ValidationMessage) : undefined
	};
}

/**
 * Logical composition validators for combining validation rules
 */
export const logicalValidators = {
	/**
	 * Combines multiple validators with AND logic (all must pass)
	 * @param validators Array of validators to combine
	 * @param customMessage Optional custom error message
	 */
	all: <T>(...args: (Validator<T> | ValidationMessage)[]): Validator<T> => {
		const { validators, customMessage } = extractValidatorArgs<T>(args);

		return createValidator(
			value =>
				validators.every(validator => {
					const validatorFunction = typeof validator === 'function' ? validator : validator.function;
					return validatorFunction(value);
				}),
			customMessage || 'Failed to satisfy all validation requirements',
			`Validates value passes all of ${validators.length} requirements`
		);
	},

	/**
	 * Combines multiple validators with OR logic (at least one must pass)
	 * @param validators Array of validators to combine
	 * @param customMessage Optional custom error message
	 */
	any: <T>(...args: (Validator<T> | ValidationMessage)[]): Validator<T> => {
		const { validators, customMessage } = extractValidatorArgs<T>(args);

		return createValidator(
			value =>
				validators.some(validator => {
					const validatorFunction = typeof validator === 'function' ? validator : validator.function;
					return validatorFunction(value);
				}),
			customMessage || 'Failed to satisfy any validation requirement',
			`Validates value passes at least one of ${validators.length} requirements`
		);
	},

	/**
	 * Inverts the result of a validator
	 * @param validator Validator to invert
	 * @param customMessage Optional custom error message
	 */
	not: <T>(validator: Validator<T>, customMessage?: ValidationMessage): Validator<T> => {
		const validatorFunction = typeof validator === 'function' ? validator : validator.function;
		const validatorMessage = typeof validator === 'function' ? 'validation' : validator.message;

		return createValidator(
			value => !validatorFunction(value),
			customMessage || `Must not satisfy: ${validatorMessage}`,
			`Validates value does NOT pass the provided validation`
		);
	}
};
