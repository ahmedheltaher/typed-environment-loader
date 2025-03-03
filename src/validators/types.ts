// types.ts
/**
 * Options for URL validation
 */
export type URLValidatorOptions = {
	/**
	 * List of allowed protocols (e.g., ['http', 'https'])
	 * If provided, the URL must use one of these protocols
	 */
	protocols?: string[];

	/**
	 * Whether to require a top-level domain in the URL
	 * Defaults to true
	 */
	requireTld?: boolean;
};

/**
 * Options for date validation
 */
export type DateValidatorOptions = {
	/**
	 * Date format to validate against
	 * - 'iso': ISO 8601 format (e.g., 2023-01-15T12:30:45Z)
	 * - 'rfc3339': RFC 3339 format (e.g., 2023-01-15T12:30:45Z, 2023-01-15T12:30:45+01:00)
	 * - 'any': Any valid JavaScript Date format
	 * Defaults to 'any'
	 */
	format?: 'iso' | 'rfc3339' | 'any';
};

/**
 * UUID version for validation
 */
export type UUIDVersion = 1 | 3 | 4 | 5;

/**
 * Options for alphanumeric validation
 */
export type AlphanumericValidatorOptions = {
	/**
	 * Whether to allow spaces in the alphanumeric string
	 * Defaults to false
	 */
	allowSpaces?: boolean;
};

/**
 * Options for password validation
 */
export type PasswordValidatorOptions = {
	/**
	 * Minimum length required for the password
	 * Defaults to 8
	 */
	minLength?: number;

	/**
	 * Whether to require at least one uppercase letter
	 * Defaults to false
	 */
	requireUppercase?: boolean;

	/**
	 * Whether to require at least one lowercase letter
	 * Defaults to false
	 */
	requireLowercase?: boolean;

	/**
	 * Whether to require at least one number
	 * Defaults to false
	 */
	requireNumbers?: boolean;

	/**
	 * Whether to require at least one special character
	 * Defaults to false
	 */
	requireSpecialChars?: boolean;
};

/**
 * Validation message that can be a string or a function that returns a string
 * Using a function allows for dynamic error messages based on validation context
 */
export type ValidationMessage = string | (() => string);

/**
 * Options for validating the length of strings, arrays, or other length-based collections.
 * Provides flexibility to specify minimum, maximum, or exact length requirements.
 */
export type LengthValidatorOptions = {
	/**
	 * The minimum length required (inclusive).
	 * When specified, the validated value must have at least this many items/characters.
	 */
	min?: number;

	/**
	 * The maximum length allowed (inclusive).
	 * When specified, the validated value must not have more than this many items/characters.
	 */
	max?: number;

	/**
	 * The exact length required.
	 * When specified, the validated value must have exactly this many items/characters.
	 * Note: If 'exact' is specified, 'min' and 'max' values are ignored.
	 */
	exact?: number;
};
