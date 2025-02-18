import { ArraySchema, EnumSchema, PrimitiveSchema, SchemaItem } from '.';

export interface ParserContext {
	envKey: string;
	path: string[];
	schema: SchemaItem;
	value: string;
}

export interface ParserResult {
	value: unknown; // TODO: Use a generic type
}

export type ParserTypeMap = {
	string: PrimitiveSchema;
	number: PrimitiveSchema;
	boolean: PrimitiveSchema;
	enum: EnumSchema<readonly string[]>;
	array: ArraySchema;
};

export interface Parser {
	parse(context: ParserContext): ParserResult;
}

export type SchemaType<Type extends SchemaItem> =
	Type extends { type: infer Key extends keyof ParserTypeMap } ? ParserTypeMap[Key] : never;
