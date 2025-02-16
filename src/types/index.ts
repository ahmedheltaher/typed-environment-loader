import { ArraySchema } from './array';
import { EnumSchema } from './enum';
import { PrimitiveSchema } from './primitive';

export * from './array';
export * from './enum';
export * from './nested';
export * from './primitive';

export type SchemaItem = PrimitiveSchema | EnumSchema<readonly string[]> | ArraySchema;
