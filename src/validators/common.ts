import { Validator } from '../types/utils';

/**
 * Collection of common validation functions to reduce boilerplate
 */
export const validators = {
	/**
	 * Validates that a string is a properly formatted email address
	 */
	email: (): Validator<string> => ({
		function: (value: string) => {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			return emailRegex.test(value);
		},
		message: 'Invalid email format'
	}),

	/**
	 * Validates that a string is a properly formatted URL
	 * @param options Configuration options for URL validation
	 */
	url: (options: { protocols?: string[]; requireTld?: boolean } = {}): Validator<string> => ({
		function: (value: string) => {
			try {
				const url = new URL(value);

				// Check protocol if specified
				if (options.protocols && options.protocols.length > 0) {
					const hasValidProtocol = options.protocols.some(
						protocol => url.protocol === protocol || url.protocol === `${protocol}:`
					);
					if (!hasValidProtocol) return false;
				}

				// Check TLD if required
				if (options.requireTld !== false) {
					const hostnameParts = url.hostname.split('.');
					const tld = hostnameParts[hostnameParts.length - 1];
					if (!tld || tld.length < 2) return false;
				}

				return true;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_error) {
				return false;
			}
		},
		message: 'Invalid URL format'
	}),

	/**
	 * Validates that a string is a properly formatted IPv4 address
	 */
	ipv4: (): Validator<string> => ({
		function: (value: string) => {
			const ipv4Regex =
				/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
			return ipv4Regex.test(value);
		},
		message: 'Invalid IPv4 address'
	}),

	/**
	 * Validates that a string is a properly formatted IPv6 address
	 */
	ipv6: (): Validator<string> => ({
		function: (value: string) => {
			try {
				const parts = value.split(':');
				if (parts.length < 2 || parts.length > 8) return false;

				// Check for valid hexadecimal segments
				for (const part of parts) {
					if (part === '') continue; // Empty segment is valid in certain positions
					if (!/^[0-9A-Fa-f]{1,4}$/.test(part)) return false;
				}

				return true;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_error) {
				return false;
			}
		},
		message: 'Invalid IPv6 address'
	}),

	/**
	 * Validates that a string is a properly formatted IP address (IPv4 or IPv6)
	 */
	ip: (): Validator<string> => ({
		function: (value: string) => {
			const _ipv4Validator = validators.ipv4();
			const _ipv6Validator = validators.ipv6();
			const ipv4Validator = typeof _ipv4Validator === 'function' ? _ipv4Validator : _ipv4Validator.function;
			const ipv6Validator = typeof _ipv6Validator === 'function' ? _ipv6Validator : _ipv6Validator.function;
			return ipv4Validator(value) || ipv6Validator(value);
		},
		message: 'Invalid IP address'
	}),

	/**
	 * Validates that a string is a valid date
	 * @param options Configuration options for date validation
	 */
	date: (options: { format?: 'iso' | 'rfc3339' | 'any' } = {}): Validator<string> => ({
		function: (value: string) => {
			const format = options.format || 'any';

			if (format === 'iso') {
				return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/.test(value);
			}

			if (format === 'rfc3339') {
				return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.test(value);
			}

			// For 'any' format, just check if it's a valid date
			const date = new Date(value);
			return !isNaN(date.getTime());
		},
		message: 'Invalid date format'
	}),

	/**
	 * Validates that a string matches a UUID format
	 * @param version UUID version to validate (default: any)
	 */
	uuid: (version?: 1 | 3 | 4 | 5): Validator<string> => ({
		function: (value: string) => {
			const patterns = {
				1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
				3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
				4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
				5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
				any: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
			};

			const pattern = version ? patterns[version] : patterns.any;
			return pattern.test(value);
		},
		message: version ? `Invalid UUID v${version} format` : 'Invalid UUID format'
	}),

	/**
	 * Validates that a string is a valid port number
	 */
	port: (): Validator<number> => ({
		function: (value: number) => {
			return Number.isInteger(value) && value >= 0 && value <= 65535;
		},
		message: 'Invalid port number (must be an integer between 0 and 65535)'
	}),

	/**
	 * Validates that a string is alphanumeric
	 * @param options Configuration options
	 */
	alphanumeric: (options: { allowSpaces?: boolean } = {}): Validator<string> => ({
		function: (value: string) => {
			const pattern = options.allowSpaces ? /^[a-zA-Z0-9\s]*$/ : /^[a-zA-Z0-9]*$/;
			return pattern.test(value);
		},
		message:
			options.allowSpaces ?
				'Value must contain only letters, numbers, and spaces'
			:	'Value must contain only letters and numbers'
	}),

	/**
	 * Validates that a string is a valid hex color
	 */
	hexColor: (): Validator<string> => ({
		function: (value: string) => {
			return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);
		},
		message: 'Invalid hex color format (must be #RGB or #RRGGBB)'
	}),

	/**
	 * Validates that a string matches a specific format
	 * @param name Name of the format (for error messages)
	 * @param regex Regular expression to test against
	 */
	pattern: (name: string, regex: RegExp): Validator<string> => ({
		function: (value: string) => regex.test(value),
		message: `Invalid ${name} format`
	}),

	/**
	 * Validates that a value is one of the provided options
	 * @param options Array of allowed values
	 */
	oneOf: <T>(options: readonly T[]): Validator<T> => ({
		function: (value: T) => options.includes(value),
		message: `Value must be one of: ${options.join(', ')}`
	}),

	/**
	 * Validates a password meets strength requirements
	 * @param options Password strength options
	 */
	password: (
		options: {
			minLength?: number;
			requireUppercase?: boolean;
			requireLowercase?: boolean;
			requireNumbers?: boolean;
			requireSpecialChars?: boolean;
		} = {}
	): Validator<string> => ({
		function: (value: string) => {
			const minLength = options.minLength || 8;

			if (value.length < minLength) return false;

			if (options.requireUppercase && !/[A-Z]/.test(value)) return false;
			if (options.requireLowercase && !/[a-z]/.test(value)) return false;
			if (options.requireNumbers && !/[0-9]/.test(value)) return false;
			if (options.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return false;

			return true;
		},
		message: 'Password does not meet strength requirements'
	}),

	/**
	 * Validates a semantic version string
	 */
	semver: (): Validator<string> => ({
		function: (value: string) => {
			return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(
				value
			);
		},
		message: 'Invalid semantic version format'
	}),

	/**
	 * Combines multiple validators with AND logic
	 * @param validators Array of validators to combine
	 */
	all: <T>(...validators: Validator<T>[]): Validator<T> => ({
		function: (value: T) => {
			for (const validator of validators) {
				const validatorFn = typeof validator === 'function' ? validator : validator.function;
				if (!validatorFn(value)) return false;
			}
			return true;
		},
		message: 'Failed to satisfy all validation requirements'
	}),

	/**
	 * Combines multiple validators with OR logic
	 * @param validators Array of validators to combine
	 */
	any: <T>(...validators: Validator<T>[]): Validator<T> => ({
		function: (value: T) => {
			for (const validator of validators) {
				const validatorFn = typeof validator === 'function' ? validator : validator.function;
				if (validatorFn(value)) return true;
			}
			return false;
		},
		message: 'Failed to satisfy any validation requirement'
	})
};

export default validators;
