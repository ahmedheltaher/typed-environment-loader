import { Validator, ValidatorFunction } from '../types';
import { ValidationMessage } from './types';

/**
 * Creates a properly formatted validation message
 */
const createMessage = (message: ValidationMessage): string => {
	return typeof message === 'function' ? message() : message;
};
/**
 * Creates a validator object from a validation function and message
 */

export const createValidator = <T>(
	validationFunction: ValidatorFunction<T>,
	message: ValidationMessage,
	description?: string
): Validator<T> => ({
	function: validationFunction,
	message: createMessage(message),
	description
});
