import { ArraySchema, EnumSchema, EnvironmentSchema, PrimitiveSchema, SchemaItem } from '../types';

type InferPrimitive<Type> = Type extends { type: 'string' }
	? string
	: Type extends { type: 'number' }
		? number
		: Type extends { type: 'boolean' }
			? boolean
			: never;

type InferEnum<Type> = Type extends EnumSchema<infer Values> ? Values[number] : never;

type InferArray<Type> = Type extends { type: 'array'; items: infer Items }
	? Items extends { type: infer ItemType }
		? ItemType extends keyof PrimitiveMap
			? Array<PrimitiveMap[ItemType]>
			: Items extends { type: 'array'; items: infer NestedItems }
				? Array<Array<InferPrimitive<NestedItems>>>
				: never
		: never
	: never;

interface PrimitiveMap {
	string: string;
	number: number;
	boolean: boolean;
}

export type InferSchemaType<Type> = {
	[Key in keyof Type]: Type[Key] extends SchemaItem
		? Type[Key] extends PrimitiveSchema
			? InferPrimitive<Type[Key]>
			: Type[Key] extends EnumSchema<any>
				? InferEnum<Type[Key]>
				: Type[Key] extends ArraySchema
					? InferArray<Type[Key]>
					: never
		: Type[Key] extends EnvironmentSchema
			? InferSchemaType<Type[Key]>
			: never;
};
