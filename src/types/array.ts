import { EnumSchema } from './enum';
import { BaseSchema, PrimitiveSchema } from './primitive';
import { Transform, Validator } from './utils';

export type ArrayItemSchema = PrimitiveSchema | EnumSchema<readonly string[]> | ArraySchema;

export interface ArraySchema<Type = unknown> extends BaseSchema {
	type: 'array';
	items: ArrayItemSchema;
	default?: readonly Type[];
	minItems?: number;
	maxItems?: number;
	validator?: Validator<any>;
	transform?: Transform<any>;
}
