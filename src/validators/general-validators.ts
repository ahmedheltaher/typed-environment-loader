import { Validator } from '../types';
import { LengthValidatorOptions, ValidationMessage } from './types';
import { createValidator } from './utils';

/**
 * General-purpose validators
 */
export const generalValidators = {
	/**
	 * Validates that a value is one of the provided options
	 * @param options Array of allowed values
	 * @param customMessage Optional custom error message
	 */
	oneOf: <T>(options: readonly T[], customMessage?: ValidationMessage): Validator<T> =>
		createValidator(
			value => options.includes(value),
			customMessage || `Value must be one of: ${options.join(', ')}`,
			`Validates value is one of a predefined set: ${options.join(', ')}`
		),

	/**
	 * Validates that a value is not undefined or null
	 * @param customMessage Optional custom error message
	 */
	required: <T>(customMessage?: ValidationMessage): Validator<T> =>
		createValidator(
			(value): boolean => value != null,
			customMessage || 'Value is required',
			'Validates value is not undefined or null'
		),

	/**
	 * Validates that a number is within a specified range
	 * @param min Minimum allowed value (inclusive)
	 * @param max Maximum allowed value (inclusive)
	 * @param customMessage Optional custom error message
	 */
	range: (min: number, max: number, customMessage?: ValidationMessage): Validator<number> =>
		createValidator(
			value => value >= min && value <= max,
			customMessage || `Value must be between ${min} and ${max}`,
			`Validates number is within range ${min}-${max}`
		),

	/**
	 * Validates that a string or array has a length within specified bounds
	 * @param options Min and max length options
	 * @param customMessage Optional custom error message
	 */
	length: (options: LengthValidatorOptions, customMessage?: ValidationMessage): Validator<{ length: number }> => {
		const { min, max, exact } = options;

		let message = 'Invalid length';
		if (exact !== undefined) {
			message = `Must have exactly ${exact} items`;
		} else if (min !== undefined && max !== undefined) {
			message = `Length must be between ${min} and ${max}`;
		} else if (min !== undefined) {
			message = `Must have at least ${min} items`;
		} else if (max !== undefined) {
			message = `Must have at most ${max} items`;
		}

		return createValidator(
			value => {
				const length = value.length;
				if (exact !== undefined) return length === exact;

				const minValid = min === undefined || length >= min;
				const maxValid = max === undefined || length <= max;
				return minValid && maxValid;
			},
			customMessage || message,
			`Validates length constraints${
				exact !== undefined ? ` (exactly ${exact})`
				: min !== undefined && max !== undefined ? ` (${min}-${max})`
				: ''
			}`
		);
	}
};
