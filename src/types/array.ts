export type ArrayItemSchema =
	| {
			type: 'string' | 'number' | 'boolean';
	  }
	| {
			type: 'array';
			items: {
				type: 'string' | 'number' | 'boolean';
			};
	  };

export type ArraySchema = {
	type: 'array';
	name?: string;
	items: ArrayItemSchema;
	default?: readonly unknown[] | unknown[];
	required?: boolean;
};
