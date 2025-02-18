import { EnumSchema, EnvironmentSchema, SchemaItem } from '../types';

type InferPrimitive<Type> =
	Type extends { type: 'string' } ? string
	: Type extends { type: 'number' } ? number
	: Type extends { type: 'boolean' } ? boolean
	: never;

export type InferEnum<Type> = Type extends { type: 'enum'; values: readonly (infer EnumValue)[] } ? EnumValue : never;

type InferArray<Type> =
	Type extends { type: 'array'; items: infer Items } ?
		Items extends { type: infer ItemType } ?
			ItemType extends keyof PrimitiveMap ? Array<PrimitiveMap[ItemType]>
			: Items extends { type: 'array' } ? Array<InferArray<Items>>
			: never
		:	never
	:	never;

interface PrimitiveMap {
	string: string;
	number: number;
	boolean: boolean;
}

export type InferSchemaType<Type> = {
	[Key in keyof Type]: Type[Key] extends SchemaItem ?
		Type[Key] extends { type: 'string' | 'number' | 'boolean' } ? InferPrimitive<Type[Key]>
		: Type[Key] extends EnumSchema<any> ? InferEnum<Type[Key]>
		: Type[Key] extends { type: 'array' } ? InferArray<Type[Key]>
		: never
	: Type[Key] extends EnvironmentSchema ? InferSchemaType<Type[Key]>
	: never;
};

export type Expand<Input> =
	Input extends (...args: any[]) => any ? Input
	: Input extends Array<infer Element> ? Array<Expand<Element>>
	: Input extends object ? { [Key in keyof Input]: Expand<Input[Key]> }
	: Input;

export type InferSchemaTypeExpanded<Type> = Expand<InferSchemaType<Type>>;
