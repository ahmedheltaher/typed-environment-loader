export interface BaseSchema {
	name?: string;
	required?: boolean;
	description?: string; // Adding documentation capability
}

type ValidatorFunction<Type> = (value: Type) => boolean;
export type Validator<Type> =
	| ValidatorFunction<Type>
	| {
			function: ValidatorFunction<Type>;
			message: string;
			description?: string;
	  };

export interface StringSchema extends BaseSchema {
	type: 'string';
	default?: string;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp | string;
	validator?: Validator<string>;
}

export interface NumberSchema extends BaseSchema {
	type: 'number';
	default?: number;
	min?: number;
	max?: number;
	integer?: boolean;
	validator?: Validator<number>;
}

export interface BooleanSchema extends BaseSchema {
	type: 'boolean';
	default?: boolean;
}

export type PrimitiveSchema = StringSchema | NumberSchema | BooleanSchema;
