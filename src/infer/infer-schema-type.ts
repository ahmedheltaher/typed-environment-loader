import { ArraySchema, EnumSchema, EnvironmentSchema, SchemaItem } from '../types';

type PrimitiveTypeMap = {
	string: string;
	number: number;
	boolean: boolean;
};

type InferPrimitive<Type extends { type: keyof PrimitiveTypeMap }> = PrimitiveTypeMap[Type['type']];

export type InferEnum<Type extends EnumSchema<any>> =
	Type extends EnumSchema<infer Values> ?
		Values extends readonly (infer EnumValue)[] ?
			EnumValue
		:	never
	:	never;

type InferArray<Type extends ArraySchema> =
	Type['items'] extends EnvironmentSchema ? Array<InferSchemaType<Type['items']>>
	: Type['items'] extends { type: 'string' | 'number' | 'boolean' } ? Array<PrimitiveTypeMap[Type['items']['type']]>
	: Type['items'] extends EnumSchema<any> ? Array<InferEnum<Type['items']>>
	: Type['items'] extends ArraySchema ? Array<InferArray<Type['items']>>
	: never;

export type InferSchemaType<Type extends EnvironmentSchema> = {
	[Key in keyof Type]: Type[Key] extends SchemaItem ?
		Type[Key] extends { type: 'string' | 'number' | 'boolean' } ? InferPrimitive<Type[Key]>
		: Type[Key] extends EnumSchema<any> ? InferEnum<Type[Key]>
		: Type[Key] extends ArraySchema ? InferArray<Type[Key]>
		: never
	: Type[Key] extends EnvironmentSchema ? InferSchemaType<Type[Key]>
	: never;
};

export type Expand<Type> =
	Type extends (...args: any[]) => any ? Type
	: Type extends Array<infer U> ? Array<Expand<U>>
	: Type extends object ? { [K in keyof Type]: Expand<Type[K]> }
	: Type;

export type InferSchemaTypeExpanded<Type extends EnvironmentSchema> = Expand<InferSchemaType<Type>>;

export type WithOptionals<Type extends EnvironmentSchema> = {
	[Key in keyof InferSchemaTypeExpanded<Type>]: Key extends keyof Type ?
		Type[Key] extends { required: false } | { required?: false } ?
			InferSchemaTypeExpanded<Type>[Key] | undefined
		:	InferSchemaTypeExpanded<Type>[Key]
	:	never;
};
