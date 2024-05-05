import * as dotenv from 'dotenv';
import { Parsers, parsers } from './parsers';
import { Configuration, ConfigurationItem, ParsedConfig } from './types';

export class EnvironmentLoader<ResultType extends ParsedConfig> {
	private config: Configuration;
	private parsers: Parsers = parsers;

	constructor(config: Configuration) {
		this.config = config;
	}

	loadFromFile() {
		const loadedEnv = dotenv.config({});
		if (loadedEnv.error) {
			throw new Error(
				`Error loading environment variables from.env file it must be located in the root of the project.`
			);
		}
		return this;
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
				return this.parsers.stringParser(value, name);
			case 'number':
				return this.parsers.numberParser(value, name);
			case 'boolean':
				return this.parsers.booleanParser(value, name);
			case 'enum':
				return this.parsers.enumParser(value, item.values, name);
			default:
				throw new Error(`Unsupported type ${type}`);
		}
	}
}
