import { createDebugLogger } from './debug';
import { EnvironmentMissingError } from './errors';
import { InferSchemaTypeExpanded } from './infer';
import { ParserRegistry } from './parsers/parser-registry';
import { EnvironmentSchema, SchemaItem } from './types';

type Environment = Record<string, string | undefined>;
type ParseStackItem = {
	schema: EnvironmentSchema;
	result: Record<string, unknown>;
	path: string[];
};

type EnvironmentLoaderConfig = {
	separator?: string;
};

export class EnvironmentLoader<Type extends EnvironmentSchema> {
	private readonly _debug = createDebugLogger(this.constructor.name);
	private readonly _parser = new ParserRegistry();
	private _separator = '__';

	constructor(
		private readonly _schema: Type,
		private readonly _env: Environment = process.env,
		readonly _options: EnvironmentLoaderConfig = {}
	) {
		if (_options.separator) this._separator = _options.separator as string;
	}

	public load(): InferSchemaTypeExpanded<Type> {
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
		return result as InferSchemaTypeExpanded<Type>;
	}

	private parseValue(schema: SchemaItem, path: string[], envKey: string): SchemaItem['default'] | unknown {
		this._debug.info('Parsing value for envKey', envKey, 'at path', path);
		const value = this._env[envKey.toUpperCase()]?.trim();

		if (!value) {
			this._debug.warn('Value for envKey', envKey, 'is missing');
			if (schema.required) {
				this._debug.warn('envKey', envKey, 'is required but missing, throwing error');
				throw new EnvironmentMissingError(envKey, path);
			}
			this._debug.info('Using default value for envKey', envKey);
			return this.handleDefault(schema.default);
		}

		this._debug.info('Parsing value', value, 'for envKey', envKey);
		return this._parser.parse({ envKey, path, schema, value }).value;
	}

	private getEnvKey(config: SchemaItem | EnvironmentSchema, path: string[]): string {
		if ('name' in config && config.name) return config.name as string;
		return path.join(this._separator).toUpperCase();
	}

	private handleDefault(defaultValue: SchemaItem['default']): SchemaItem['default'] {
		return Array.isArray(defaultValue) ? [...defaultValue] : defaultValue;
	}

	private isSchemaItem(value: SchemaItem | EnvironmentSchema): value is SchemaItem {
		return 'type' in value;
	}
}
