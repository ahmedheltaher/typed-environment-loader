import { Transform, Validator } from './utils';

export interface BaseSchema {
	name?: string;
	required?: boolean;
	description?: string;
}

export interface StringSchema extends BaseSchema {
	type: 'string';
	default?: string;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp | string;
	validator?: Validator<string>;
	transform?: Transform<string>;
}

export interface NumberSchema extends BaseSchema {
	type: 'number';
	default?: number;
	min?: number;
	max?: number;
	integer?: boolean;
	validator?: Validator<number>;
	transform?: Transform<number>;
}

export interface BooleanSchema extends BaseSchema {
	type: 'boolean';
	default?: boolean;
}

export type PrimitiveSchema = StringSchema | NumberSchema | BooleanSchema;
