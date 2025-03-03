import { Validator } from '../types';
import {
	AlphanumericValidatorOptions,
	DateValidatorOptions,
	PasswordValidatorOptions,
	URLValidatorOptions,
	UUIDVersion,
	ValidationMessage
} from './types';
import { createValidator } from './utils';
import { ValidationPatterns } from './validation-patterns';

/**
 * String format validators for common patterns
 */
export const formatValidators = {
	/**
	 * Validates that a string is a properly formatted email address
	 * @param customMessage Optional custom error message
	 */
	email: (customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => ValidationPatterns.email.test(value),
			customMessage || 'Invalid email format',
			'Validates email format (example@domain.com)'
		),

	/**
	 * Validates that a string is a properly formatted URL
	 * @param options Configuration options for URL validation
	 * @param customMessage Optional custom error message
	 */
	url: (options: URLValidatorOptions = {}, customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => {
				try {
					const url = new URL(value);

					if (options.protocols?.length) {
						const hasValidProtocol = options.protocols.some(
							protocol => url.protocol === protocol || url.protocol === `${protocol}:`
						);
						if (!hasValidProtocol) return false;
					}

					if (options.requireTld !== false) {
						const hostnameParts = url.hostname.split('.');
						const tld = hostnameParts[hostnameParts.length - 1];
						if (!tld || tld.length < 2) return false;
					}

					return true;
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (_) {
					return false;
				}
			},
			customMessage || 'Invalid URL format',
			'Validates URL format with configurable protocol and TLD requirements'
		),

	/**
	 * Validates that a string is a valid date
	 * @param options Configuration options for date validation
	 * @param customMessage Optional custom error message
	 */
	date: (options: DateValidatorOptions = {}, customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => {
				const format = options.format || 'any';

				switch (format) {
					case 'iso':
						return ValidationPatterns.dates.iso.test(value);
					case 'rfc3339':
						return ValidationPatterns.dates.rfc3339.test(value);
					case 'any':
						return !isNaN(new Date(value).getTime());
					default:
						return false;
				}
			},
			customMessage || `Invalid date format${options.format ? ` (${options.format})` : ''}`,
			'Validates dates in ISO, RFC3339, or any parseable format'
		),

	/**
	 * Validates that a string matches a UUID format
	 * @param version UUID version to validate (default: any)
	 * @param customMessage Optional custom error message
	 */
	uuid: (version?: UUIDVersion, customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => {
				const pattern = version ? ValidationPatterns.uuid[version] : ValidationPatterns.uuid.any;
				return pattern.test(value);
			},
			customMessage || (version ? `Invalid UUID v${version} format` : 'Invalid UUID format'),
			`Validates UUID${version ? ` v${version}` : ''} format`
		),

	/**
	 * Validates that a string is a valid hex color
	 * @param customMessage Optional custom error message
	 */
	hexColor: (customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => ValidationPatterns.hexColor.test(value),
			customMessage || 'Invalid hex color format (must be #RGB or #RRGGBB)',
			'Validates hexadecimal color codes (#RGB or #RRGGBB)'
		),

	/**
	 * Validates that a string is alphanumeric
	 * @param options Configuration options
	 * @param customMessage Optional custom error message
	 */
	alphanumeric: (options: AlphanumericValidatorOptions = {}, customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => {
				const pattern = ValidationPatterns.alphanumeric[options.allowSpaces ? 'withSpaces' : 'withoutSpaces'];
				return pattern.test(value);
			},
			customMessage ||
				(options.allowSpaces ?
					'Value must contain only letters, numbers, and spaces'
				:	'Value must contain only letters and numbers'),
			'Validates alphanumeric strings with optional space allowance'
		),

	/**
	 * Validates that a string matches a specific pattern
	 * @param name Name of the pattern (for error messages)
	 * @param regex Regular expression to test against
	 * @param customMessage Optional custom error message
	 */
	pattern: (name: string, regex: RegExp, customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => regex.test(value),
			customMessage || `Invalid ${name} format`,
			`Validates string against custom pattern: ${regex}`
		),

	/**
	 * Validates a semantic version string
	 * @param customMessage Optional custom error message
	 */
	semver: (customMessage?: ValidationMessage): Validator<string> =>
		createValidator(
			value => ValidationPatterns.semver.test(value),
			customMessage || 'Invalid semantic version format',
			'Validates semantic versioning format (e.g., 1.0.0, 2.3.0-beta.1)'
		),

	/**
	 * Validates a password meets strength requirements
	 * @param options Password strength options
	 * @param customMessage Optional custom error message
	 */
	password: (options: PasswordValidatorOptions = {}, customMessage?: ValidationMessage): Validator<string> => {
		const { requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = options;
		const minLength = options.minLength || 8;
		const requirements = [];

		if (requireUppercase) requirements.push('uppercase letters');
		if (requireLowercase) requirements.push('lowercase letters');
		if (requireNumbers) requirements.push('numbers');
		if (requireSpecialChars) requirements.push('special characters');

		const requirementsText = requirements.length ? ` Must include: ${requirements.join(', ')}` : '';

		return createValidator(
			value => {
				if (value.length < minLength) return false;
				if (requireUppercase && !ValidationPatterns.password.upperCaseChars.test(value)) return false;
				if (requireLowercase && !ValidationPatterns.password.lowerCaseChars.test(value)) return false;
				if (requireNumbers && !ValidationPatterns.password.numbers.test(value)) return false;
				if (requireSpecialChars && !ValidationPatterns.password.specialChars.test(value)) return false;

				return true;
			},
			customMessage || `Password must be at least ${minLength} characters.${requirementsText}`,
			'Validates password strength based on configurable requirements'
		);
	}
};
