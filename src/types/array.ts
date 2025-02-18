type PrimitiveType = 'string' | 'number' | 'boolean';

type FlatArray = {
	type: PrimitiveType;
};

type NestedArray = {
	type: 'array';
	items: ArrayItemSchema;
};

export type ArrayItemSchema = FlatArray | NestedArray;

export type ArraySchema = {
	type: 'array';
	name?: string;
	items: ArrayItemSchema;
	default?: readonly unknown[] | unknown[]; // TODO: Use a generic type
	required?: boolean;
};
