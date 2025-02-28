import { ArraySchema } from './array';
import { EnumSchema } from './enum';
import { PrimitiveSchema } from './primitive';

export type SchemaItem = PrimitiveSchema | EnumSchema<readonly string[]> | ArraySchema;

export type EnvironmentSchema = {
	[key: string]: SchemaItem | EnvironmentSchema;
};
