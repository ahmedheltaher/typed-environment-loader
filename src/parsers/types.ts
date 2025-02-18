import { ArraySchema, EnumSchema, PrimitiveSchema, SchemaItem } from '../types';

export interface ParserContext {
	envKey: string;
	path: string[];
	schema: SchemaItem;
	value: string;
}

export interface ParserResult {
	value: unknown;
}

export type ParserTypeMap = {
	string: PrimitiveSchema;
	number: PrimitiveSchema;
	boolean: PrimitiveSchema;
	enum: EnumSchema<readonly string[]>;
	array: ArraySchema;
};

export interface Parser {
	parse(ctx: ParserContext): ParserResult;
}

export type SchemaType<T extends SchemaItem> = T extends { type: infer K extends keyof ParserTypeMap }
	? ParserTypeMap[K]
	: never;
