export class EnvironmentError extends Error {
	constructor(
		message: string,
		public readonly path: string[],
		options?: ErrorOptions
	) {
		super(message, options);
		this.name = this.constructor.name;

		// Only capture stack trace if Error.captureStackTrace is available (Node.js)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	/**
	 * Returns a formatted string showing the path where the error occurred
	 */
	getPathString(): string {
		return this.path.join('.');
	}
}

export class EnvironmentMissingError extends EnvironmentError {
	constructor(
		public readonly envKey: string,
		path: string[],
		cause?: Error
	) {
		super(`Missing required environment variable: ${envKey}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentMissingError.prototype);
	}
}

export class EnvironmentValidationError extends EnvironmentError {
	constructor(
		public readonly envKey: string,
		public readonly validationMessage: string,
		path: string[],
		cause?: Error
	) {
		super(`Invalid value for ${envKey}: ${validationMessage}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentValidationError.prototype);
	}
}

export class EnvironmentTransformError extends EnvironmentError {
	constructor(
		public readonly envKey: string,
		public readonly transformMessage: string,
		path: string[],
		cause?: Error
	) {
		super(`Transform error for ${envKey}: ${transformMessage}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentTransformError.prototype);
	}
}

export class EnvironmentParseError extends EnvironmentError {
	constructor(
		public readonly envKey: string,
		public readonly parseMessage: string,
		path: string[],
		cause?: Error
	) {
		super(`Parse error for ${envKey}: ${parseMessage}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentParseError.prototype);
	}
}
