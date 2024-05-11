import { Parsers, parsers } from './parsers';
import { Configuration, ConfigurationItem, ParsedConfig } from './types';

export class EnvironmentLoader<ResultType extends ParsedConfig> {
	private config: Configuration;
	private parsers: Parsers = parsers;

	constructor(config: Configuration) {
		this.config = config;
	}

	private isConfigItem(value: Configuration | ConfigurationItem<any>): value is ConfigurationItem<any> {
		return typeof value === 'object' && value.type !== undefined && value.name !== undefined;
	}

	public load(): ResultType {
		const parsedConfig = {} as ResultType;
		const stack: {
			parent: ResultType[keyof ResultType] | ParsedConfig[keyof ParsedConfig];
			current: Configuration | ConfigurationItem<any>;
		}[] = [{ parent: parsedConfig, current: this.config }];

		while (stack.length > 0) {
			const { parent, current } = stack.pop()!;
			for (const [key, value] of Object.entries(current)) {
				if (this.isConfigItem(value)) {
					parent[key] = this.loadConfigItem(value);
				} else {
					parent[key] = {};
					stack.push({ parent: parent[key], current: value as Configuration });
				}
			}
		}

		return parsedConfig;
	}

	private loadConfigItem(item: ConfigurationItem<any>): any {
		const { type, default: defaultValue, required, name } = item;
		const value = process.env[name];

		if (value === undefined) {
			if (required) {
				throw new Error(`Missing required environment variable ${name}`);
			}
			return defaultValue;
		}

		switch (type) {
			case 'string':
				return this.parsers.string(value, name);
			case 'number':
				return this.parsers.number(value, name);
			case 'boolean':
				return this.parsers.boolean(value, name);
			case 'enum':
				return this.parsers.enum(value, item.values, name);
			case 'array':
				return this.parsers.array(value, item.items, name);
			default:
				throw new Error(`Unsupported type ${type}`);
		}
	}
}
