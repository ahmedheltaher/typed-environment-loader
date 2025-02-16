import { SchemaItem } from './index';

export type NestedSchema = {
	[key: string]: SchemaItem | NestedSchema;
};
