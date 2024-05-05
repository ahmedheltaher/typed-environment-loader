export type EnumValues = readonly string[];

export type ConfigurationItem<Type> = BaseConfigurationItem<Type> | EnumConfigurationItem;

interface BaseConfigurationItem<Type> {
	type: 'string' | 'number' | 'boolean';
	default?: Type;
	required?: boolean;
	name: string;
}

interface EnumConfigurationItem {
	type: 'enum';
	values: EnumValues;
	default: string;
	required?: boolean;
	name: string;
}

export type Configuration = {
	[key: string]: ConfigurationItem<any> | NestedConfiguration;
};

export type NestedConfiguration = {
	[key: string]: ConfigurationItem<any>;
};

export interface ParsedConfig {
	[key: string]: any;
}
