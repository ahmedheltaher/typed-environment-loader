import { debug, Debugger } from 'debug';

const DEBUG_NAMESPACE = 'ENVIRONMENT_LOADER';

/**
 * Logger levels for consistent log categorization
 */
export enum LogLevel {
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	TRACE = 'trace',
	DEBUG = 'debug'
}

/**
 * Interface for the logger object
 */
export interface Logger {
	info: Debugger;
	warn: Debugger;
	error: Debugger;
	trace: Debugger;
	debug: Debugger;
}

/**
 * Creates a structured logger with multiple severity levels
 * @param name - The logger name, typically the module name
 * @returns A logger object with methods for different severity levels
 */
export function createDebugLogger(name: string): Logger {
	const baseLogger = debug(`${DEBUG_NAMESPACE}:${name}`);

	return {
		info: baseLogger.extend(LogLevel.INFO),
		warn: baseLogger.extend(LogLevel.WARN),
		error: baseLogger.extend(LogLevel.ERROR),
		trace: baseLogger.extend(LogLevel.TRACE),
		debug: baseLogger.extend(LogLevel.DEBUG)
	};
}

/**
 * Creates a logger and immediately returns it
 * @example
 * const log = getLogger('config-service');
 * log.info('Configuration loaded');
 */
export function getLogger(name: string): Logger {
	return createDebugLogger(name);
}
