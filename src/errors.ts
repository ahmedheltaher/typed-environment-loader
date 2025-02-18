export class EnvironmentError extends Error {
	constructor(
		message: string,
		public readonly path: string[],
		options?: ErrorOptions
	) {
		super(message, options);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class EnvironmentMissingError extends EnvironmentError {
	constructor(envKey: string, path: string[], cause?: Error) {
		super(`Missing required environment variable: ${envKey}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentMissingError.prototype);
	}
}

export class EnvironmentValidationError extends EnvironmentError {
	constructor(envKey: string, message: string, path: string[], cause?: Error) {
		super(`Invalid value for ${envKey}: ${message}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentValidationError.prototype);
	}
}

export class EnvironmentParseError extends EnvironmentError {
	constructor(envKey: string, message: string, path: string[], cause?: Error) {
		super(`Parse error for ${envKey}: ${message}`, path, { cause });
		Object.setPrototypeOf(this, EnvironmentParseError.prototype);
	}
}
