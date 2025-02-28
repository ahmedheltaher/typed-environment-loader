import { EnumSchema } from './enum';
import { BaseSchema, PrimitiveSchema, Validator } from './primitive';

export type ArrayItemSchema = PrimitiveSchema | EnumSchema<readonly string[]> | ArraySchema;

export interface ArraySchema<Type = unknown> extends BaseSchema {
	type: 'array';
	items: ArrayItemSchema;
	default?: readonly Type[];
	minItems?: number;
	maxItems?: number;
	validator?: Validator<any>;
}
