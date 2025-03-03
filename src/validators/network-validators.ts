import { Validator } from '../types';
import { ValidationMessage } from './types';
import { createValidator } from './utils';
import { ValidationPatterns } from './validation-patterns';

/**
 * Network-related validators
 */
export const networkValidators = {
	/**
	 * Validates that a string is a properly formatted IPv4 address
	 * @param customMessage Optional custom error message
	 */
	ipv4: (customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => ValidationPatterns.ipv4.test(value),
			customMessage || 'Invalid IPv4 address',
			'Validates IPv4 address format (e.g., 192.168.1.1)'
		),

	/**
	 * Validates that a string is a properly formatted IPv6 address
	 * @param customMessage Optional custom error message
	 */
	ipv6: (customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => {
				try {
					const parts = value.split(':');
					if (parts.length < 2 || parts.length > 8) return false;

					for (const part of parts) {
						if (part === '') continue; // Empty segment is valid in certain positions
						if (!ValidationPatterns.ipv6Segment.test(part)) return false;
					}

					return true;
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (_) {
					return false;
				}
			},
			customMessage || 'Invalid IPv6 address',
			'Validates IPv6 address format (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334)'
		),

	/**
	 * Validates that a string is a properly formatted IP address (IPv4 or IPv6)
	 * @param customMessage Optional custom error message
	 */
	ip: (customMessage?: ValidationMessage): Validator<string> => {
		const _ipv4Validator = networkValidators.ipv4();
		const _ipv6Validator = networkValidators.ipv6();
		const ipv4Validator = typeof _ipv4Validator === 'function' ? _ipv4Validator : _ipv4Validator.function;
		const ipv6Validator = typeof _ipv6Validator === 'function' ? _ipv6Validator : _ipv6Validator.function;

		return createValidator(
			value => ipv4Validator(value) || ipv6Validator(value),
			customMessage || 'Invalid IP address (must be IPv4 or IPv6)',
			'Validates IP address format (both IPv4 and IPv6)'
		);
	},

	/**
	 * Validates that a number is a valid port number
	 * @param customMessage Optional custom error message
	 */
	port: (customMessage?: ValidationMessage): Validator<number> =>
		createValidator(
			value => Number.isInteger(value) && value >= 0 && value <= 65_535,
			customMessage || 'Invalid port number (must be an integer between 0 and 65535)',
			'Validates port number (0-65535)'
		)
};
