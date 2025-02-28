import { createDebugLogger } from './debug';
import { EnvironmentMissingError } from './errors';
import { WithOptionals } from './infer';
import { ParserRegistry } from './parsers/parser-registry';
import { EnvironmentSchema, SchemaItem } from './types';

type Environment = Record<string, string | undefined>;
type ParseStackItem = {
	schema: EnvironmentSchema;
	result: Record<string, unknown>;
	path: string[];
};

export interface EnvironmentLoaderConfig {
	separator?: string;
	prefix?: string;
	transformEnvKey?: (key: string) => string;
	transformPath?: (path: string[]) => string;
	defaultRequired?: boolean;
	logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
}

export class EnvironmentLoader<T extends EnvironmentSchema> {
	private readonly _debug = createDebugLogger(this.constructor.name);
	private readonly _parser = new ParserRegistry();
	private readonly _config: Required<EnvironmentLoaderConfig>;

	constructor(
		private readonly _schema: T,
		private readonly _env: Environment = process.env,
		config: EnvironmentLoaderConfig = {}
	) {
		this._config = {
			separator: config.separator || '__',
			prefix: config.prefix || '',
			transformEnvKey: config.transformEnvKey || (key => key.toUpperCase()),
			transformPath: config.transformPath || (path => path.join(this._config.separator)),
			defaultRequired: config.defaultRequired ?? false,
			logLevel: config.logLevel || 'error'
		};
	}

	public load(): WithOptionals<T> {
		this._debug.info('Starting to load environment variables');
		const result = {};

		const stack: Array<ParseStackItem> = [{ schema: this._schema, result, path: [] }];

		while (stack.length > 0) {
			const current = stack.pop()!;
			this._debug.info('Processing schema', current.schema, 'at path', current.path);
			const entries = Object.entries(current.schema).reverse();

			for (const [key, config] of entries) {
				const currentPath = [...current.path, key];
				const envKey = this.getEnvKey(config, currentPath);
				this._debug.info('Processing key', key, 'with config', config, 'and envKey', envKey);

				if (this.isSchemaItem(config)) {
					current.result[key] = this.parseValue(config, currentPath, envKey);
				} else {
					const nestedResult = {};
					current.result[key] = nestedResult;
					stack.push({
						schema: config,
						result: nestedResult,
						path: currentPath
					});
				}
			}
		}

		this._debug.info('Finished loading environment variables');
		return result as WithOptionals<T>;
	}

	private parseValue(schema: SchemaItem, path: string[], envKey: string): unknown {
		this._debug.info('Parsing value for envKey', envKey, 'at path', path);
		const envKeyTransformed = this._config.transformEnvKey(envKey);
		const value = this._env[envKeyTransformed]?.trim();

		if (!value) {
			this._debug.warn('Value for envKey', envKey, 'is missing');
			const isRequired = schema.required ?? this._config.defaultRequired;

			if (isRequired) {
				this._debug.warn('envKey', envKey, 'is required but missing, throwing error');
				throw new EnvironmentMissingError(envKey, path);
			}

			this._debug.info('Using default value for envKey', envKey);
			return this.handleDefault(schema.default);
		}

		this._debug.info('Parsing value', value, 'for envKey', envKey);
		return this._parser.parse<unknown>({ envKey, path, schema, value }).value;
	}

	private getEnvKey(config: SchemaItem | EnvironmentSchema, path: string[]): string {
		if ('name' in config && config.name) {
			return this._config.prefix + config.name;
		}

		return this._config.prefix + this._config.transformPath(path);
	}

	private handleDefault(defaultValue: SchemaItem['default']): SchemaItem['default'] {
		return Array.isArray(defaultValue) ? [...defaultValue] : defaultValue;
	}

	private isSchemaItem(value: SchemaItem | EnvironmentSchema): value is SchemaItem {
		return 'type' in value;
	}
}
