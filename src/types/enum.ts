import { BaseSchema } from './primitive';

export interface EnumSchema<T extends readonly string[]> extends BaseSchema {
	type: 'enum';
	values: T;
	default?: T[number];
}
