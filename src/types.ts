export type EnumValues = readonly string[];

export type ConfigurationItem<Type> = BaseConfigurationItem<Type> | EnumConfigurationItem | ArrayConfiguration<Type>;

export interface ArrayConfiguration<Type> {
	type: 'array';
	items: ArrayItem<Type>;
	default?: Type[];
	required?: boolean;
	name: string;
}

export type ArrayItem<Type> = AtomicArrayItem<Type> | NestedArrayItem<Type>;

export interface AtomicArrayItem<Type> {
	type: 'string' | 'number' | 'boolean';
	default?: Type;
}

export interface NestedArrayItem<Type> {
	type: 'array';
	items: ArrayItem<Type>;
}

export interface BaseConfigurationItem<Type> {
	type: 'string' | 'number' | 'boolean';
	default?: Type;
	required?: boolean;
	name: string;
}

export interface EnumConfigurationItem {
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
	[key: string]: ConfigurationItem<any> | NestedConfiguration;
};

export interface ParsedConfig {
	[key: string]: any;
}
