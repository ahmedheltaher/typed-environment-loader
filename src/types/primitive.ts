export type PrimitiveSchema =
	| {
			type: 'string';
			name?: string;
			default?: string;
			required?: boolean;
	  }
	| {
			type: 'number';
			name?: string;
			default?: number;
			required?: boolean;
	  }
	| {
			type: 'boolean';
			name?: string;
			default?: boolean;
			required?: boolean;
	  };
