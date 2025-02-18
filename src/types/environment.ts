import { SchemaItem } from './index';

export type EnvironmentSchema = {
	[key: string]: SchemaItem | EnvironmentSchema;
};
