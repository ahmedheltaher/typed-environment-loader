import { debug } from 'debug';

const DEBUG_NAME = 'ENVIRONMENT_LOADER';

function createDebug(name: string) {
	return debug(`${DEBUG_NAME}:${name}`);
}

export function createDebugLogger(name: string) {
	const logger = createDebug(name);
	return {
		info: logger.extend('info'),
		warn: logger.extend('warn'),
		error: logger.extend('error'),
		trace: logger.extend('trace')
	};
}
