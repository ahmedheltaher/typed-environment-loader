import { debug } from 'debug';

const DEBUG_NAME = 'ENVIRONMENT_LOADER';

export function createDebugLogger(name: string) {
	const baseLogger = debug(`${DEBUG_NAME}:${name}`);
	return {
		info: baseLogger.extend('info'),
		warn: baseLogger.extend('warn'),
		error: baseLogger.extend('error'),
		trace: baseLogger.extend('trace')
	};
}
