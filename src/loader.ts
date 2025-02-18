import { EnvironmentMissingError } from './errors';
import { InferSchemaType } from './infer';
import { ParserRegistry } from './parsers/parser-registry';
import { NestedSchema, SchemaItem } from './types';

type Environment = Record<string, string | undefined>;
type ParseStackItem = {
	schema: NestedSchema;
	result: Record<string, unknown>;
	path: string[];
};

export class EnvironmentLoader<T extends NestedSchema> {
	private readonly parser = new ParserRegistry();
	private readonly separator = '__';

	constructor(
		private readonly schema: T,
		private readonly env: Environment = process.env
	) {}

	public load(): InferSchemaType<T> {
		const result = {} as InferSchemaType<T>;

		const stack: Array<ParseStackItem> = [{ schema: this.schema, result, path: [] }];

		while (stack.length > 0) {
			const current = stack.pop()!;
			const entries = Object.entries(current.schema).reverse();

			for (const [key, config] of entries) {
				const currentPath = [...current.path, key];
				const envKey = this.getEnvKey(config, currentPath);

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

		return result;
	}

	private parseValue(schema: SchemaItem, path: string[], envKey: string): SchemaItem['default'] | unknown {
		const value = this.env[envKey.toUpperCase()]?.trim();

		if (!value) {
			if (schema.required) {
				throw new EnvironmentMissingError(envKey, path);
			}
			return this.handleDefault(schema.default);
		}

		return this.parser.parse({ envKey, path, schema, value }).value;
	}

	private getEnvKey(config: SchemaItem | NestedSchema, path: string[]): string {
		if ('name' in config && config.name) return config.name as string;
		return path.join(this.separator).toUpperCase();
	}

	private handleDefault(defaultValue: SchemaItem['default']): SchemaItem['default'] {
		return Array.isArray(defaultValue) ? [...defaultValue] : defaultValue;
	}

	private isSchemaItem(value: SchemaItem | NestedSchema): value is SchemaItem {
		return 'type' in value;
	}
}
