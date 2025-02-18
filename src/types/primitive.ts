interface BaseSchema {
	name?: string;
	required?: boolean;
}

interface StringSchema extends BaseSchema {
	type: 'string';
	default?: string;
}

interface NumberSchema extends BaseSchema {
	type: 'number';
	default?: number;
}

interface BooleanSchema extends BaseSchema {
	type: 'boolean';
	default?: boolean;
}

export type PrimitiveSchema = StringSchema | NumberSchema | BooleanSchema;
